## Technical Approach

Удалить `scripts/install.sh` и переместить логику установки в скилл `dev:install`. Скилл выполняет `git clone --depth=1` + `cp -r` компонентов в `.claude/` напрямую через Bash-инструмент Claude Code. Обновление `.versions` — через Python-скрипт (структурированные данные по claude-way). Пользователь говорит "установи awesome-claude" — Claude вызывает `dev:install`.

## Architecture Decisions

### D1: Скилл dev:install, не CLAUDE.md

Логика установки идёт в `skills/dev/install.md`, а не в CLAUDE.md. CLAUDE.md — документация и правила, не исполняемая логика. Скилл имеет явный frontmatter, аргументы, allowed-tools — это правильное место для операций.

### D2: Скилл принимает те же аргументы, что и скрипт

`dev:install [--dev] [component ...]` — сохраняем семантику: без аргументов — всё, `--dev` — включает `skill:` namespace, именованные компоненты — выборочно. Пользователь говорит "установи sdd и dev" → Claude вызывает `dev:install sdd dev`.

### D3: scripts/ полностью удаляется

`install.sh` — единственный файл в `scripts/`. После удаления директория исчезает. Спека `user-interface-principle` обновляется: убирается оговорка про `scripts/` как допустимое исключение.

## Data Flow

```
Пользователь → "установи awesome-claude"
  → Claude вызывает dev:install [args]
    → git clone --depth=1 <repo> <tmp>
    → для каждого компонента: cp -r <tmp>/skills/<ns> .claude/skills/
    → python update_versions.py <tmp> .claude/.versions
  → Claude сообщает об успехе
```

Компоненты: `dev`, `report`, `research`, `sdd`, `rules`, (`skill:` при `--dev`).

## File Changes

**Удаляется:**
- `scripts/install.sh`
- `scripts/` (директория)

**Создаётся:**
- `skills/dev/install.md` — новый скилл
- `.claude/skills/dev/install.md` — зеркало

**Изменяется:**
- `README.md` — убрать `curl | bash`, заменить на Claude-инструкцию
- `openspec/specs/user-interface-principle/spec.md` — убрать оговорку про `scripts/`
