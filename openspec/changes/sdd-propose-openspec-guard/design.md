## Context

`sdd:propose/skill.md` шаг 1 вызывает скилл `openspec-propose` через Skill tool. Этого скилла не существует — Claude Code возвращает `Unknown skill: openspec-propose`. Frontmatter описания и тело скилла также ссылаются на `.openspec-version` (файла нет) и обещают автоматическую установку CLI, которой нет.

`openspec` — реальный Node.js бинарь (v1.3.1, `/opt/homebrew/bin/openspec`). Все нужные команды уже доступны: `openspec new change`, `openspec status`, `openspec instructions`.

## Goals / Non-Goals

**Goals:**
- `sdd:propose` работает через прямой вызов `openspec` CLI
- При отсутствии бинаря — понятная ошибка с инструкцией

**Non-Goals:**
- Автоматическая установка `openspec` (это задача `dev:install`)
- Изменение логики propose после шага 1

## Decisions

**Убрать Skill tool, заменить Bash tool**

Шаг 1: вместо `Skill("openspec-propose")` → `Bash: openspec new change "<name>"`.
Причина: вызванного скилла не существует, а прямой CLI-вызов уже работает.

**Guard в начале скилла**

```bash
which openspec || { echo "openspec not found. Run /dev:install"; exit 1; }
```

Вставить перед всеми остальными шагами. Fail fast — пользователь сразу видит проблему.

**Убрать `.openspec-version` из frontmatter**

Фраза "OpenSpec CLI устанавливается автоматически по версии из .openspec-version" — удалить. Она описывает несуществующую функциональность и создаёт ложные ожидания.

## Risks / Trade-offs

Если пользователь использует не Homebrew — путь к `openspec` может быть другим. Guard через `which openspec` покрывает любой `$PATH`, поэтому риск минимален.
