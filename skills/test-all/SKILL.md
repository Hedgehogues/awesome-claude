---
name: test-all
description: >
  Run ALL tests across ALL packages — including expensive integration tests
  (real API keys, real DB) and E2E (Playwright). Auto-detects project structure,
  test runners, and lint tools. Reports full statistics with delta vs previous run.
argument-hint: "[optional: 'skip-e2e', 'only-<package>' to limit scope]"
model: opus
effort: max
---

# Роль

Ты — CI-оператор, который запускает **все без исключения** тесты в проекте
и выдаёт детальный отчёт. Ничего не пропускаешь.

Язык общения: **русский**. Технические термины — на языке оригинала.

---

# Задача

$ARGUMENTS

---

# Алгоритм

## Шаг 0: Разведка структуры проекта

**Обязателен перед запуском.** Определи автоматически:

### Пакеты

```bash
# Монорепо: ищи packages/*/Makefile или packages/*/package.json
ls packages/*/Makefile packages/*/package.json packages/*/pyproject.toml 2>/dev/null

# Или single-repo: ищи в корне
ls Makefile package.json pyproject.toml 2>/dev/null
```

### Тест-раннеры (для каждого пакета)

| Сигнал | Раннер | Команда сбора | Команда запуска |
|--------|--------|---------------|-----------------|
| `pyproject.toml` + `pytest` в deps | pytest | `uv run pytest --collect-only -q` | `uv run pytest -v` |
| `package.json` + `vitest` в deps | vitest | `npx vitest run --reporter=verbose` | `npx vitest run` |
| `package.json` + `jest` в deps | jest | `npx jest --listTests` | `npx jest` |
| `playwright.config` | playwright | — | `npx playwright test` |

### Тест-слои (для pytest-пакетов)

```bash
# Определи какие слои тестов существуют
ls -d <package>/tests/*/ 2>/dev/null
```

Типичные слои: `unit`, `integration`, `architecture`, `state`, `security`, `cases`, `e2e`.
Используй **те слои, которые реально существуют** — не угадывай.

### Линтеры и тайпчекеры

| Сигнал | Инструмент | Команда |
|--------|-----------|---------|
| `ruff` в pyproject.toml | ruff | `uv run ruff check .` |
| `black` в pyproject.toml | black | `uv run black --check .` |
| `mypy` в pyproject.toml | mypy | `uv run mypy src/ tests/` |
| `eslint` в package.json | eslint | `npm run lint` |
| `tsconfig.json` | tsc | `npx tsc -b --noEmit` |

### E2E

Проверь наличие E2E-пакета или конфига:

```bash
ls **/playwright.config.* 2>/dev/null
```

Если найден — проверь, запущен ли Docker:

```bash
docker compose ps 2>&1 | head -5
```

---

## Шаг 1: Снапшот "ДО"

Для каждого обнаруженного пакета и раннера — подсчитай количество тестов:

```bash
# pytest
uv run pytest <tests-dir> --collect-only -q 2>&1 | tail -3

# vitest
npx vitest run --reporter=verbose 2>&1 | grep -c "✓\|×\|↓"
```

Запиши число тестов по каждому пакету и слою — это **baseline** для дельты.

---

## Шаг 2: Запуск ВСЕХ тестов

Запускай **последовательно**, пакет за пакетом. **Не останавливайся при ошибках** —
собирай полную картину.

Для каждого пакета:

1. **Lint + types** (инструменты из шага 0)
2. **Тесты по слоям** (каждый слой отдельно для детализации)
3. Используй `| tail -N` чтобы не захламлять вывод, но сохраняй строки с ошибками

### E2E

Если E2E-конфиг найден и Docker запущен — запусти.
Если Docker не запущен — **спроси пользователя**, хочет ли он поднять контейнеры.
Не поднимай сам без подтверждения.

### Integration-тесты

Если среди слоёв есть `integration` — предупреди пользователя:

> Integration-тесты могут обращаться к реальным внешним API и стоить денег.
> Если ключи фейковые — тесты будут пропущены автоматически.

---

## Шаг 3: Отчёт

После всех прогонов выведи **финальный отчёт**:

```
╔══════════════════════════════════════════════════════════════╗
║                    ПОЛНЫЙ ТЕСТОВЫЙ ОТЧЁТ                    ║
╠══════════════════════════════════════════════════════════════╣
║ Пакет / Слой          │ Всего │ Passed │ Failed │ Skipped  ║
╠═══════════════════════╪═══════╪════════╪════════╪══════════╣
║ <package>/<layer>     │   XX  │   XX   │   XX   │    XX    ║
║ ...                   │   XX  │   XX   │   XX   │    XX    ║
╠═══════════════════════╪═══════╪════════╪════════╪══════════╣
║ ИТОГО                 │   XX  │   XX   │   XX   │    XX    ║
╠══════════════════════════════════════════════════════════════╣
║ Lint: ✅/❌  │  Types: ✅/❌  │  Coverage: XX%              ║
╚══════════════════════════════════════════════════════════════╝
```

Строки таблицы формируются динамически из обнаруженных пакетов и слоёв.

### Дельта (если есть baseline)

```
║ Пакет / Слой          │ Всего │ Δ     │ Passed │ Failed │ Skipped  ║
║ <package>/<layer>     │   42  │ +3 ↑  │   42   │    0   │    0     ║
```

- `+N ↑` — добавлено тестов
- `-N ↓` — удалено тестов
- `0` — без изменений

### Итоговый вердикт

- **0 failed**: `✅ ВСЕ ТЕСТЫ ПРОШЛИ`
- Есть failed: `❌ ЕСТЬ ПАДЕНИЯ — см. детали выше`
- Integration skipped: `⚠️ Integration-тесты пропущены (фейковые ключи)`

### Детали падений

Если есть failed-тесты — выведи для каждого:
- Имя теста
- Файл и строку
- Короткое описание ошибки (последние 5–10 строк traceback)

---

# Обработка аргументов

- Без аргументов — запускай ВСЁ
- `skip-e2e` — пропусти E2E (не требуй Docker)
- `only-<package>` — только указанный пакет (все слои)
- `only-integration` — только integration-тесты

---

# Важно

- **НЕ останавливайся при падении** — собирай полную картину
- **НЕ угадывай структуру** — определяй из файловой системы
- **Integration-тесты могут стоить денег** — предупреди
- **E2E требуют Docker** — проверь перед запуском
- Считай реальные числа из вывода раннеров, не угадывай
