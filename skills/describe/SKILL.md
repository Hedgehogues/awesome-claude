---
name: describe
description: >
  Give a brief overview of the project, its structure, tech stack, and current state.
  Does NOT execute any commands or modify files — only provides a concise text answer.
argument-hint: "[optional: topic to focus on, e.g. 'back', 'front', 'architecture', 'commands']"
---

# Describe Skill

Дай краткое описание проекта Test Guardian. Ничего не запускай, не меняй файлы — только ответь текстом.

## Правила

1. **НЕ выполняй никаких команд** — ни bash, ни git, ни make, ни docker
2. **НЕ читай файлы** — используй только знания из CLAUDE.md и контекст беседы
3. **НЕ создавай и не редактируй файлы**
4. Ответ должен быть **кратким** — 5–15 строк максимум

## Что включить в ответ

Если `$ARGUMENTS` пуст — дай общий обзор:
- Название и назначение проекта
- Структура монорепо (3 пакета)
- Основной tech stack
- Как запустить (`make up`, `make check`)

Если `$ARGUMENTS` указывает тему — сфокусируйся на ней:
- `back` — архитектура бэкенда, DDD-слои, ключевые агрегаты
- `front` — React SPA, Vite, основные страницы
- `collector` — CLI-агент, AST-парсер, назначение
- `architecture` / `arch` — DDD-слои, flow данных, принципы
- `commands` — полезные make-команды
- `stack` — полный tech stack

## Формат ответа

Используй краткий markdown с буллетами. Не пиши заголовки уровня 1.
Отвечай на русском.
