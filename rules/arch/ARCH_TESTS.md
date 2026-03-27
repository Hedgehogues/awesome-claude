---
paths:
  - "tests/architecture/**"
  - "tests/unit/**"
  - "src/domain/**"
  - "src/infrastructure/database/**"
  - "src/infrastructure/llm/**"
  - "src/presentation/**"
---

# Architecture Tests — автоматическая валидация DDD-контрактов

## Контекст
Архитектурные правила проекта проверяются автоматически через pytest + ast.
Тесты живут в `tests/architecture/`, запускаются через `make architecture-check`
и встроены в `make check` (между lint и unit tests). Нулевые внешние зависимости —
только стандартный модуль `ast` и pytest.

## Авто-обнаружение
Агрегаты обнаруживаются автоматически через `src/domain/*/entity.py`. При
добавлении нового агрегата (например `src/domain/notification/entity.py`) все
тесты подхватывают его без ручной конфигурации.

## Правила и тесты

### R1: Изоляция агрегатов (`test_aggregate_isolation.py`)
- Файлы внутри `src/domain/{aggregate}/` не импортируют из
  `src.domain.{другой_агрегат}`.
- Импорт из корневого `src.domain` — разрешён.

### R2: Границы слоёв (`test_layer_boundaries.py`)

Однонаправленный граф зависимостей между слоями DDD. Нарушение любого из
суб-правил означает утечку инфраструктурных деталей в бизнес-логику или
образование циклической зависимости между слоями.

**R2a: Domain → no outer layers**
- Файлы `src/domain/**` не импортируют из `src.application`, `src.infrastructure`,
  `src.presentation`.
- Зачем: domain — ядро системы, не знает о существовании внешних слоёв. Это
  позволяет тестировать бизнес-логику без БД, HTTP и LLM.

**R2b: Application → no presentation**
- Файлы `src/application/**` не импортируют из `src.presentation`.
- Зачем: use cases не должны знать о конкретном способе доставки (API, CLI, Telegram).

**R2d: Presentation → no infrastructure**
- Файлы `src/presentation/**` не импортируют из `src.infrastructure`.
- Зачем: presentation получает зависимости через composition root
  (`src.dependencies`), а не создаёт их напрямую. Это обеспечивает инверсию
  зависимостей и тестируемость хэндлеров.

**R2e: Infrastructure → no presentation**
- Файлы `src/infrastructure/**` не импортируют из `src.presentation`.
- Зачем: репозитории, LLM-клиенты и прочая инфраструктура не должны знать
  о формате ответов API или структуре view-моделей.

**R2f: Запрет внешних инфраструктурных библиотек**
- Domain и application не импортируют: `sqlalchemy`, `fastapi`, `httpx`, `openai`,
  `aiohttp`, `requests`, `flask`, `django`.
- Presentation не импортирует: `sqlalchemy`.
- Зачем: прямой импорт ORM/HTTP-библиотек в бизнес-слоях создаёт жёсткую
  связанность. Домен работает с абстрактными репозиториями, а не с
  `sqlalchemy.Session`.

### R3: Изоляция репозиториев (`test_repository_isolation.py`)
- `{aggregate}_repo.py` импортирует из `models.py` только модели **своего
  агрегата** (root + child entities + value objects). Чужие модели запрещены.
- Разрешённые модели определяются маппингом `AGGREGATE_MODELS` в
  `tests/architecture/conftest.py` — единый источник правды.
- Имя файла repo определяет агрегат: `order_repo.py` →
  aggregate `order` → `{OrderModel, OrderItemModel, OrderStatusModel}`.

### R4: Версионирование агрегатов (`test_aggregate_versioning.py`)
- Каждый агрегат (dataclass в entity.py) имеет поле `version: int`.
- Каждый мутирующий метод (содержит `self.x = ...`) выполняет
  `self.version += 1`.
- Исключения: dunder-методы, @property, @staticmethod, @classmethod,
  методы без модификации self.

### R5: Изоляция моделей БД (`test_model_isolation.py`)
- Модели разных агрегатов не имеют `ForeignKey` на таблицы друг друга.
- Модели разных агрегатов не имеют `relationship()` друг к другу.
- Связь между агрегатами — только по значению ID (UUID), без FK-constraint.

### R6: Изоляция view-модулей (`test_view_isolation.py`)
- View-модули одного bounded context не импортируют из домена другого.
- Общие view-модули (`common.py`) не импортируют из `src.domain.*` вообще.

### R7: Изоляция handlers (`test_handler_isolation.py`)
- Handlers не импортируют напрямую из `src.application.use_cases.*` (кроме `errors`).
- Handlers не импортируют из `src.infrastructure.database.*_repo`.
- Handlers используют service layer.

### R8: LLM Security (`test_llm_security.py`)
- LLM-derived fields (`score`, `explanation`, `risks`, `generated_question`, `title`)
  must not be used in if-conditions that control authorization or access.
- If-conditions comparing LLM field values (not None-checks) must not have
  authorization-related calls, exceptions, or assignments in their body.
- Files importing LLM types must not also import authorization/permission modules.
- Scans: `src/application/**`, `src/presentation/**`.

### R9: Контракт схемы моделей (`test_model_schema_contract.py`)

Статическая проверка соответствия SQLAlchemy-моделей эталонному контракту.
Ловит рассинхрон между кодом модели и реальной схемой БД на этапе тестов,
до применения миграции.

