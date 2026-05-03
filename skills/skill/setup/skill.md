---
name: skill:setup
description: >
  Dev mode setup для awesome-claude репы — создаёт симлинки skills/, commands/, rules/
  в .claude/ напрямую через bash. Идемпотентен: повторный вызов выводит "Already linked".
  Если .claude/<dir> уже существует как обычная директория — предупреждает и просит
  подтверждение перед заменой.
model: sonnet
allowed-tools: Bash, Read, AskUserQuestion
---

# skill:setup — dev mode симлинки

## Шаги

### 1. Pre-checks

Через Bash проверь что текущая директория — корень awesome-claude (содержит `skills/`, `commands/`, `rules/`):

```bash
test -d skills && test -d commands && test -d rules || { echo "ERROR: not in awesome-claude repo root"; exit 1; }
```

Если нет — остановись с сообщением `not in awesome-claude repo root`.

### 2. Create .claude/ if missing

```bash
mkdir -p .claude
```

### 3. Для каждой из директорий `skills`, `commands`, `rules` — обработать состояние:

```bash
for dir in skills commands rules; do
  target=".claude/$dir"
  source="$(pwd)/$dir"
  if [ -L "$target" ]; then
    current=$(readlink "$target")
    if [ "$current" = "$source" ]; then
      echo "$target: Already linked"
      continue
    fi
    echo "$target: symlink points to $current, expected $source"
    # ask for confirmation to retarget
  elif [ -e "$target" ]; then
    echo "WARNING: $target exists as a real directory — will be replaced"
    # ask for confirmation
  fi
done
```

### 4. Confirmation для замены реальной директории

Если на шаге 3 обнаружена реальная директория или симлинк на другой источник — вызови **AskUserQuestion**:

```
.claude/<dir> exists as <real directory | symlink to other path>. Replace with symlink to $(pwd)/<dir>?
Options: Replace | Skip | Abort all
```

При `Abort all` — остановись без изменений.

### 5. Создать симлинки

Для каждого `<dir>` который требует обновления:

```bash
ln -sfn "$(pwd)/<dir>" ".claude/<dir>"
echo "$target: linked → $source"
```

### 6. Verify rules index

После создания симлинков проверь, что `.claude/rules/index.md` существует и содержит YAML-блок с реестром правил:

```bash
test -f .claude/rules/index.md || echo "WARN: .claude/rules/index.md not found — rules registry missing"
grep -q '```yaml' .claude/rules/index.md && echo "index.md: registry OK" || echo "WARN: index.md has no YAML block"
```

Если `index.md` отсутствует — предупредить пользователя: файл нужно создать вручную или обновить awesome-claude до версии с поддержкой rules-index.

### 7. Final report

```
skill:setup completed:
- .claude/skills    → $(pwd)/skills    [linked|already-linked|skipped]
- .claude/commands  → $(pwd)/commands  [...]
- .claude/rules     → $(pwd)/rules     [...]
- .claude/rules/index.md: [registry OK | WARN: missing]

Edits in skills/, commands/, rules/ are now visible to Claude Code without manual copying.
```

## Что скилл НЕ делает

- НЕ устанавливает зависимости (это `skill:deps`).
- НЕ читает `manifest.yaml`.
- НЕ запускает другие скиллы.
- НЕ изменяет содержимое `skills/`, `commands/`, `rules/` — только создаёт симлинки.
