---
paths:
  - "src/domain/**"
  - "src/application/**"
  - "src/infrastructure/**"
  - "tests/**"
---

# Shared Kernel — общие контракты между агрегатами

## Суть

В системе регулярно появляются конструкции, которые используются в разных
доменных сценариях, но сами по себе **не являются бизнес-объектами** — это схемы
конфигураций, протоколы вызова, политики ретраев, форматы сообщений, правила
выполнения задач. Ошибка архитектуры начинается, когда такие вещи живут внутри
агрегатов как будто они часть домена: каждая команда копирует структуру, слегка
её меняет, и через несколько месяцев система состоит из похожих, но несовместимых
моделей.

Правило: **если структура одинакова по форме, используется в разных доменных
сценариях и описывает техническое поведение системы — её нужно выделять в
отдельный общий контракт.**

## Формула

**Общая схема — в shared kernel, данные — у агрегатов, выполнение — в
инфраструктуре, без наследования между агрегатами.**

## Разделение ответственности: schema → data → execution

Три слоя ответственности не пересекаются:

### Shared kernel владеет схемой
Какие поля существуют, какие у них типы, как они валидируются и сериализуются.
Это контракт — форма данных и правила валидации. Не бизнес-логика, не поведение,
не принятие решений.

### Агрегаты владеют значениями
Конкретные экземпляры (snapshots) этой схемы, которые принадлежат жизненному
циклу агрегата. Разные агрегаты могут использовать разные подмножества полей или
иметь свои правила обязательности, но форма данных определяется общим контрактом.

### Инфраструктура владеет исполнением
Единый клиент или механизм, который принимает контракт и выполняет
соответствующее действие (вызов API, запуск пайплайна, отправка уведомления).
Клиент не знает о доменном смысле агрегатов — он знает только схему.

Такое разделение позволяет эволюционировать инфраструктурный контракт
централизованно, не ломая доменные модели. Изменения в контракте (добавление
параметра, изменение политики исполнения) внедряются в одном месте.

## Композиция вместо наследования

Когда несколько агрегатов получают общий базовый класс, архитектура начинает
протекать: появляется искусственная иерархия, агрегаты становятся связанными,
инфраструктура оказывается внутри домена. В правильной модели агрегаты просто
**содержат экземпляр общего контракта как поле**, оставаясь полностью
независимыми. Это сохраняет границы bounded context и предотвращает превращение
системы в набор «магических базовых сущностей».

## Единая схема ≠ единый UI

Каждый доменный сценарий работает только с той частью структуры, которая имеет
смысл для его задачи. UI одного агрегата может показывать одни поля, другого —
совершенно другие, но в базе данные сериализуются по одной общей схеме.
Благодаря этому система остаётся консистентной при изменениях контракта.

## Признаки, что пора выделять

| Признак | Пример |
|---------|--------|
| Одинаковые поля/схемы копируются в разных агрегатах | Конфигурация уведомлений с одним и тем же набором полей в 3 агрегатах |
| Изменение контракта требует правок в нескольких агрегатах | Добавление нового поля в схему ломает 2+ entity.py |
| Появляется риск расхождения поведения | Один агрегат валидирует поле X, другой — нет |
| Структура описывает **как система что-то делает**, а не **что бизнес означает** | Формат конфигурации, протокол интеграции, схема API-запроса |

## Признаки, что выделять НЕ нужно

| Признак | Почему |
|---------|--------|
| Поля совпадают случайно | `name: str` в двух агрегатах — не повод для shared kernel |
| Структура является частью бизнес-логики одного агрегата | Это внутренний value object, а не shared |
| Структуры похожи, но семантически различны | Адрес доставки и адрес регистрации — разные value objects |
| Совпадение только в 1 агрегате | Нет дублирования — нет проблемы |

## Принципы

### P1: Shared Kernel — это контракт, а не библиотека

Shared kernel определяет **форму данных** (value objects, dataclass, typed dict,
JSON schema), а не поведение. Поведение, специфичное для агрегата, остаётся в
агрегате. Shared kernel не содержит бизнес-логику — только структуру и базовую
валидацию.

```
src/domain/shared/              # Общие контракты
├── value_objects.py            # Value objects, используемые 2+ агрегатами
├── schemas.py                  # Схемы данных (конфигурации, протоколы)
└── errors.py                   # Общие доменные ошибки (если есть)
```

