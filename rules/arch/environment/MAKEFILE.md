---
paths:
  - "Makefile"
  - "docker-compose*"
  - "pyproject.toml"
---

# MAKEFILE.md — правила и таргеты Makefile

# Контекст
Makefile — единая точка входа для всех операций разработки, тестирования и деплоя. Все команды запускаются через `make <target>`, что обеспечивает единообразие между локальной разработкой, CI и Docker-окружением.

## Переменная RUNNER

```makefile
RUNNER ?= uv run
```

- Локально все команды запускаются через `uv run` (менеджер пакетов проекта).
- В Docker-контейнере переопределяется: `make lint RUNNER=` (пустой — команды запускаются напрямую).
- Никогда не использовать `python` или `pip` напрямую — всегда через `$(RUNNER)`.

## Таргеты

### Проверка качества кода

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `lint` | `ruff check --fix . && black --check . && mypy src/ tests/` | Линтинг (ruff), форматирование (black), типизация (mypy) — всё за один таргет |
| `architecture-check` | `pytest tests/architecture -v` | Запуск архитектурных тестов (DDD-контракты: слои, зависимости, изоляция) |
| `audit` | `pip-audit --strict --desc` | Проверка зависимостей на известные CVE (уязвимости) |
| `audit-fix` | `pip-audit --fix` | Автоматическое обновление уязвимых зависимостей |
| `audit-sbom` | `pip-audit -f cyclonedx-json -o sbom.json` | Генерация SBOM (Software Bill of Materials) в формате CycloneDX |

### Тестирование

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `test-unit` | `pytest tests/unit -v` | Юнит-тесты (быстрые, без внешних зависимостей) |
| `test-cov` | `pytest tests/unit -v --cov --cov-report=term-missing --cov-report=html` | Юнит-тесты + отчёт покрытия (терминал + HTML) |
| `test-integration` | `pytest tests/integration -v` | Интеграционные тесты (требуют запущенные сервисы: PostgreSQL, MinIO) |
| `test` | `up-test → test-unit → test-integration` | Полный цикл: поднять тестовые контейнеры, запустить все тесты |

### Инфраструктура и контейнеры

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `up` | `docker compose up -d` | Запуск основного окружения (PostgreSQL + MinIO + app) |
| `down` | `docker compose down` | Остановка основного окружения |
| `up-test` | `docker compose -f docker-compose.test.yml up -d` | Запуск тестового окружения (PostgreSQL :5433, MinIO :9010) |
| `down-test` | `docker compose -f docker-compose.test.yml down` | Остановка тестового окружения |

### Миграции БД

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `migrate` | `alembic upgrade head` | Применить все миграции (async через asyncpg) |
| `revision` | `alembic revision --autogenerate -m "$(msg)"` | Создать новую миграцию: `make revision msg="add users table"` |

### Деплой

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `deploy-locally` | `docker compose build app → up -d → exec alembic upgrade head` | Полный локальный деплой: сборка образа, запуск, применение миграций |

### Прочее

| Таргет | Команда | Назначение |
|--------|---------|------------|
| `pre-commit-install` | `pre-commit install` | Установка git-хуков для автопроверки перед коммитом |

## Пайплайн `check`

```
check = lint → architecture-check → audit → test (up-test → test-unit → test-integration) → test-cov
```

- Порядок намеренный: дешёвые и быстрые проверки (lint, types) идут первыми.
- Если lint не проходит — тесты не запускаются (экономия времени).
- `check` — главный таргет для CI и предкоммитной проверки.

## Правила

- Каждый новый инструмент проверки качества добавляется как отдельный таргет и включается в `check`.
- Тестовое окружение (`up-test` / `down-test`) использует отдельный compose-файл с нестандартными портами, чтобы не конфликтовать с dev-окружением.
- Таргет `test` всегда поднимает контейнеры перед запуском — идемпотентен.
- Все `.PHONY` таргеты объявлены в начале файла единым списком.
- Одиночный тест запускается напрямую: `uv run pytest tests/unit/test_file.py::test_name -v`.

## Антипаттерны (запрещено)

- Запуск pytest/ruff/mypy напрямую без `$(RUNNER)` в Makefile.
- Добавление таргетов без включения в `.PHONY`.
- Зависимость тестов от `up` вместо `up-test` (разные порты и данные).
- Миграции внутри таргета `up` — миграции запускаются явно через `migrate` или `deploy-locally`.
