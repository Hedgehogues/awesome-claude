---
name: skill:test-skill
description: >
  Тест одного скилла: несколько кейсов, стабы, семантические проверки.
  Читает cases/<ns>/<skill>.md, для каждого Case поднимает стаб,
  запускает скилл в агенте, проверяет contains + semantic.
argument-hint: "<namespace>:<skill>  (например sdd:help)"
model: sonnet
allowed-tools: Bash, Read, Agent
---

# Тест скилла: $ARGUMENTS

## Шаги

### 1. Разбей аргумент и найди спеку

Из `$ARGUMENTS` извлеки `NS` и `SKILL`.

Читай `skills/skill/cases/$NS/$SKILL.md`.
Если не найдена → `SKIP: no test spec for $ARGUMENTS`.

### 2. Разбей спеку на кейсы

Каждый `## Case: <name>` — отдельный кейс. Извлеки:
- `stub:` — имя стаба
- `contains:` — список строк
- `semantic:` — список семантических правил

### 3. Для каждого кейса

#### 3a. Загрузи стаб

Читай `skills/skill/stubs/<stub-name>.md`. Разбери YAML frontmatter:
- `git.branch`, `git.commits[]`
- `skills.<ns>[]` — список имён скиллов
- `openspec.changes[]` — список имён changes (опционально)

#### 3b. Материализуй стаб

```bash
TMP=$(mktemp -d)
cd "$TMP"
git init --quiet
git config user.email "test@test.local"
git config user.name "Test"
git checkout -b <git.branch> --quiet 2>/dev/null || git checkout <git.branch> --quiet
```

Для каждого коммита из `git.commits`:
```bash
git commit --allow-empty -m "<commit>" --quiet
```

Для каждого скилла из `skills.<ns>`:
```bash
mkdir -p "$TMP/.claude/skills/$NS"
cp "skills/$NS/<skill>.md" "$TMP/.claude/skills/$NS/"
```
Также скопируй `skills/$NS/.manifest`.

Если в стабе есть `openspec.changes`:
```bash
for change in <openspec.changes>; do
  mkdir -p "$TMP/openspec/changes/$change"
done
```

#### 3c. Запусти скилл в агенте

Прочитай `skills/$NS/$SKILL.md`. Удали frontmatter (`---…---`).

Запусти Agent с промптом:
```
Working directory for this test: <TMP>
Before every bash command run: cd <TMP>

<тело скилла без frontmatter>
```

Сохрани весь текстовый вывод агента → `OUTPUT`.

#### 3d. Проверь contains

Для каждой строки из `contains:` проверь присутствие в `OUTPUT`.

#### 3e. Проверь semantic

Каждое правило — логический вывод из стаба:

| Правило | Ожидание |
|---|---|
| `branch: stub.git.branch appears in output` | значение `git.branch` из стаба есть в `OUTPUT` |
| `skills: all stub.skills.<ns> items appear as /<ns>:<name> in output` | для каждого имени из `skills.<ns>` строка `/<ns>:<name>` есть в `OUTPUT` |
| `changes: active changes block shows "(none)"` | `(none)` есть в `OUTPUT` (стаб без `openspec.changes`) |
| `changes: each stub.openspec.changes item appears in active changes block` | каждый элемент `openspec.changes` есть в `OUTPUT` |

#### 3f. Результат кейса

```
  Case: <name>  PASSED (N/N) | FAILED (M/N)
    contains[1]: PASS | FAIL — "<pattern>"
    semantic[1]: PASS | FAIL — <описание правила> (ожидалось: "<value>")
```

### 4. Итоговый отчёт

```
=== TEST: $ARGUMENTS ===

  Case: fresh-repo    PASSED (6/6)
  Case: with-openspec FAILED (3/4)  ← semantic[2]: "another-change" not in output
  Case: multi-skill   PASSED (6/6)

RESULT: 2 passed, 1 failed  (total checks: 16)
```

Если есть FAILED — вывести первые 20 строк `OUTPUT` упавшего кейса.