### P2: Агрегаты хранят свои экземпляры данных

Агрегат **владеет копией** (snapshot) общей структуры. Это не ссылка, а значение.
Если агрегат A обновляет свой экземпляр конфигурации, агрегат B об этом не знает
и не должен знать.

```python
# Shared kernel — контракт
@dataclass(frozen=True)
class NotificationConfig:
    channel: str              # "email" | "slack" | "webhook"
    endpoint: str
    is_enabled: bool = True

# Агрегат A — хранит свой экземпляр
@dataclass
class Project:
    project_id: UUID
    notification_config: NotificationConfig | None   # свой snapshot
    version: int

# Агрегат B — хранит свой экземпляр
@dataclass
class Team:
    team_id: UUID
    notification_config: NotificationConfig | None   # свой snapshot
    version: int
```

### P3: Инфраструктура реализует единый клиент исполнения

Если shared kernel описывает протокол (например, схему конфигурации для
внешнего сервиса), инфраструктурный слой реализует **один клиент**, который
принимает этот контракт и исполняет его. Агрегаты не знают о клиенте.

```
src/domain/shared/schemas.py              # NotificationConfig (контракт)
src/domain/project/entity.py              # Project.notification_config
src/domain/team/entity.py                 # Team.notification_config
src/infrastructure/notifications/client.py # send(config: NotificationConfig)
src/application/use_cases/notify.py       # берёт config из агрегата, вызывает клиент
```

### P4: Без наследования между агрегатами

Агрегаты никогда не наследуют друг от друга и не наследуют от shared kernel.
Связь — только через **композицию**: агрегат содержит поле типа shared value
object.

Запрещено:
```python
class Team(Project):  # ЗАПРЕЩЕНО — наследование между агрегатами
    ...
```

Разрешено:
```python
class Team:
    notification_config: NotificationConfig  # композиция — поле с типом из shared
```

### P5: Shared kernel — frozen и immutable

Value objects в shared kernel должны быть `frozen=True` (или `@dataclass(frozen=True)`).
Изменение = создание нового экземпляра. Это гарантирует, что snapshot агрегата не
будет случайно мутирован извне.

### P6: Минимальный размер контракта

Shared kernel содержит **только** то, что реально используется 2+ агрегатами.
Не добавлять «на будущее» — каждое поле и каждый value object должен иметь
минимум двух потребителей. Разрастание shared kernel создаёт скрытую связность.

### P7: Версионирование контракта

При изменении shared kernel — обновить все агрегаты-потребители в том же коммите.
Shared kernel не может быть изменён «частично» — либо все потребители адаптированы,
либо изменение не мёрджится.

## Где живёт shared kernel

```
src/domain/
├── shared/                     # Общие контракты
│   ├── __init__.py
│   ├── value_objects.py        # Frozen dataclasses / Value Objects
│   ├── schemas.py              # Конфигурационные схемы, протоколы
│   └── errors.py               # Общие доменные ошибки
├── project/                    # Агрегат: хранит NotificationConfig (snapshot)
│   ├── entity.py
│   └── repository.py
├── team/                       # Агрегат: хранит NotificationConfig (snapshot)
│   ├── entity.py
│   └── repository.py
```

**Правило импорта:**
- `src/domain/{aggregate}/` **может** импортировать из `src/domain/shared/`
- `src/domain/{aggregate}/` **не может** импортировать из `src/domain/{другой_агрегат}/`
- `src/domain/shared/` **не может** импортировать из `src/domain/{aggregate}/`

## Тестирование

### Уровень 1: Тесты самого контракта

Shared kernel тестируется изолированно — без агрегатов, без инфраструктуры.

