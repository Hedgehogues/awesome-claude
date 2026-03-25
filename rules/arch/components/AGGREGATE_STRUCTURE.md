---
paths:
  - "src/domain/**"
  - "src/infrastructure/database/**"
  - "tests/**"
---

# Aggregate Structure — код, repo, модели, тесты

## Контекст

Этот документ описывает полную структуру агрегата: от доменной сущности до
тестов. Каждый агрегат — это транзакционная граница. Один агрегат может содержать
root entity, child entities и value objects. Все они персистятся через один
репозиторий, но могут маппиться на несколько SQLAlchemy-моделей (таблиц).

## Структура файлов агрегата

```
src/domain/{aggregate_name}/
├── __init__.py
├── entity.py          # Root entity + child entities + value objects
└── repository.py      # Абстрактный интерфейс (ABC)

src/infrastructure/database/
├── {aggregate_name}_repo.py   # SQLAlchemy-реализация репозитория
└── models.py                  # {Name}Model + child models

tests/unit/
└── test_{aggregate_name}.py   # Unit-тесты entity

tests/state/
└── test_{aggregate_name}_state_machine.py  # State matrix (если есть state machine)
```

## Доменный слой (`entity.py`)

### Root entity

```python
@dataclass
class MyAggregate:
    aggregate_id: uuid.UUID
    # ... поля ...
    version: int = 1

    @staticmethod
    def create(...) -> MyAggregate:
        """Фабрика. Единственный способ создать агрегат. Всегда возвращает валидное состояние."""
        return MyAggregate(aggregate_id=uuid.uuid4(), ...)

    def mutating_method(self) -> None:
        """Каждый мутирующий метод ОБЯЗАН делать self.version += 1."""
        # Проверка инварианта
        if self.status != ...:
            raise InvalidStateError(...)
        self.field = new_value
        self.version += 1
```

### Child entities и value objects

Живут в том же `entity.py`. Создаются через фабрику, не имеют собственного
`version` (версионируется root). Не имеют собственного репозитория.

```python
@dataclass
class ChildEntity:
    child_id: uuid.UUID
    parent_id: uuid.UUID
    # ... поля ...

    @staticmethod
    def create(parent_id: uuid.UUID, ...) -> ChildEntity:
        return ChildEntity(child_id=uuid.uuid4(), parent_id=parent_id, ...)
```

Root управляет коллекцией children:

```python
# В root entity:
children: list[ChildEntity] = field(default_factory=list)

def add_child(self, child: ChildEntity) -> None:
    self.children.append(child)
    self.version += 1

def get_child_by_id(self, child_id: uuid.UUID) -> ChildEntity:
    child = next((c for c in self.children if c.child_id == child_id), None)
    if child is None:
        raise ChildNotFoundError(...)
    return child
```

## Абстрактный репозиторий (`repository.py`)

```python
class MyAggregateRepository(ABC):
    @abstractmethod
    async def save(self, aggregate: MyAggregate) -> None: ...

    @abstractmethod
    async def update(self, aggregate: MyAggregate) -> None: ...

    @abstractmethod
    async def get_by_id(self, aggregate_id: uuid.UUID) -> MyAggregate | None: ...
```

Репозиторий оперирует **только root entity**. Вложенные сущности сохраняются/
загружаются внутри реализации, но API репозитория принимает и возвращает только root.

## SQLAlchemy модели (`models.py`)

Один агрегат → одна или несколько таблиц. Child entities маппятся на отдельные
таблицы с ForeignKey **только внутри агрегата**.

```python
class MyAggregateModel(Base):
    __tablename__ = "my_aggregates"
    aggregate_id = mapped_column(UUID, primary_key=True)
    # ... поля root ...
    version = mapped_column(Integer, nullable=False, default=1)

class ChildEntityModel(Base):
    __tablename__ = "child_entities"
    child_id = mapped_column(UUID, primary_key=True)
    parent_id = mapped_column(UUID, ForeignKey("my_aggregates.aggregate_id", ondelete="CASCADE"))
    # ... поля child ...
```

**Правила FK:**
- FK **внутри** агрегата (child → root) — обязателен, с `ondelete="CASCADE"`.
- FK **между** агрегатами — запрещён. Связь только по значению UUID, без constraint.

