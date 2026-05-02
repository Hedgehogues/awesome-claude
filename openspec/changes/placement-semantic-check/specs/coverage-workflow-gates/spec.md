## ADDED Requirements

### Requirement: coverage detector checks workflow-gate artifacts
`sdd:contradiction` coverage detector (3.6) SHALL include a step 5: for each workflow-required artifact, check that `tasks.md` contains at least one task referencing its creation.

Workflow-required artifacts:
- `test-plan.md` — required by `sdd:archive`
- `.sdd.yaml` — required by `sdd:archive`

Match heuristic: artifact name appears in a checkbox line (`- [ ]` or `- [x]`).

Severity: `warning`. Does not raise exit code.

Format: `tasks.md: [warning] coverage: workflow artifact '<name>' has no task in tasks.md (required by sdd:archive)`

#### Scenario: test-plan.md task missing
- **WHEN** change directory is in change-directory mode
- **AND** `tasks.md` contains no checkbox line mentioning `test-plan.md`
- **THEN** detector emits:
  `tasks.md: [warning] coverage: workflow artifact 'test-plan.md' has no task in tasks.md (required by sdd:archive)`

#### Scenario: .sdd.yaml task missing
- **WHEN** change directory is in change-directory mode
- **AND** `tasks.md` contains no checkbox line mentioning `.sdd.yaml`
- **THEN** detector emits:
  `tasks.md: [warning] coverage: workflow artifact '.sdd.yaml' has no task in tasks.md (required by sdd:archive)`

#### Scenario: both tasks present — no warning
- **WHEN** `tasks.md` contains checkbox lines mentioning both `test-plan.md` and `.sdd.yaml`
- **THEN** detector emits no coverage warning for workflow artifacts

#### Scenario: non-change-directory mode — check skipped
- **WHEN** PATH is not a change-directory (no `proposal.md`)
- **THEN** workflow-gate check is skipped silently (inherited from coverage N/A rule)
