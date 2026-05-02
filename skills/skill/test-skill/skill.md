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

Читай `skills/$NS/$SKILL/cases/$SKILL.md`.
Если не найдена → `SKIP: no test spec for $ARGUMENTS`.

### 2. Разбей спеку на кейсы

Каждый `## Case: <name>` — отдельный кейс. Извлеки:
- `stub:` — имя стаба
- `contains:` — список строк
- `semantic:` — список семантических правил

### 3. Для каждого кейса

#### 3a. Загрузи стаб

Читай `skills/skill/test-skill/stubs/<stub-name>.md`. Разбери YAML frontmatter:
- `git.branch`, `git.commits[]`
- `skills.<ns>[]` — список имён скиллов
- `openspec.changes[]` — список имён changes (опционально)

#### 3b. Материализуй стаб

```bash
RUN_ROOT=$(mktemp -d -t skill-test-XXXXXX)
trap "rm -rf '$RUN_ROOT'" EXIT
TMP="$RUN_ROOT/case-<N>"
mkdir -p "$TMP"
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
mkdir -p "$TMP/.claude/skills/$NS/<skill>"
cp "skills/$NS/<skill>/skill.md" "$TMP/.claude/skills/$NS/<skill>/"
```
Также скопируй `skills/$NS/.manifest`.

**Новое: Mock-stubs расширение**

Если в стабе есть `files:`:
```bash
for path in <files.keys>; do
  mkdir -p "$(dirname "$TMP/$path")"
  echo '<files[path]>' > "$TMP/$path"
done
```

Если в стабе есть `mock_commands:`:
```bash
mkdir -p "$TMP/.mocks"
for cmd in <mock_commands.keys>; do
  echo '#!/bin/bash' > "$TMP/.mocks/$cmd"
  echo '<mock_commands[cmd]>' >> "$TMP/.mocks/$cmd"
  chmod +x "$TMP/.mocks/$cmd"
done
```

Если в стабе есть `openspec.changes`:
```bash
for change in <openspec.changes>; do
  mkdir -p "$TMP/openspec/changes/$change"
done
```

#### 3c. Запусти скилл в агенте

Прочитай `skills/$NS/$SKILL/skill.md`. Удали frontmatter (`---…---`).

**Если есть mock_commands или env**, подготовь окружение:

```
PATH=$TMP/.mocks:$PATH
<для каждого env ключа>: EXPORT <KEY>=<VALUE>
```

Запусти Agent с промптом:
```
Working directory for this test: <TMP>
Before every bash command run: cd <TMP>
Environment: PATH=$TMP/.mocks:$PATH [если есть mocks]
[env переменные]

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

### 5. Eval-framework: bootstrap k=5 + LLM-judge + результирующий файл

Каждый кейс SHALL прогоняться **k=5** раз (bootstrap). Кейс получает PASS если ≥4/5 прогонов успешны; иначе — `⚠ WARN`.

#### 5a. Создать файл результатов в начале прогона

В начале (до запуска первого кейса):

```bash
mkdir -p test-results
RESULTS_FILE="test-results/$(date -u +'%Y-%m-%d-%H%M%S').md"
cat > "$RESULTS_FILE" <<EOF
# Test results: $ARGUMENTS
started_at: $(date -u +'%Y-%m-%dT%H:%M:%SZ')
test: $ARGUMENTS

EOF
```

#### 5b. Прогресс в реальном времени

Для каждого кейса по мере выполнения каждого из 5 прогонов выводи:

```
[<case-name>] 1/5 ✓
[<case-name>] 2/5 ✓
[<case-name>] 3/5 ✗
[<case-name>] 4/5 ✓
[<case-name>] 5/5 ✓
[<case-name>] → PASS 4/5
```

Если ≤3/5 — финальная строка: `→ ⚠ WARN N/5`.

#### 5c. Append каждого результата в RESULTS_FILE

После завершения каждого кейса (всех 5 прогонов) — append блок:

```markdown
## Case: <case-name>
result: PASS | ⚠ WARN
runs: 5
passed: 4
runs_detail:
  - run 1: PASS
  - run 2: PASS
  - run 3: FAIL — contains[1]: "<pattern>" not found
  - run 4: PASS
  - run 5: PASS
semantic_judge_reasons:
  - judge[1]: "yes — output confirms tmp_cleaned"
  - judge[2]: "yes — no_residue verified"
```

#### 5d. LLM-judge для semantic assertions

Каждое правило из `semantic:` SHALL оцениваться отдельным LLM-вызовом (не regex):

```
Prompt: "Output of the skill follows. Does it satisfy the criterion: <criterion>? Answer yes or no with one-line reason."
Output: <OUTPUT>
```

Вердикт: `yes` → semantic[i] PASS; `no` → FAIL. Reason записывается в `runs_detail` и `semantic_judge_reasons`.

#### 5e. Итоговый отчёт в конце файла

После завершения всех кейсов (всех bootstrap-прогонов) — append к RESULTS_FILE:

```markdown
---
## Summary
total_cases: 3
passed: 2
warned: 1
failed: 0
duration_ms: 45230
finished_at: 2026-05-02T03:15:45Z
```

И финальный print в stdout:

```
Results: test-results/2026-05-02-031500.md
2 PASS, 1 WARN, 0 FAIL
```

### 6. Status tracking and cleanup

**Before running cases:** Create `$RUN_ROOT/status.json`:
```json
{
  "started_at": "2026-05-02T03:15:00Z",
  "test": "<ns>:<skill>",
  "run_root": "<RUN_ROOT>",
  "cases": []
}
```

**For each case:** Update status in `$RUN_ROOT/status.json`:
```json
{
  "name": "<case-name>",
  "verdict": "passed|failed",
  "tmp_path": "<RUN_ROOT>/case-<N>",
  "duration_ms": 5234
}
```

**After all cases complete:** Print summary:
```
Run root: $RUN_ROOT (cleaned up)
```

If `--keep-tmp=all` flag: Print `Run root: <RUN_ROOT>` (path preserved for debugging).
If `--keep-tmp=failed-only`: Copy failed case dirs to `~/.cache/skill-test/<run-id>/` and print that path.

**Auto-cleanup:** The `trap "rm -rf '$RUN_ROOT'" EXIT` ensures $RUN_ROOT is deleted on success, failure, or Ctrl+C.
