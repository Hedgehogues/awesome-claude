---
name: commit
description: >
  Create a well-structured git commit following project conventions.
  Analyzes staged and unstaged changes, drafts a detailed commit message
  with What/Why/Details sections, and commits. Follows git.md rules.
argument-hint: "[optional: TASK-ID to use in commit title, e.g. 'TG-42']"
---

# Commit Skill

Создай коммит по конвенциям проекта (см. `.claude/rules/git.md`).

## Порядок выполнения

### Шаг 1: Собери информацию

Выполни параллельно:

```bash
# Текущий статус (не используй -uall)
git status

# Staged + unstaged изменения
git diff HEAD

# Последние коммиты для понимания стиля
git log --oneline -5
```

### Шаг 2: Проанализируй изменения

Прочитай diff и определи:
- Какие файлы изменены и что в них поменялось
- Какие файлы новые (untracked)
- Есть ли файлы, которые НЕ НУЖНО коммитить (`.env`, credentials, временные файлы)

Сгруппируй изменения по логическим блокам — каждый коммит = одно логическое изменение.

### Шаг 3: Определи TASK-ID

- Если `$ARGUMENTS` содержит task ID — используй его
- Если нет — используй `[TG-0]` как placeholder

### Шаг 4: Составь commit message

Формат строго по `.claude/rules/git.md`:

```
[TASK-ID]: short summary (imperative mood, lowercase)

## What changed
- Конкретный bullet point для каждого значимого изменения
- Включай имена файлов и затронутые области
- Будь конкретен: "added 5 unit tests for block refinement" не "added tests"

## Why
- Мотивация и контекст изменения
- Какую проблему решает или требование реализует

## Details
- Решения по реализации и компромиссы
- Неочевидные моменты для ревьюера
- Побочные эффекты
```

**Правила:**
- Title: max 72 символа, imperative mood, lowercase
- Всегда объясняй WHY, а не только WHAT
- Упоминай покрытие тестами
- Если решение неочевидное — объясни reasoning

### Шаг 5: Покажи план коммита

**ПЕРЕД коммитом** покажи пользователю:
1. Список файлов, которые будут добавлены в staging
2. Полный текст commit message
3. Файлы, которые будут пропущены (если есть) и почему

Дождись подтверждения пользователя. **НЕ коммить без одобрения.**

### Шаг 6: Выполни коммит

После подтверждения:

```bash
# Добавь конкретные файлы (НЕ используй git add -A или git add .)
git add <file1> <file2> ...

# Коммит через HEREDOC для правильного форматирования
git commit -m "$(cat <<'EOF'
[TASK-ID]: short summary

## What changed
- ...

## Why
- ...

## Details
- ...

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Шаг 7: Проверка

```bash
git status
git log -1
```

Убедись, что коммит создан и нет потерянных файлов.

## Важные правила

- **Никогда не пушь** без явной просьбы пользователя
- **Никогда не используй --amend** без явной просьбы
- **Никогда не используй --no-verify** — если хук упал, исправь причину
- **Никогда не коммить** `.env`, credentials, секреты — предупреди пользователя
- **Один логический change = один коммит** — если изменения разнородные, предложи разбить
- При падении pre-commit hook — исправь проблему и создай НОВЫЙ коммит (не amend)
- Добавляй файлы по именам (`git add file1 file2`), не через `git add .`
