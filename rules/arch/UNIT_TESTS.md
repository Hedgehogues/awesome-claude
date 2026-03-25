---
paths:
  - "tests/unit/**"
  - "tests/conftest.py"
---

# Unit Test Conventions — обязательные правила структуры unit-тестов

## Контекст
Unit-тесты проекта организованы по DDD-слоям с чёткими конвенциями.
Правила UT1–UT5 валидируются программно через `tests/architecture/test_unit_test_structure.py`.
Правила UT6–UT13 — соглашения для агента, проверяемые на code review.

## Программно валидируемые правила

### UT1: Module docstring
Каждый файл `tests/unit/test_*.py` ОБЯЗАН иметь module-level docstring.
Docstring описывает, какой компонент тестируется и фокус тестов.

```python
"""Tests for AnalyzeVacancyUseCase — vacancy analysis with mocked LLM and S3."""
```

### UT2: Function/method docstring
Каждая функция `def test_*()` ОБЯЗАНА иметь docstring.
Docstring описывает, что тестируется и ожидаемый результат.

```python
def test_upload_resume_replaces_active():
    """Second upload replaces active resume, no history."""
```

### UT4: pytestmark для async тестов
Файлы с async-тестами ОБЯЗАНЫ использовать `pytestmark = pytest.mark.asyncio`
на уровне модуля. Запрещено использовать `@pytest.mark.asyncio` на каждой функции.

```python
# Правильно:
pytestmark = pytest.mark.asyncio

class TestUploadResume:
    async def test_success_commits(self) -> None: ...

# Неправильно:
class TestUploadResume:
    @pytest.mark.asyncio
    async def test_success_commits(self) -> None: ...
```

### UT5: Запрет setUp/tearDown
Тестовые классы НЕ ДОЛЖНЫ использовать `setUp`, `tearDown`, `setUpClass`,
`tearDownClass`. Каждый тест создаёт свои зависимости заново.

## Структурные конвенции (code review)

### UT6: Domain entity тесты
- Standalone-функции (без классов)
- Группировка по `# --- method_name ---` секциям
- Один тест = один аспект (поведение, version increment, валидация)
- Файл: `test_{entity_name}.py`

### UT7: Use case тесты
- Один файл = один use case: `test_{use_case_name}.py`
- Standalone-функции, 2–3 теста на файл
- Паттерн: happy path + user not found + validation error
- Зависимости мокаются inline: `repo = AsyncMock()`

### UT8: Service layer тесты
- Один класс = одна операция сервиса: `class TestOperationName`
- Паттерн методов: `test_success_commits` + `test_error_propagates` + `test_generic_exception_rollback`
- `pytestmark = pytest.mark.asyncio` на уровне модуля
- Общая фабрика `_make_service()` на уровне модуля

### UT9: Handler тесты
- Один класс = один handler: `class TestHandleFsmInfo`
- Helper `_make_message()` на уровне модуля для создания mock Message
- Сервисы мокаются с `AsyncMock(spec=RealService)` — spec ограничивает mock реальными методами
- Проверяется: текст ответа, клавиатура, FSM-переходы

### UT10: Infrastructure тесты
- Классы по компоненту: `TestExtractPdf`, `TestExtractDocx`, `TestLLMClientAnalyze`
- Внешние API мокаются через `patch.object`
- Для файловых форматов — real-but-minimal helpers (`_make_pdf_bytes()`)

## Конвенции моков

### UT11: spec на сервисных моках
Handler-тесты ОБЯЗАНЫ передавать `spec=` при мокировании сервисов:
```python
service = AsyncMock(spec=UserContextService)
```

### UT12: Inline-моки в use case тестах
Use case тесты создают моки inline, не через shared fixtures:
```python
repo = AsyncMock()
repo.get_by_telegram_id.return_value = ctx
use_case = MyUseCase(repo=repo)
```

### UT13: autouse mock для extract_text
`conftest.py` содержит autouse-фикстуру `mock_resume_parser`, подменяющую
`extract_text` на `bytes.decode()`. Тесты, требующие реального парсинга,
переопределяют мок через `monkeypatch`.

## Антипаттерны (запрещено)

### AP1: Mock-assertion тесты
Запрещено assertить вызовы моков (`assert_called_once_with`, `assert_called_with`, `call_count`).
Тест должен проверять **результат** (возвращаемое значение, исключение, состояние объекта),
а не **реализацию** (какие методы репозитория вызвались).

```python
# Неправильно — тест привязан к реализации:
result = await use_case.execute(name="proj")
repo.get_by_name.assert_called_once_with("proj")
repo.save.assert_called_once_with(result)

# Правильно — тест проверяет контракт:
result = await use_case.execute(name="proj")
assert isinstance(result, Project)
assert result.name == "proj"
assert result.is_active is True
```

Исключение: handler-тесты (UT9), где assert на вызов сервиса — единственный способ
проверить, что handler правильно делегирует.

### AP2: Эхо-тесты (тождество конструктора)
Запрещено писать отдельный тест, который просто проверяет `assert entity.field == input_value`,
если эта проверка уже есть в другом тесте (например, в happy path).

```python
# Неправильно — отдельный тест для одного поля:
def test_label_stored():
    token, _ = AgentToken.create(label="ci")
    assert token.label == "ci"  # уже проверено в test_create_generates_token_and_hash

# Правильно — проверка всех полей в одном тесте создания:
def test_create_generates_token_and_hash():
    token, raw = AgentToken.create(...)
    assert token.label == "ci"
    assert token.token_hash == ...
    # ... все поля в одном месте
```

### AP3: Тесты тривиальнее кода
Не пишите тесты для компонентов/функций, которые проще, чем сам тест.
Если компонент — это один `return` с текстом/классом, он не нуждается в unit-тесте.
Его поведение уже покрыто через integration/e2e тесты, где он используется.

## Общие правила

### Test data
- Константы на уровне модуля: `TELEGRAM_ID = 111`, `FILE_DATA = b"fake"`
- Секция `# === Test data ===` или `# --- Test data ---`

### Section separators
- `# ===...===` — блоки верхнего уровня (Test data, Helpers, каждая операция)
- `# ---` — подсекции внутри блока (методы сущности)

### Изоляция
- Каждый тест создаёт свои зависимости — нет shared mutable state
- Нет `setUp`/`tearDown` — фабрики (`_make_service()`, `_make_message()`) вместо них
- Fixtures из conftest.py возвращают свежие объекты (не мутируемые синглтоны)

## Запуск
```bash
make architecture-check   # включает UT1-UT5
make check                # полная проверка
```

## Обязательства при изменении тестов

### Добавление нового unit-теста
1. Добавить docstring на функцию.
2. Если async — убедиться что файл имеет `pytestmark = pytest.mark.asyncio`.
3. `make architecture-check` после написания.

### Добавление нового тестового файла
1. Добавить module docstring.
2. Следовать структуре слоя (UT6–UT10).
3. Не забыть `pytestmark` для async-файлов.
