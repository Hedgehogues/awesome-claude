## ADDED Requirements

### Requirement: cases/sdd/archive.md exists with at least three cases
`skills/skill/cases/sdd/archive.md` SHALL exist and contain at least three cases: blocking when `test-plan.md` is missing, happy-path archiving without copying `test-plan.md` to `specs/` (per Modified `test-plan-link`), and `index.yaml` update after archive.

#### Scenario: archive blocks when test-plan.md is missing
- **WHEN** `skill:test-skill sdd:archive` runs with stub `change-missing-test-plan`
- **THEN** output contains "test-plan.md is missing — required before archiving"
- **THEN** no archive directory is created

#### Scenario: archive succeeds without copying test-plan.md to specs/
- **WHEN** `skill:test-skill sdd:archive` runs with stub `change-with-sdd-yaml`
- **THEN** skill completes the archive flow without blocking
- **THEN** output indicates `test-plan.md` remains in archived change directory and is NOT copied to `openspec/specs/<capability>/`

#### Scenario: archive updates index.yaml
- **WHEN** `skill:test-skill sdd:archive` runs with stub `change-with-sdd-yaml`
- **THEN** output contains evidence that `openspec/specs/index.yaml` was updated or created
