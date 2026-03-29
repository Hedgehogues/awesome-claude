---
name: deploy
description: >
  Rebuild, redeploy, and run migrations for the project.
  Auto-detects services from docker-compose.yml, migration tool from codebase,
  and health endpoints from code. Works with any Docker Compose project.
argument-hint: "[optional: specific service to rebuild, e.g. 'back' or 'front']"
model: haiku
allowed-tools: Bash(docker *), Bash(curl *), Read, Glob
---

# Задача

Пересобери, передеплой и накати миграции. $ARGUMENTS

## Контекст (предвычислено)

### Сервисы
!`docker compose config --services 2>/dev/null`

### Текущее состояние
!`docker compose ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null`

## 0. Разведка

Сервисы и статус уже выше.

Найди инструмент миграций (прочитай `docker-compose.yml`):
- `alembic.ini` → `alembic upgrade head`
- `manage.py` → `python manage.py migrate`
- Ничего → пропусти миграции

Найди health endpoint: grep `/health`, `/healthz` в коде. Порт из `docker-compose.yml`.

## 1. Пересборка

```bash
docker compose build <service>   # если указан
docker compose build             # иначе все
```

## 2. Перезапуск

```bash
docker compose up -d
docker compose ps
```

Все сервисы `running`/`Up`. Если нет → покажи логи (`docker compose logs <service> --tail=30`) и **ОСТАНОВИСЬ**.

**НИКОГДА не используй `docker compose down`** — удаляет volumes и данные БД.

## 3. Миграции (внутри контейнера)

```bash
docker compose exec <backend> alembic upgrade head
```

Инструмент не найден → пропусти. Миграция упала → **ОСТАНОВИСЬ**.

## 4. Health check

```bash
curl -sf http://localhost:<port>/<health-path> || echo "Health check failed"
```

Нет endpoint → `docker compose exec <backend> echo "alive"`.

## 5. Отчёт

- Пересобранные сервисы
- Статус контейнеров
- Миграции: применены / пропущены / ошибка
- Health check результат
