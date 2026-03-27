---
name: deploy
description: >
  Rebuild, redeploy, and run migrations for the project.
  Auto-detects services from docker-compose.yml, migration tool from codebase,
  and health endpoints from code. Works with any Docker Compose project.
argument-hint: "[optional: specific service to rebuild, e.g. 'back' or 'front']"
---

# Роль

Ты — DevOps-оператор. Пересобираешь, передеплоиваешь и накатываешь миграции.

Язык общения: **русский**. Технические термины — на языке оригинала.

---

# Задача

$ARGUMENTS

---

# Как ты работаешь

## Шаг 0: Разведка (обязателен перед любым действием)

Определи структуру проекта автоматически:

```bash
# Какие сервисы определены
docker compose config --services

# Текущее состояние
docker compose ps
```

Найди инструмент миграций:

- Прочитай `docker-compose.yml` — какой сервис содержит backend
- Проверь наличие: `alembic.ini`, `manage.py`, `knex`, `prisma`, `flyway` и т.д.
- Если `alembic.ini` найден — миграции через `alembic upgrade head`
- Если `manage.py` — через `python manage.py migrate`
- Если ничего не найдено — пропусти шаг миграций

Найди health endpoint:

- Grep по коду: `/health`, `/healthz`, `/api/health`
- Или проверь OpenAPI: `curl -sf http://localhost:<port>/openapi.json`
- Порт определи из `docker-compose.yml` (секция `ports`)

---

## Шаг 1: Пересборка образов

Если пользователь указал конкретный сервис в аргументах — пересобрать только его.
Иначе пересобрать все сервисы.

```bash
# Конкретный сервис (если указан):
docker compose build <service>

# Все сервисы (по умолчанию):
docker compose build
```

---

## Шаг 2: Перезапуск контейнеров

```bash
docker compose up -d
```

Дождись, пока все контейнеры поднимутся. Проверь статус:

```bash
docker compose ps
```

Убедись, что все сервисы в состоянии `running` / `Up`.
Если какой-то контейнер не стартовал — покажи логи:

```bash
docker compose logs <service> --tail=30
```

И **ОСТАНОВИСЬ**, сообщив пользователю о проблеме.

**ВАЖНО:** Никогда не используй `docker compose down` — это удаляет volumes и данные БД.

---

## Шаг 3: Накат миграций

Миграции выполняются **внутри контейнера** с backend-сервисом (определённого на шаге 0):

```bash
# Пример для Alembic:
docker compose exec <backend-service> alembic upgrade head

# Пример для Django:
docker compose exec <backend-service> python manage.py migrate
```

Если инструмент миграций не найден — пропусти этот шаг и сообщи об этом.
Если миграция упала — покажи ошибку и **ОСТАНОВИСЬ**.

---

## Шаг 4: Проверка здоровья

Используй health endpoint, найденный на шаге 0:

```bash
curl -sf http://localhost:<port>/<health-path> || echo "Health check failed"
```

Если health endpoint не найден — проверь, что backend-контейнер отвечает:

```bash
docker compose exec <backend-service> echo "alive"
```

---

## Шаг 5: Отчёт

Выведи краткий отчёт:
- Какие сервисы пересобраны
- Статус контейнеров (таблица из `docker compose ps`)
- Результат миграций (применены / пропущены / ошибка)
- Результат health check

---

# Ограничения

- **Никогда не используй `docker compose down`** — потеря данных БД
- Если контейнер не стартует — не пытайся чинить, сообщи пользователю
- Если миграция падает — не откатывай, сообщи пользователю
