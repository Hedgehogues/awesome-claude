## ADDED Requirements

### Requirement: apply runs tests before each task (RED check)
Before executing each implementation task, `sdd:apply` SHALL invoke `run_test.py <ns>:<skill>` and expect a non-all-GREEN result. If all tests pass before implementation, apply SHALL print a warning that the RED phase cannot be verified.

#### Scenario: tests fail before task (expected RED)
- **WHEN** `run_test.py` returns FAILED before a task
- **THEN** apply proceeds with implementation and prints `RED ✓ — proceeding`

#### Scenario: tests pass before task (missing RED)
- **WHEN** `run_test.py` returns all PASSED before a task
- **THEN** apply prints `WARNING: tests already GREEN before task — RED phase unverifiable` and continues

#### Scenario: no cases file (SKIP)
- **WHEN** `run_test.py` returns `SKIP: no test spec for <ns>:<skill>`
- **THEN** apply skips TDD check for this task and proceeds without warning

### Requirement: apply runs tests after each task (GREEN check)
After executing each implementation task, `sdd:apply` SHALL invoke `run_test.py <ns>:<skill>` and expect all tests to pass.

#### Scenario: tests pass after task (GREEN)
- **WHEN** `run_test.py` returns all PASSED after a task
- **THEN** apply marks the task complete and continues to the next task

#### Scenario: tests fail after task (not GREEN)
- **WHEN** `run_test.py` returns FAILED after a task
- **THEN** apply prints the red-banner, outputs the first 20 lines of failed test output, and stops execution

### Requirement: apply skips TDD check when run_test.py unavailable
If `run_test.py` is not found at the expected path, `sdd:apply` SHALL print a warning and skip TDD checks for the entire run (not a hard stop).

#### Scenario: run_test.py missing
- **WHEN** `skills/skill/test-skill/scripts/run_test.py` does not exist
- **THEN** apply prints `WARNING: run_test.py not found — TDD cycle skipped` and proceeds without TDD checks

### Requirement: TDD checks are per-task, not per-run
The RED check and GREEN check SHALL be invoked once per implementation task, not once for the entire apply run.

#### Scenario: multiple tasks in one apply
- **WHEN** `tasks.md` has 3 uncompleted tasks
- **THEN** `run_test.py` is called 6 times: before task 1, after task 1, before task 2, after task 2, before task 3, after task 3