```python
"""Tests for shared value objects — structure, immutability, equality."""

# --- Test data ---
VALID_CONFIG = {"channel": "email", "endpoint": "user@example.com", "is_enabled": True}
INVALID_CHANNEL = {"channel": "pigeon", "endpoint": "...", "is_enabled": True}

class TestNotificationConfig:
    def test_creation_with_valid_data(self):
        """Valid data produces a config with all fields set correctly."""
        config = NotificationConfig(**VALID_CONFIG)
        assert config.channel == "email"
        assert config.endpoint == "user@example.com"
        assert config.is_enabled is True

    def test_immutability(self):
        """Frozen dataclass raises on attribute assignment."""
        config = NotificationConfig(**VALID_CONFIG)
        with pytest.raises(FrozenInstanceError):
            config.channel = "slack"

    def test_equality_by_value(self):
        """Two configs with same data are equal (value semantics)."""
        a = NotificationConfig(**VALID_CONFIG)
        b = NotificationConfig(**VALID_CONFIG)
        assert a == b

    def test_inequality_on_different_values(self):
        """Configs with different data are not equal."""
        a = NotificationConfig(channel="email", endpoint="a@x.com")
        b = NotificationConfig(channel="slack", endpoint="hook-url")
        assert a != b

    def test_validation_rejects_invalid_channel(self):
        """Invalid channel value is rejected at creation."""
        with pytest.raises((ValueError, ValidationError)):
            NotificationConfig(**INVALID_CHANNEL)

    def test_default_values(self):
        """Optional fields use documented defaults."""
        config = NotificationConfig(channel="email", endpoint="a@x.com")
        assert config.is_enabled is True
```

**Что тестировать:**
- Создание с валидными данными — все поля установлены
- Immutability — `frozen=True` не даёт мутировать
- Equality — два экземпляра с одинаковыми данными равны (value semantics)
- Валидация — невалидные данные отклоняются при создании
- Значения по умолчанию — optional поля имеют документированные defaults
- Сериализация / десериализация — если контракт конвертируется в JSON/dict

### Уровень 2: Тесты использования контракта в агрегатах

Каждый агрегат тестирует, что его методы корректно работают с shared value object.
Тесты живут **в тестах агрегата**, не в тестах shared kernel.

```python
"""Tests for Project aggregate — notification config management."""

VALID_CONFIG = NotificationConfig(channel="email", endpoint="user@example.com")
UPDATED_CONFIG = NotificationConfig(channel="slack", endpoint="https://hook.example.com")

class TestProjectNotificationConfig:
    def test_set_config_stores_snapshot(self):
        """Setting config creates an independent copy in the aggregate."""
        project = Project.create(name="test-project")
        project.set_notification_config(VALID_CONFIG)
        assert project.notification_config == VALID_CONFIG

    def test_set_config_increments_version(self):
        """Mutation method increments aggregate version."""
        project = Project.create(name="test-project")
        v = project.version
        project.set_notification_config(VALID_CONFIG)
        assert project.version == v + 1

    def test_update_config_does_not_affect_original(self):
        """Updating aggregate config does not change the original value object."""
        project = Project.create(name="test-project")
        project.set_notification_config(VALID_CONFIG)
        project.set_notification_config(UPDATED_CONFIG)
        assert VALID_CONFIG.channel == "email"  # original unchanged

    def test_clear_config_sets_none(self):
        """Clearing config removes the association."""
        project = Project.create(name="test-project")
        project.set_notification_config(VALID_CONFIG)
        project.clear_notification_config()
        assert project.notification_config is None
```

**Что тестировать:**
- Агрегат корректно принимает и хранит shared value object
- Мутирующие методы инкрементируют `version`
- Изменение в агрегате не мутирует оригинальный value object (snapshot isolation)
- Удаление / очистка конфигурации
- Бизнес-логика агрегата, зависящая от shared value object

### Уровень 3: Тесты изоляции (architecture tests)

Автоматическая проверка, что shared kernel не нарушает границы агрегатов.

```python
"""Architecture: shared kernel isolation rules."""
pytestmark = pytest.mark.architecture

def test_shared_does_not_import_aggregates(all_domain_shared_files):
    """src/domain/shared/ must not import from src/domain/{aggregate}/."""
    for filepath, imports in all_domain_shared_files:
        for imp in imports:
            assert not re.match(r"src\.domain\.\w+\.(entity|repository)", imp), (
                f"{filepath} imports {imp} — shared kernel must not depend on aggregates"
            )

def test_aggregates_do_not_import_each_other_via_shared(aggregate_files):
    """Aggregates import from shared/, never from each other."""
    for filepath, imports in aggregate_files:
        aggregate_name = extract_aggregate_name(filepath)
        for imp in imports:
            if "src.domain." in imp and ".shared" not in imp:
                other = extract_aggregate_from_import(imp)
                assert other == aggregate_name, (
                    f"{filepath} imports from aggregate '{other}' — "
                    f"use src.domain.shared instead"
                )

def test_shared_value_objects_are_frozen(shared_vo_classes):
    """All dataclasses in shared/ must be frozen=True."""
    for cls_name, is_frozen in shared_vo_classes:
        assert is_frozen, f"{cls_name} in shared/ must be frozen=True"
```

