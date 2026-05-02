---
name: skill:release
description: >
  Финальный шаг контрибьюторского workflow — релиз awesome-claude. Bump-version в
  manifest.yaml, commit, version tag. Останавливается если working tree не чистый.
model: sonnet
allowed-tools: Bash, Read, AskUserQuestion
---

# skill:release — релиз awesome-claude

## Шаги

### 1. Pre-checks

```bash
# Working tree должен быть чистый
if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree has uncommitted changes:"
  git status --short
  exit 1
fi

# manifest.yaml должен существовать
test -f manifest.yaml || { echo "ERROR: manifest.yaml not found"; exit 1; }
```

### 2. Read current version

```bash
current=$(python3 -c "import yaml; print((yaml.safe_load(open('manifest.yaml')) or {}).get('version', ''))")
test -n "$current" || { echo "ERROR: manifest.yaml has no version field"; exit 1; }
echo "Current version: $current"
```

### 3. Ask bump type

Через **AskUserQuestion**:
```
Current version: <current>. Which bump?
Options: major | minor | patch | abort
```

При `abort` — остановись.

### 4. Compute new version

```bash
python3 -c "
import yaml, sys
data = yaml.safe_load(open('manifest.yaml'))
parts = [int(x) for x in data['version'].split('.')]
bump = sys.argv[1]
if bump == 'major': parts = [parts[0]+1, 0, 0]
elif bump == 'minor': parts = [parts[0], parts[1]+1, 0]
elif bump == 'patch': parts = [parts[0], parts[1], parts[2]+1]
print('.'.join(str(p) for p in parts))
" <bump-type>
```

Сохрани результат как `<new>`.

### 5. Update manifest.yaml

```bash
python3 -c "
import yaml
with open('manifest.yaml') as f: data = yaml.safe_load(f)
data['version'] = '<new>'
with open('manifest.yaml', 'w') as f: yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)
"
```

### 6. Commit + tag

```bash
git add manifest.yaml
git commit -m "release: v<new>"
git tag "v<new>"
echo "Released v<new>"
echo "Push: git push && git push --tags"
```

### 7. Final report

```
skill:release completed:
- version: <current> → <new>
- commit: <hash>
- tag: v<new>
- next: git push && git push --tags
```

## Что скилл НЕ делает

- НЕ пушит в remote автоматически (контрибьютор делает явно).
- НЕ публикует в npm/registry — только git tag.
- НЕ работает при грязном working tree.
- НЕ запускает тесты перед релизом — это ответственность контрибьютора (рекомендуется `/skill:test-all`).
