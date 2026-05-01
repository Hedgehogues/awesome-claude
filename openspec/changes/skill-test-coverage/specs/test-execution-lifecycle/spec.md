## ADDED Requirements

### Requirement: Single RUN_ROOT per test execution
`skill:test-skill` and `skill:test-all` SHALL create exactly one root tmp-directory per invocation using `mktemp -d -t skill-test-XXXXXX`. Per-case tmp-directories SHALL be subdirectories of RUN_ROOT (e.g. `$RUN_ROOT/case-<N>/`), not separate `mktemp -d` calls.

#### Scenario: One mktemp per run
- **WHEN** `skill:test-skill <ns>:<skill>` runs with N cases
- **THEN** `mktemp -d` is called exactly once, producing RUN_ROOT
- **THEN** N case-directories are created as `$RUN_ROOT/case-1`, `$RUN_ROOT/case-2`, ..., `$RUN_ROOT/case-N`

### Requirement: Automatic cleanup via trap EXIT
RUN_ROOT SHALL be removed automatically on shell exit (success, failure, Ctrl+C, crash) via `trap "rm -rf '$RUN_ROOT'" EXIT`. This matches the pattern used by `skills/sdd/scripts/bump-namespace.sh`.

#### Scenario: Cleanup on success
- **WHEN** all cases pass and skill exits 0
- **THEN** RUN_ROOT is removed from disk
- **THEN** no `/tmp/skill-test-*` directories remain

#### Scenario: Cleanup on crash
- **WHEN** a case raises an unhandled error mid-run
- **THEN** trap EXIT fires
- **THEN** RUN_ROOT is removed from disk

### Requirement: Status file lives inside RUN_ROOT
A status file `$RUN_ROOT/status.json` SHALL be created before the first case runs and updated after each case (case name, verdict, tmp_path). It SHALL NOT be placed in any global location (e.g. `/tmp/skill-test-status.json` or `~/.cache/`).

```json
{
  "run_id": "<mktemp-suffix>",
  "started_at": "ISO8601",
  "skill": "<ns>:<skill>",
  "run_root": "/tmp/skill-test-XXXXXX",
  "cases": [
    {"name": "<case-name>", "tmp_path": "case-1", "status": "running|passed|failed"}
  ]
}
```

#### Scenario: No conflict with parallel runs
- **WHEN** two `skill:test-skill` invocations run concurrently
- **THEN** each has its own RUN_ROOT (mktemp guarantees uniqueness)
- **THEN** each has its own status.json inside its own RUN_ROOT
- **THEN** neither overwrites or reads the other's status

#### Scenario: No leak across runs
- **WHEN** a previous run finished (any verdict)
- **THEN** its RUN_ROOT and status.json are gone (removed by trap)
- **THEN** the next run gets a fresh RUN_ROOT with no residual state

### Requirement: --keep-tmp option for debugging
`skill:test-skill` SHALL accept an optional `--keep-tmp=<mode>` flag with three modes: `none` (default), `failed-only`, `all`.

- `none` — trap EXIT cleans up RUN_ROOT fully.
- `failed-only` — before exit, failed case-dirs are copied to `~/.cache/skill-test/<run-id>/`; the path is printed in the final report; trap still cleans RUN_ROOT.
- `all` — trap is disabled; RUN_ROOT is preserved as-is; path is printed in the final report.

#### Scenario: Failed-only preserves selectively
- **WHEN** invoked with `--keep-tmp=failed-only` and 1 case fails out of 3
- **THEN** `~/.cache/skill-test/<run-id>/case-<failed-N>/` exists with the failed case's content
- **THEN** RUN_ROOT itself is removed
- **THEN** final report prints the cache path

#### Scenario: Default mode cleans everything
- **WHEN** invoked without `--keep-tmp`
- **THEN** mode `none` applies
- **THEN** after exit, no skill-test artifacts exist on disk

### Requirement: Final report references RUN_ROOT lifecycle
`skill:test-skill` final report SHALL include a line about RUN_ROOT state:

- `Run root: <path> (cleaned up)` — when mode is `none` and trap fired
- `Run root: <preserved-path>` — when mode is `all` or `failed-only` preserved something

#### Scenario: Report mentions cleanup
- **WHEN** skill exits in default mode
- **THEN** final report ends with: "Run root: /tmp/skill-test-XXXXXX (cleaned up)"
