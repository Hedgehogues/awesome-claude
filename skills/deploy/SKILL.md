---
name: deploy
description: >
  Rebuild, redeploy, and run migrations for the project.
  Rebuilds Docker images, restarts all containers, and applies
  pending Alembic migrations inside the back container.
argument-hint: "[optional: specific service to rebuild, e.g. 'back' or 'front']"
---

# Deploy Skill

Пересборка, передеплой и накат миграций для Test Guardian.

## Порядок выполнения

### Шаг 1: Пересборка образов

Если пользователь указал конкретный сервис в `$ARGUMENTS` — пересобрать только его.
Иначе пересобрать все сервисы.

```bash
# Конкретный сервис (если указан):
docker compose build <service>

# Все сервисы (по умолчанию):
docker compose build
```

Выполняй из корня монорепо `/Users/egurvanov/python/awesome-claude`.

### Шаг 2: Перезапуск контейнеров

```bash
docker compose up -d
```

Дождись, пока все контейнеры поднимутся. Проверь статус:

```bash
docker compose ps
```

Убедись, что сервисы `back`, `front`, `postgres`, `redis` в состоянии `running` / `Up`.
Если какой-то контейнер не стартовал — покажи логи (`docker compose logs <service> --tail=30`)
и **ОСТАНОВИСЬ**, сообщив пользователю о проблеме.

### Шаг 3: Накат миграций

Миграции Alembic выполняются **внутри контейнера `back`**, т.к. ему нужен доступ
к PostgreSQL через Docker-сеть:

```bash
docker compose exec back alembic upgrade head
```

Если миграция упала — покажи ошибку и **ОСТАНОВИСЬ**.

### Шаг 4: Проверка здоровья

После миграций проверь, что backend отвечает:

```bash
curl -sf http://localhost:55078/health || echo "Health check failed"
```

### Итог

Выведи краткий отчёт:
- Какие сервисы пересобраны
- Статус контейнеров
- Результат миграций
- Результат health check
