---
name: commit
description: >
  Create a well-structured git commit following project conventions.
  Analyzes staged and unstaged changes, drafts a detailed commit message
  with What/Why/Details sections, and commits. Auto-detects task ID format
  from git history.
argument-hint: "[optional: TASK-ID to use in commit title, e.g. 'TG-42']"
model: haiku
allowed-tools: Bash(git *), Read, Grep
---

# Задача

Создай коммит по конвенциям проекта. $ARGUMENTS

## Контекст (предвычислено)

### Последние коммиты (стиль и TASK-ID)
!`git log --oneline -10`

### Текущий статус
!`git status --short`

## 1. Собери недостающее

```bash
git diff HEAD
```

Статус и история уже выше — вызывать не нужно.

## 2. Проанализируй

- Какие файлы изменены, новые, удалены
- Есть ли файлы, которые НЕ НУЖНО коммитить (`.env`, credentials, временные)
- Сгруппируй по логическим блокам — один коммит = одно изменение

## 3. Определи TASK-ID

- Из `$ARGUMENTS` → используй его
- Иначе → определи формат из `git log` (например `[TG-42]`, `PROJ-123`)
- Не определяется → спроси

## 4. Формат commit message

Проверь `.claude/rules/git.md` или определи стиль из `git log --oneline -10`.

Если конвенции не найдены:

```
[TASK-ID]: short summary (imperative mood, lowercase, max 72 chars)

## What changed
- Конкретный bullet для каждого значимого изменения (имена файлов, области)

## Why
- Мотивация, какую проблему решает

## Details
- Решения по реализации, неочевидные моменты, побочные эффекты
```

Всегда объясняй WHY. Упоминай покрытие тестами.

## 5. Покажи план и дождись подтверждения

1. Файлы для staging
2. Полный текст commit message
3. Пропущенные файлы и почему

**НЕ коммить без одобрения.**

## 6. Выполни коммит

```bash
git add <file1> <file2> ...

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

## 7. Проверь

```bash
git status
git log -1
```

## Правила

- **Никогда**: push, --amend, --no-verify, коммит `.env`/секретов — без явной просьбы
- Добавляй файлы по именам (`git add file1 file2`), не `git add .`
- При падении pre-commit hook — исправь и создай НОВЫЙ коммит (не amend)