**Что тестировать:**
- `src/domain/shared/` не импортирует из `src/domain/{aggregate}/`
- Агрегаты не импортируют друг друга (только `shared/`)
- Все dataclass в shared — `frozen=True`
- Каждый value object в shared используется минимум двумя агрегатами (опционально)

### Уровень 4: Тесты инфраструктуры (интеграционные)

Если shared kernel определяет схему для внешнего сервиса, тестируется, что
инфраструктурный клиент корректно принимает и исполняет контракт.

```python
"""Integration: notification client handles all valid config variants."""

ALL_CHANNELS = [
    NotificationConfig(channel="email", endpoint="user@example.com"),
    NotificationConfig(channel="slack", endpoint="https://hook.example.com"),
    NotificationConfig(channel="webhook", endpoint="https://api.example.com/notify"),
]

class TestNotificationClient:
    @pytest.mark.parametrize("config", ALL_CHANNELS, ids=lambda c: c.channel)
    async def test_send_accepts_all_channel_types(self, config):
        """Client handles every channel defined in the shared schema."""
        client = NotificationClient(...)
        result = await client.send(config, message="test")
        assert result.success is True

    async def test_disabled_config_skips_sending(self):
        """Client respects is_enabled=False and does not make external call."""
        config = NotificationConfig(channel="email", endpoint="x@y.com", is_enabled=False)
        client = NotificationClient(...)
        result = await client.send(config, message="test")
        assert result.skipped is True
```

**Что тестировать:**
- Клиент принимает все варианты, определённые в shared schema
- Клиент корректно обрабатывает edge cases (disabled, empty endpoint)
- Клиент не делает лишних вызовов при отключённой конфигурации

## Порядок внедрения

### Когда выделять

1. Заметить одинаковую структуру данных в 2+ агрегатах
2. Убедиться, что это **инфраструктурный контракт**, а не бизнес-сущность
3. Проверить признаки из таблицы «пора выделять»

### Как выделять

1. Создать `src/domain/shared/` (если ещё нет)
2. Определить `@dataclass(frozen=True)` value object с валидацией
3. Написать тесты уровня 1 (контракт) и уровня 3 (изоляция)
4. Заменить дублирующиеся поля в агрегатах на shared value object (композиция)
5. Обновить тесты агрегатов (уровень 2)
6. Обновить инфраструктурный слой — единый клиент принимает shared контракт
7. Обновить тесты инфраструктуры (уровень 4)
8. Обновить `AGGREGATE_MODELS` и `EXPECTED_COLUMNS` если затронуты модели БД
9. `make check` — зелёный

### Чеклист перед мёрджем

- [ ] Value object — `frozen=True`, equality by value
- [ ] Минимум 2 агрегата-потребителя
- [ ] Shared kernel не импортирует из агрегатов
- [ ] Агрегаты не импортируют друг друга
- [ ] Все 4 уровня тестов написаны
- [ ] Все потребители обновлены в одном коммите

## Антипаттерны

| Антипаттерн | Почему плохо | Что делать |
|-------------|-------------|------------|
| Shared kernel с бизнес-логикой | Создаёт god object, агрегаты теряют автономность | Только структура + базовая валидация |
| Mutable shared object | Агрегат A мутирует config, агрегат B неожиданно изменился | `frozen=True`, snapshot semantics |
| Shared kernel для 1 потребителя | Лишняя абстракция, усложнение без причины | Оставить как internal value object агрегата |
| Наследование агрегатов от shared | Нарушает изоляцию, скрытая связность | Только композиция (поле с типом) |
| Частичное обновление потребителей | Расхождение контрактов между агрегатами | Обновлять всех потребителей в одном коммите |
| Разрастание shared kernel | Скрытая связность, каждый агрегат зависит от общего модуля | Минимальный размер, каждое поле — 2+ потребителя |