## Реализация репозитория (`{name}_repo.py`)

Repo импортирует **все** модели своего агрегата (root + children):

```python
from src.infrastructure.database.models import MyAggregateModel, ChildEntityModel
```

Это не нарушение изоляции — repo отвечает за весь агрегат. Архитектурный тест
`test_repository_isolation.py` проверяет по маппингу `AGGREGATE_MODELS` из
`tests/architecture/conftest.py`.

**Optimistic locking в update:**

```python
async def update(self, aggregate: MyAggregate) -> None:
    expected_version = aggregate.version - 1
    stmt = update(Model).where(
        Model.id == aggregate.id,
        Model.version == expected_version,  # Проверка конкурентности
    ).values(...)
    result = await self._session.execute(stmt)
    if result.rowcount == 0:
        raise StaleDataError(...)
```

**Nested persistence:**
- `save()` — сохраняет root + все children в одной транзакции.
- `update()` — синхронизирует children (add new, update existing, delete removed).
- `get_by_id()` — загружает root + все children, собирает в domain entity.

## Регистрация в архитектурных тестах

При создании нового агрегата обновить:

### 1. `tests/architecture/conftest.py: AGGREGATE_MODELS`

Единый источник правды — какие модели принадлежат какому агрегату:

```python
AGGREGATE_MODELS = {
    "my_aggregate": {"MyAggregateModel", "ChildEntityModel"},
    ...
}
```

Используется в:
- `test_repository_isolation.py` — repo импортирует только модели своего агрегата
- `test_model_isolation.py` — FK/relationship не пересекают границы агрегатов

### 2. `test_model_schema_contract.py: EXPECTED_COLUMNS`

Контракт колонок каждой модели:

```python
EXPECTED_COLUMNS = {
    "MyAggregateModel": {"aggregate_id", "field1", "version", ...},
    "ChildEntityModel": {"child_id", "parent_id", ...},
}
MODEL_CLASSES = {
    "MyAggregateModel": MyAggregateModel,
    "ChildEntityModel": ChildEntityModel,
}
```

## Тесты

### Unit-тесты (`tests/unit/test_{name}.py`)

Тестируют domain entity в изоляции, без инфраструктуры:

- Фабрика `create()` — начальное состояние, инварианты
- Каждый мутирующий метод — переход состояния, version bump
- Невалидные переходы — raises domain exception
- Edge cases: retry behavior, boundary values, non-obvious side effects

**Не тестировать:** passthrough конструктора, default values, Python fundamentals.

### State-тесты (`tests/state/test_{name}_state_machine.py`)

Если агрегат имеет status/state field — exhaustive matrix:

```
Axes: status × operation
Full Cartesian product через @pytest.mark.parametrize
Invariant: OK transitions bump version, forbidden transitions raise
```

### Cases-тесты (`tests/cases/test_{flow}_flow.py`)

Multi-step бизнес-сценарии через цепочку use cases:

- Happy path: create → process → complete
- Partial failure: some steps fail, system в консистентном состоянии
- Retry: fail → retry → succeed

### Architecture-тесты

Автоматические — подхватываются при добавлении в `AGGREGATE_MODELS` и
`EXPECTED_COLUMNS`. Проверяют R1–R5 без ручной конфигурации.

## Чеклист нового агрегата

- [ ] `src/domain/{name}/__init__.py`
- [ ] `src/domain/{name}/entity.py` — root + children, `version: int`, фабрика `create()`
- [ ] `src/domain/{name}/repository.py` — абстрактный ABC
- [ ] `src/infrastructure/database/models.py` — модели с `version`, FK внутри агрегата
- [ ] `src/infrastructure/database/{name}_repo.py` — SQLAlchemy-реализация
- [ ] `src/dependencies.py` — экспорт repo
- [ ] `tests/architecture/conftest.py: AGGREGATE_MODELS` — маппинг
- [ ] `test_model_schema_contract.py` — EXPECTED_COLUMNS + MODEL_CLASSES
- [ ] `tests/unit/test_{name}.py` — entity unit-тесты
- [ ] `tests/state/test_{name}_state_machine.py` — если есть state machine
