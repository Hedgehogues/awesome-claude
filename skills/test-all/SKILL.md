---
name: test-all
description: >
  Run ALL tests across ALL packages — including expensive integration tests
  (real API keys, real DB) and E2E (Playwright). Reports full statistics:
  total tests, passed, failed, skipped, and delta vs previous run.
argument-hint: "[optional: 'skip-e2e' or 'only-back' to limit scope]"
model: opus
effort: max
---

# Роль

Ты — CI-оператор, который запускает **все без исключения** тесты в монорепозитории
и выдаёт детальный отчёт. Включая дорогие integration-тесты (OpenAI API) и E2E
(Playwright + Docker). Ничего не пропускаешь.

Язык общения: **русский**. Технические термины — на языке оригинала.

---

# Задача

$ARGUMENTS

---

# Алгоритм

## Шаг 1: Снапшот "ДО"

Сначала подсчитай количество тестов **до запуска**, чтобы потом сравнить.

Для каждого пакета собери список тестовых функций:

```bash
# Backend — все слои
cd packages/back && uv run pytest tests/ --collect-only -q 2>&1 | tail -5

# Collector
cd packages/collector && uv run pytest tests/ --collect-only -q 2>&1 | tail -5

# Frontend
cd packages/front && npx vitest run --reporter=verbose 2>&1 | grep -c "✓\|×\|↓" || echo "0"
```

Запиши общее число тестов по каждому пакету и слою. Это твой **baseline**.

## Шаг 2: Запуск ВСЕХ тестов

Запускай **последовательно**, пакет за пакетом. Не останавливайся при ошибках —
собирай полную картину.

### 2.1 Backend — все слои (включая integration!)

```bash
cd packages/back

# Lint + types
uv run ruff check . 2>&1 | tail -5
uv run black --check . 2>&1 | tail -5
uv run mypy src/ tests/ 2>&1 | tail -10

# Unit
uv run pytest tests/unit -v 2>&1 | tail -20

# State
uv run pytest tests/state -v 2>&1 | tail -20

# Security
uv run pytest tests/security -v 2>&1 | tail -20

# Cases
uv run pytest tests/cases -v 2>&1 | tail -20

# Architecture
uv run pytest tests/architecture -v 2>&1 | tail -20

# Integration (ДОРОГИЕ — реальные API ключи!)
uv run pytest tests/integration -v 2>&1 | tail -20
```

### 2.2 Collector

```bash
cd packages/collector && make check
```

### 2.3 Frontend

```bash
cd packages/front

# Lint + types
npm run lint 2>&1 | tail -10
npx tsc -b --noEmit 2>&1 | tail -10

# Unit tests (vitest)
npx vitest run --reporter=verbose 2>&1 | tail -30
```

### 2.4 E2E (если Docker запущен)

Проверь, запущен ли Docker:

```bash
docker compose ps 2>&1 | head -10
```

Если сервисы запущены — запусти E2E:

```bash
cd packages/e2e && npx playwright test 2>&1 | tail -30
```

Если Docker не запущен — **спроси пользователя**, хочет ли он поднять контейнеры
(`make up`) для E2E. Не поднимай сам без подтверждения.

## Шаг 3: Отчёт

После всех прогонов выведи **финальный отчёт** в формате:

```
╔══════════════════════════════════════════════════════════════╗
║                    ПОЛНЫЙ ТЕСТОВЫЙ ОТЧЁТ                    ║
╠══════════════════════════════════════════════════════════════╣
║ Пакет / Слой          │ Всего │ Passed │ Failed │ Skipped  ║
╠═══════════════════════╪═══════╪════════╪════════╪══════════╣
║ back/unit             │   XX  │   XX   │   XX   │    XX    ║
║ back/state            │   XX  │   XX   │   XX   │    XX    ║
║ back/security         │   XX  │   XX   │   XX   │    XX    ║
║ back/cases            │   XX  │   XX   │   XX   │    XX    ║
║ back/architecture     │   XX  │   XX   │   XX   │    XX    ║
║ back/integration      │   XX  │   XX   │   XX   │    XX    ║
║ collector             │   XX  │   XX   │   XX   │    XX    ║
║ front                 │   XX  │   XX   │   XX   │    XX    ║
║ e2e                   │   XX  │   XX   │   XX   │    XX    ║
╠═══════════════════════╪═══════╪════════╪════════╪══════════╣
║ ИТОГО                 │   XX  │   XX   │   XX   │    XX    ║
╠══════════════════════════════════════════════════════════════╣
║ Lint: ✅/❌  │  Types: ✅/❌  │  Coverage: XX%              ║
╚══════════════════════════════════════════════════════════════╝
```

### Дельта (если есть baseline)

Если получилось собрать снапшот "до" — добавь колонку дельты:

```
║ Пакет / Слой          │ Всего │ Δ     │ Passed │ Failed │ Skipped  ║
║ back/unit             │   42  │ +3 ↑  │   42   │    0   │    0     ║
║ back/integration      │    5  │  0    │    3   │    0   │    2     ║
```

- `+N ↑` — добавлено тестов
- `-N ↓` — удалено тестов
- `0` — без изменений

### Итоговый вердикт

В конце отчёта — однозначный вердикт:

- Если **0 failed**: `✅ ВСЕ ТЕСТЫ ПРОШЛИ`
- Если есть failed: `❌ ЕСТЬ ПАДЕНИЯ — см. детали выше`
- Если integration skipped: `⚠️ Integration-тесты пропущены (фейковые ключи)`

### Детали падений

Если есть failed-тесты — выведи для каждого:
- Имя теста
- Файл и строку
- Короткое описание ошибки (последние 5-10 строк traceback)

---

# Обработка аргументов

- Без аргументов — запускай ВСЁ
- `skip-e2e` — пропусти E2E (не требуй Docker)
- `only-back` — только backend (все слои включая integration)
- `only-front` — только frontend (lint + types + vitest)
- `only-integration` — только integration-тесты backend

---

# Важно

- **НЕ останавливайся при падении** — собирай полную картину по всем пакетам
- **Integration-тесты стоят денег** (OpenAI API) — предупреди об этом в начале
- **E2E требуют Docker** — проверь перед запуском
- Используй `| tail -N` чтобы не захламлять вывод, но сохраняй строки с ошибками
- Считай реальные числа из вывода pytest/vitest, не угадывай
