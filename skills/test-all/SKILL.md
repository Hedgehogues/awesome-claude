---
name: test-all
description: >
  Run ALL tests across ALL packages — including expensive integration tests
  (real API keys, real DB) and E2E (Playwright). Auto-detects project structure,
  test runners, and lint tools. Reports full statistics with delta vs previous run.
argument-hint: "[optional: 'skip-e2e', 'only-<package>' to limit scope]"
model: haiku
allowed-tools: Bash(uv *), Bash(npx *), Bash(npm *), Bash(docker *), Bash(ls *), Glob, Read
---

# Задача

Запусти **все** тесты и выдай детальный отчёт. $ARGUMENTS

## Контекст (предвычислено)

### Пакеты
!`ls packages/*/Makefile packages/*/package.json packages/*/pyproject.toml 2>/dev/null`

### Тестовые слои
!`ls -d packages/*/tests/*/ 2>/dev/null`

### Инфра
!`ls docker-compose.yml docker-compose.yaml 2>/dev/null`
!`ls packages/*/alembic.ini 2>/dev/null`
!`ls packages/*/playwright.config.* 2>/dev/null`

## 0. Разведка

Пакеты и слои уже выше — не нужно вызывать `ls`.

### Тест-раннеры

| Сигнал | Раннер | Сбор | Запуск |
|--------|--------|------|--------|
| `pyproject.toml` + pytest | pytest | `uv run pytest --collect-only -q` | `uv run pytest -v` |
| `package.json` + vitest | vitest | `npx vitest run --reporter=verbose` | `npx vitest run` |
| `package.json` + jest | jest | `npx jest --listTests` | `npx jest` |
| `playwright.config` | playwright | — | `npx playwright test` |

### Тестовые слои (pytest)

```bash
ls -d <package>/tests/*/ 2>/dev/null
```

Типичные: `unit`, `integration`, `architecture`, `state`, `security`, `cases`, `e2e`. Используй **реально существующие**.

### Линтеры и тайпчекеры

| Сигнал | Команда |
|--------|---------|
| ruff в pyproject.toml | `uv run ruff check .` |
| mypy в pyproject.toml | `uv run mypy src/ tests/` |
| eslint в package.json | `npm run lint` |
| tsconfig.json | `npx tsc -b --noEmit` |

### Инфра

```bash
ls docker-compose.yml docker-compose.yaml 2>/dev/null
docker compose ps 2>&1 | head -10
ls **/alembic.ini */alembic.ini 2>/dev/null
```

Docker Compose → строка `infra/docker`. Alembic → строка `infra/migrations`.

E2E: `ls **/playwright.config.* 2>/dev/null`. Найден + Docker запущен → запускай.

## 1. Снапшот "ДО"

Подсчитай количество тестов для каждого пакета/слоя — baseline для дельты.

## 2. Запуск

Последовательно, пакет за пакетом. **Не останавливайся при ошибках.**

Для каждого пакета:
1. Lint + types
2. Тесты по слоям (каждый отдельно)
3. `| tail -N` для компактности, сохраняй строки ошибок

**E2E:** Docker не запущен → **спроси пользователя**.
**Integration:** предупреди: "могут обращаться к реальным API и стоить денег".
**infra/docker:** `docker compose ps --format json 2>&1 | head -20`
**infra/migrations:** `cd <back> && uv run alembic check 2>&1`

## 3. Сводная таблица

### Категории (только реально обнаруженные)

`<pkg>/unit`, `<pkg>/integration`, `<pkg>/architecture`, `<pkg>/state`, `<pkg>/security`, `<pkg>/cases`, `<pkg>/e2e`, `<pkg>/lint`, `<pkg>/types`, `<pkg>/build`, `infra/docker`, `infra/migrations`

### Формат

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                             ПОЛНЫЙ ТЕСТОВЫЙ ОТЧЁТ                                  ║
╠════════════════════════╤═══════╤════════╤════════╤═════════╤═════╤═════════════════╣
║ Категория              │ Всего │ Passed │ Failed │ Skipped │  Σ  │ Что проверяет   ║
╠════════════════════════╪═══════╪════════╪════════╪═════════╪═════╪═════════════════╣
║ 🟢 back/unit           │   48  │   48   │    0   │    0    │  48 │ Бизнес-логика   ║
║ 🟡 back/integration    │    5  │    3   │    0   │    2    │   5 │ Внешние сервисы ║
║ 🔴 front/unit          │   35  │   33   │    2   │    0    │  35 │ Интерфейс       ║
║ 🟢 back/lint           │    —  │    ✅   │    —   │    —    │   1 │ Стиль кода      ║
╠════════════════════════╪═══════╪════════╪════════╪═════════╪═════╪═════════════════╣
║ ИТОГО (числовые)       │   88  │   84   │    2   │    2    │  88 │                 ║
║ ИТОГО (pass/fail)      │       │  N ✅  │  N ❌  │  N ⚠️   │     │                 ║
╚════════════════════════╧═══════╧════════╧════════╧═════════╧═════╧═════════════════╝
```

### Правила таблицы

**Цвет:** 🟢 all passed, 🟡 есть skipped / 0 failed, 🔴 есть failed. Бинарные (lint/types/build/infra): 🟢 ok, 🔴 fail.

**Σ:** тесты = Passed+Failed+Skipped; бинарные = 1 ok / 0 fail.

**ИТОГО (числовые):** SUM только тестовых строк. Реальные числа, не заглушки.

**ИТОГО (pass/fail):** подсчёт строк по цвету: `N ✅` / `N ❌` / `N ⚠️`.

**«Что проверяет»:** продуктовый комментарий (10–15 слов), понятный менеджеру.

### Дельта (если есть baseline)

Колонка `Δ` после `Всего`: `+N ↑` / `-N ↓` / `—`.

### Вердикт

- 0 🔴: `✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ`
- Есть 🔴: `❌ ЕСТЬ ПАДЕНИЯ — см. детали ниже`
- Есть 🟡: `⚠️ Часть проверок пропущена`

### Детали падений

Для каждого failed: имя теста, файл:строка, описание ошибки (5–10 строк traceback).

## 4. Продуктовое резюме

Один абзац (3–5 предложений) понятный менеджеру. Без файлов и терминов.

> **Резюме:** Проведена полная проверка. [Что хорошо]. [Что требует внимания]. [Готовность].

## Аргументы

- Без аргументов → всё
- `skip-e2e` → без E2E
- `only-<package>` → только пакет
- `only-integration` → только integration

## Важно

- НЕ останавливайся при падении — полная картина
- НЕ угадывай структуру — определяй из FS
- Каждая обнаруженная категория ОБЯЗАНА быть в таблице
- Реальные числа из раннеров, никаких заглушек
