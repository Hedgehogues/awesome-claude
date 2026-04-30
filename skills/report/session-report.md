---
name: report:session-report
description: >
  Generate a product-focused session report based on actions performed in the current conversation.
  Analyzes own tool calls (Edit, Write, Bash) from context, groups by product themes, and outputs
  a concise stakeholder-friendly summary in Russian. No git commands — pure context introspection.
argument-hint: "[optional: 'short' for bullet-only, 'full' for detailed with insights]"
model: haiku
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/reject-git.sh"
---

# Задача

Продуктовый отчёт по действиям текущего разговора. $ARGUMENTS

**НЕ используй git-команды.** Вся информация — в контексте разговора.

## 1. Проанализируй контекст

Собери из истории разговора:
- **Edit** — какие файлы, что менялось
- **Write** — какие файлы созданы
- **Bash** — какие команды выполнялись
- **Обсуждение** — что просил пользователь, какие решения

## 2. Определи продуктовые изменения

**Продуктовое:** API endpoints, доменные методы/поля, UI компоненты/страницы, миграции БД.

**Игнорируй:** тесты (только количество: "покрыто N тестами"), рефакторинг без изменения поведения, линтер, CI/CD, Docker, skills.

## 3. Сгруппируй в фичи

Каждая фича = backend + frontend + миграция. Для каждой:
- **Название** — что пользователь теперь может делать
- **Суть** — 1-2 предложения
- **Масштаб** — файлов затронуто, есть ли миграция

## 4. Формат

```markdown
## Продуктовый отчёт: [дата]

**Файлов изменено:** N | **Файлов создано:** M

---

### [Главная тема сессии]

#### 1. [Фича]
[Описание]

---

**Тесты:** N новых/изменённых
**Миграции:** список (если есть)
```

### Режимы

- `short` → только буллеты, max 10 строк
- `full` / пусто → полный формат с insight-блоком

## Правила

- Русский язык
- Группируй backend + frontend + миграцию в одну фичу
- Называй с точки зрения пользователя ("История версий"), не разработчика ("Таблица description_versions")
- Нет продуктовых изменений → так и напиши
