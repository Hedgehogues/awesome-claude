## ADDED Requirements

### Requirement: skill runner writes execution state for every skill invocation
When any skill is invoked via `claude -p`, the runner SHALL create and maintain a state record at `~/.cache/awesome-claude/skill-runs/<run-id>/state.yaml`. The skill body itself does not know about state — the runner (e.g. `run_test.py` or any direct invoker) is responsible for writing it.

State schema:
```yaml
skill: "dev:tdd"
run_id: "<uuid>"
started_at: "2026-05-02T07:00:00Z"
status: "pending"     # pending | running | done | failed
finished_at: null     # set when status transitions to done | failed
output_path: "~/.cache/awesome-claude/skill-runs/<run-id>/output.txt"
```

State transitions:
- `pending` → created before invocation
- `running` → set immediately before `claude -p` is called
- `done` | `failed` → set immediately after `claude -p` returns, based on exit code

#### Scenario: state created before skill invocation
- **WHEN** runner is about to call `claude -p` for `dev:tdd`
- **THEN** `~/.cache/awesome-claude/skill-runs/<run-id>/state.yaml` exists with `status: pending`

#### Scenario: state transitions to running during invocation
- **WHEN** `claude -p` call starts
- **THEN** `state.yaml` has `status: running`

#### Scenario: state updated to done on success
- **WHEN** `claude -p` exits with code 0
- **THEN** `state.yaml` has `status: done`, `finished_at` is set, `output_path` points to captured stdout

#### Scenario: state updated to failed on error
- **WHEN** `claude -p` exits non-zero
- **THEN** `state.yaml` has `status: failed`, `finished_at` is set

#### Scenario: skill body unaware of state
- **WHEN** a skill's `skill.md` is read and invoked
- **THEN** no state-writing instructions appear in the skill body itself — state is fully external

### Requirement: test runner writes execution state for every test run
When `run_test.py` runs any test, it SHALL maintain a separate state record at `~/.cache/awesome-claude/test-runs/<run-id>/state.yaml`. This is distinct from skill-run state and tracks test-level granularity.

State schema:
```yaml
test: "dev:tdd"
run_id: "<uuid>"
started_at: "2026-05-02T07:00:00Z"
cases:
  - id: "positive-happy-with-context"
    status: "pending"   # pending | running | done | failed | skipped
    started_at: null
    finished_at: null
    duration_ms: null
    verdict: null       # passed | failed (only when status is done | failed)
```

State is updated per-case, not only at run end.

#### Scenario: test-run state created before first case
- **WHEN** `run_test.py dev:tdd` starts a new run
- **THEN** `~/.cache/awesome-claude/test-runs/<run-id>/state.yaml` exists with all cases in `status: pending`

#### Scenario: case state updated to running before execution
- **WHEN** a case is about to be executed
- **THEN** its entry in `state.yaml` has `status: running`, `started_at` is set

#### Scenario: case state updated after completion
- **WHEN** a case finishes
- **THEN** its entry has `status: done | failed`, `verdict`, `duration_ms`, `finished_at` are set

#### Scenario: test-run state persists after run ends
- **WHEN** all cases complete and `run_test.py` exits
- **THEN** `~/.cache/awesome-claude/test-runs/<run-id>/state.yaml` still exists with final verdicts

### Requirement: skill-run state and test-run state are stored separately
`skill-runs/` and `test-runs/` are separate subdirectories under `~/.cache/awesome-claude/`. A single `run_test.py` execution produces exactly one test-run record AND one skill-run record per case (since each case invokes `claude -p` once).

#### Scenario: one test run with two cases produces three records
- **WHEN** `run_test.py dev:tdd` runs 2 cases
- **THEN** `~/.cache/awesome-claude/test-runs/<run-id>/state.yaml` has 2 case entries
- **THEN** `~/.cache/awesome-claude/skill-runs/` has 2 separate run directories, one per case invocation

### Requirement: skill:test-all maintains an aggregate run state
`skill:test-all` iterates over all skills and invokes `run_test.py` per skill. It SHALL maintain its own aggregate state at `~/.cache/awesome-claude/test-all-runs/<run-id>/state.yaml`, separate from individual test-run records.

State schema:
```yaml
run_id: "<uuid>"
started_at: "2026-05-02T07:00:00Z"
skills:
  - id: "dev:tdd"
    status: "pending"   # pending | running | done | failed | skipped
    started_at: null
    finished_at: null
    test_run_id: null   # run-id of the delegated run_test.py invocation
    verdict: null       # passed | failed | skipped
```

`test_run_id` links the aggregate record to the individual `test-runs/<id>/state.yaml` for drill-down.

#### Scenario: test-all state created before first skill
- **WHEN** `skill:test-all` starts a new run
- **THEN** `~/.cache/awesome-claude/test-all-runs/<run-id>/state.yaml` exists with all skills in `status: pending`

#### Scenario: per-skill entry updated when run_test.py completes
- **WHEN** `run_test.py dev:tdd` returns
- **THEN** `dev:tdd` entry in test-all state has `status: done | failed`, `verdict`, `test_run_id` pointing to the individual test-run record

#### Scenario: test-all resume via --run-id skips done skills
- **WHEN** `skill:test-all --run-id abc123` is called and `dev:tdd` entry shows `status: done`
- **THEN** `dev:tdd` is skipped; `run_test.py dev:tdd` is not invoked again

### Requirement: both state stores support resume via --run-id
Passing `--run-id <id>` to `run_test.py` loads existing test-run state and skips cases with `status: done | failed | skipped`. The corresponding skill-run records are NOT re-executed.

#### Scenario: resume skips done cases
- **WHEN** `run_test.py dev:tdd --run-id abc123` is called and `test-runs/abc123/state.yaml` shows case 1 as `done`
- **THEN** case 1 is skipped; no new skill-run record is created for it
- **THEN** case 2 is executed; a new skill-run record is created
