## ADDED Requirements

### Requirement: script parses cases file
`run_test.py <ns>:<skill>` SHALL read `skills/<ns>/<skill>/cases/<skill>.md`, extract all `## Case:` blocks with their `stub:`, `contains:`, and `semantic:` fields. If the file does not exist, the script SHALL exit with `SKIP: no test spec for <ns>:<skill>`.

#### Scenario: cases file found
- **WHEN** `run_test.py dev:tracing` is invoked and `skills/dev/tracing/cases/tracing.md` exists
- **THEN** script extracts all Case blocks without error

#### Scenario: cases file missing
- **WHEN** `run_test.py dev:unknown` is invoked and the cases file does not exist
- **THEN** script prints `SKIP: no test spec for dev:unknown` and exits 0

### Requirement: script materializes stubs
For each case, the script SHALL read the stub from `skills/skill/test-skill/stubs/<stub-name>.md` and create a temporary directory with: git repo (branch + commits), `.claude/skills/<ns>/` files, files from `files:`, executable mock commands from `mock_commands:` in `.mocks/`, and openspec directories from `openspec.changes`.

#### Scenario: fresh-repo stub materializes
- **WHEN** stub is `fresh-repo`
- **THEN** `$TMP` contains a git repo on branch `main` with 2 empty commits and `.claude/skills/sdd/help/skill.md`

#### Scenario: with-deploy-config stub materializes
- **WHEN** stub is `with-deploy-config`
- **THEN** `$TMP/Makefile` exists with deploy target, `$TMP/.mocks/docker` is executable, env vars `DEPLOY_ENV` and `DEPLOY_TOKEN` are set

### Requirement: script maintains persistent YAML state
The script SHALL create `~/.cache/awesome-claude/<run-id>/state.yaml` before the first item runs and update it after each item completes. State persists across interruptions and allows resume.

State schema:
```yaml
run: "<ns>:<skill>"
run_id: "<run-id>"
started_at: "2026-05-02T07:00:00Z"
items:
  - id: "no-trace-target"
    status: "done"      # pending | running | done | failed | skipped
    started_at: "..."
    duration_ms: 5234
    verdict: "passed"   # passed | failed (only for done/failed)
```

#### Scenario: state.yaml created before first item
- **WHEN** script starts a new run
- **THEN** `~/.cache/awesome-claude/<run-id>/state.yaml` exists with all items in `status: pending`

#### Scenario: state.yaml updated after each item
- **WHEN** an item completes
- **THEN** its entry in `state.yaml` has `status: done` or `status: failed` with `duration_ms` and `verdict`

### Requirement: script resumes interrupted runs
If `~/.cache/awesome-claude/<run-id>/state.yaml` exists and contains items with `status: done` or `status: failed`, the script SHALL skip those items and continue from the first `pending` item.

#### Scenario: resume after interruption
- **WHEN** `run_test.py dev:tracing --run-id abc123` is called and `state.yaml` shows `no-trace-target: done`
- **THEN** script skips `no-trace-target` and runs only `with-context`

#### Scenario: fresh run generates new run-id
- **WHEN** `run_test.py dev:tracing` is called without `--run-id`
- **THEN** a new `run-id` is generated and a fresh `state.yaml` is created

### Requirement: script runs skill via claude CLI
For each case, the script SHALL invoke `claude -p "<skill-body>" --cwd <TMP>` and capture stdout as `OUTPUT`.

#### Scenario: skill invoked in case directory
- **WHEN** case materializes to `$TMP`
- **THEN** `claude -p` is called with `--cwd $TMP` so the skill operates in the correct context

#### Scenario: claude CLI missing
- **WHEN** `claude` is not found in PATH
- **THEN** script prints `ERROR: claude CLI not found. Install from https://claude.ai/claude-code` and exits non-zero

### Requirement: script checks contains rules
For each `contains:` entry in a case, the script SHALL check whether the string appears in `OUTPUT` and report PASS or FAIL.

#### Scenario: contains string present
- **WHEN** `contains:` entry appears verbatim in agent output
- **THEN** check reports PASS

#### Scenario: contains string absent
- **WHEN** `contains:` entry does not appear in output
- **THEN** check reports FAIL with the missing string

### Requirement: script checks semantic rules automatically from stub data
For each `semantic:` entry, the script SHALL evaluate it automatically by deriving expected values from the stub. The following rules are supported:

| Rule key | Check |
|---|---|
| `branch` | `stub.git.branch` appears in OUTPUT |
| `skills` | `/<ns>:<name>` for each entry in `stub.skills.<ns>` appears in OUTPUT |
| `changes` (no openspec.changes in stub) | `(none)` appears in OUTPUT |
| `changes` (openspec.changes present) | each change name appears in OUTPUT |

Unknown rule keys SHALL be reported as `UNKNOWN — <rule>: cannot evaluate automatically`.

#### Scenario: branch rule passes
- **WHEN** stub has `git.branch: feature-test` and OUTPUT contains `feature-test`
- **THEN** semantic check `branch` reports PASS

#### Scenario: skills rule passes
- **WHEN** stub has `skills.sdd: [help, sync]` and OUTPUT contains `/sdd:help` and `/sdd:sync`
- **THEN** semantic check `skills` reports PASS

#### Scenario: changes rule with empty openspec
- **WHEN** stub has no `openspec.changes` and OUTPUT contains `(none)`
- **THEN** semantic check `changes` reports PASS

#### Scenario: changes rule with openspec items
- **WHEN** stub has `openspec.changes: [my-feature]` and OUTPUT contains `my-feature`
- **THEN** semantic check `changes` reports PASS

### Requirement: script prints final report
After all cases, the script SHALL print a summary in the same format as `skill:test-skill`: per-case verdict, total passed/failed, total checks.

#### Scenario: all cases pass
- **WHEN** all contains checks pass
- **THEN** report shows `RESULT: N passed, 0 failed`

#### Scenario: some cases fail
- **WHEN** at least one contains check fails
- **THEN** report shows `RESULT: X passed, Y failed` and prints first 20 lines of failed OUTPUT

### Requirement: script cleans up state explicitly
The temp directory `$TMP` for each item is deleted after the item completes. The `state.yaml` in `~/.cache/awesome-claude/<run-id>/` is NOT auto-deleted — it persists for resume. Explicit cleanup via `--clean` flag removes the state directory.

#### Scenario: item tmp deleted after completion
- **WHEN** a case finishes (pass or fail)
- **THEN** `$TMP` for that case is deleted

#### Scenario: state persists after run
- **WHEN** all cases complete
- **THEN** `~/.cache/awesome-claude/<run-id>/state.yaml` still exists with final verdicts

#### Scenario: explicit cleanup
- **WHEN** `run_test.py dev:tracing --clean <run-id>` is called
- **THEN** `~/.cache/awesome-claude/<run-id>/` is deleted
