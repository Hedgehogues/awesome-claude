---
name: skill:deps
description: >
  Установка/проверка зависимостей awesome-claude из manifest.yaml: CLI-инструменты из
  секции tools:, субмодули из repos: через sdd:sync. Read-only по manifest.yaml — никогда
  не пишет в него (для добавления записей используй ручное редактирование или sdd:repo).
  Валидирует схему manifest.yaml: ошибка и стоп если отсутствует один из version, tools, repos.
model: sonnet
allowed-tools: Bash, Read, Skill
---

# skill:deps — зависимости из manifest.yaml

## Шаги

### 1. Проверить manifest.yaml существует

```bash
test -f manifest.yaml || { echo "ERROR: manifest.yaml not found in current directory"; exit 1; }
```

### 2. Validate schema

Через Bash + python3:

```bash
python3 -c "
import sys, yaml
data = yaml.safe_load(open('manifest.yaml')) or {}
required = {'version', 'tools', 'repos'}
missing = required - set(data.keys())
if missing:
    print(f'ERROR: manifest.yaml missing required keys: {sorted(missing)}', file=sys.stderr)
    sys.exit(1)
print('manifest.yaml schema OK')
print(f'  version: {data[\"version\"]}')
print(f'  tools:   {len(data[\"tools\"] or {})} entries')
print(f'  repos:   {len(data[\"repos\"] or [])} entries')
"
```

При non-zero exit — остановись с error message.

### 3. Install/verify tools

Для каждой записи в `tools:` (читаешь через Bash + python3):

```bash
python3 -c "
import yaml
data = yaml.safe_load(open('manifest.yaml')) or {}
for name, version in (data.get('tools') or {}).items():
    print(f'{name}={version}')
"
```

Для каждой пары `<name>=<version>` — проверь установку:

- `openspec`: `openspec --version` — сравни с required version. Если несовпадение или отсутствует — `npm install -g openspec@<version>` (или другой install method).
- Другие tools: best-effort через `which <name>` + version-check; если установка нетривиальна — выведи instruction для пользователя.

Сообщай по каждому: `<name>: <installed|already up to date|installed v<X>>`.

### 4. Sync repos (если не пусто)

Если `repos:` непустой:

```bash
python3 -c "
import yaml
data = yaml.safe_load(open('manifest.yaml')) or {}
print('non-empty' if data.get('repos') else 'empty')
"
```

Если `non-empty` — вызови `sdd:sync` через Skill tool.
Если `empty` — пропусти этот шаг с сообщением `repos: empty, skipping sdd:sync`.

### 5. Read-only гарантия

После выполнения `git diff manifest.yaml` SHALL показать пустой diff. Если diff не пуст — выведи warning: `WARNING: manifest.yaml was modified during deps install — this is a bug`.

### 6. Final report

```
skill:deps completed:
- tools installed/verified: <N>
- repos synced: <M> (or skipped: empty)
- manifest.yaml: unchanged (read-only)
```

## Что скилл НЕ делает

- НЕ модифицирует `manifest.yaml`. Для добавления tools/repos — редактируй файл руками или используй `sdd:repo` для секции `repos:`.
- НЕ создаёт симлинки (это `skill:setup`).
- НЕ запускает тесты.