**R9a: Точное совпадение колонок**
- Набор колонок каждой SQLAlchemy-модели (`__table__.columns`) должен точно
  совпадать с эталонным словарём `EXPECTED_COLUMNS` в тесте.
- При несовпадении тест показывает diff: какие колонки лишние, каких не хватает.
- Зачем: если разработчик добавил поле в модель, но не создал миграцию (или
  наоборот — сгенерировал миграцию, но забыл обновить модель), тест это поймает.

**R9b: Полнота покрытия контрактом**
- Каждая таблица, зарегистрированная в `Base.metadata`, обязана присутствовать
  в `EXPECTED_COLUMNS`. Нельзя добавить новую модель без обновления контракта.
- Зачем: гарантирует, что новые модели не проскочат без явного описания
  ожидаемой структуры.

**R9c: Негативные проверки (удалённые/перенесённые поля)**
- Явные assert-ы на отсутствие конкретных колонок, которые были удалены или
  перенесены в другой агрегат.
- Зачем: защита от регрессии — если кто-то случайно вернёт удалённое поле,
  тест сломается с объяснением, почему это поле было убрано.

### R11: Изоляция границ сущностей (`test_entity_boundary_isolation.py`)

Проверяет, что dataclass-поля в `entity.py` не содержат UUID-ссылок
на другие агрегаты. Поля типа `uuid.UUID`, оканчивающиеся на `_id`,
сопоставляются с именами агрегатов через суффиксную декомпозицию.

- Корневой агрегат (например `project_id`) разрешён глобально.
- Самоссылки (поле суффиксно совпадает с текущим агрегатом) игнорируются.
- Ложные совпадения (внешние ID, собственные идентификаторы) — в `IGNORED_ENTITY_FIELDS`.
- Все остальные кросс-агрегатные UUID-ссылки — нарушение.
- Мета-тест: каждый агрегат достижим через суффиксную карту.

### R12: Scope агрегатов в use cases (`test_use_case_aggregate_scope.py`)

Проверяет, что каждый use case трогает не более одного агрегата через
свои репозитории. Маппинг `RepositoryClass → aggregate` строится
автоматически из `src/domain/**/repository*.py`.

**R12a: Single-aggregate scope**
- Для каждого `*UseCase`-класса AST-парсится `__init__`, извлекаются
  параметры с аннотацией `*Repository`, и по карте определяются агрегаты.
- Если агрегатов > 1, use case обязан быть в `ALLOWED_MULTI_AGGREGATE_USE_CASES`
  с **точным** набором агрегатов (не подмножество, не надмножество).
- Зачем: предотвращает случайное связывание агрегатов через application layer —
  слепую зону для R1 (domain) и R3 (infrastructure).

**R12b: Allowlist без мертвых записей**
- Каждый ключ в allowlist должен быть реальным multi-aggregate use case.
- Зачем: не даёт allowlist обрасти записями после рефакторинга.

**R12c: Полнота карты репозиториев**
- Каждый `*Repository`-тип, используемый в `__init__` use case, должен
  быть найден в domain repo map.
- Зачем: мета-тест — гарантирует, что новые репозитории автоматически
  попадают в проверку.

### UT1: Module docstrings (`test_unit_test_structure.py`)
- Каждый `tests/unit/test_*.py` обязан иметь module-level docstring.

### UT2: Function docstrings (`test_unit_test_structure.py`)
- Каждая `def test_*()` обязана иметь docstring (что тестируется и ожидаемый результат).

### UT4: pytestmark для async тестов (`test_unit_test_structure.py`)
- Файлы с async-тестами обязаны использовать `pytestmark = pytest.mark.asyncio`
  вместо `@pytest.mark.asyncio` на каждой функции.

### UT5: Запрет setUp/tearDown (`test_unit_test_structure.py`)
- Тестовые классы не должны использовать `setUp`/`tearDown`/`setUpClass`/`tearDownClass`.
- Каждый тест создаёт свои зависимости заново.

## Запуск
```bash
make architecture-check         # только архитектурные тесты (R1–R12, UT1–UT5)
make check                      # lint + arch + unit + integration + coverage
uv run pytest -m architecture   # по маркеру
```

## Обязательства при изменении кода

### Добавление нового агрегата
1. `src/domain/{name}/entity.py` — @dataclass с `version: int`. R1–R4 подхватят автоматически.
2. `src/domain/{name}/repository.py` — абстрактный ABC.
3. `src/infrastructure/database/{name}_repo.py` — SQLAlchemy-реализация.
4. `src/infrastructure/database/models.py` — `{Name}Model` (+ child models если есть).
5. `tests/architecture/conftest.py: AGGREGATE_MODELS` — добавить маппинг
   `"{name}": {"{Name}Model", ...child models...}`.
6. `test_model_schema_contract.py: EXPECTED_COLUMNS` — добавить контракт колонок.
7. `test_model_isolation.py` — использует `AGGREGATE_MODELS` из conftest (обновится автоматически).

### Добавление мутирующего метода в агрегат
Метод, модифицирующий `self.*`, обязан содержать `self.version += 1`.
Иначе R4 сломается.

### Изменение models.py
Не добавлять ForeignKey или relationship между моделями разных агрегатов.
Иначе R5 сломается.

### Добавление нового архитектурного правила
1. Создать `tests/architecture/test_{rule_name}.py`.
2. Использовать хелперы из `conftest.py` (parse_imports, parse_ast, и др.).
3. Пометить `pytestmark = pytest.mark.architecture`.
4. Обновить этот файл (ARCH_TESTS.md).
