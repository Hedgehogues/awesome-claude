## Purpose
Test cases for sdd:apply covering test-plan reading, index.yaml update, and case generation.
## Requirements
### Requirement: cases/sdd/apply.md exists with at least two cases
`skills/skill/cases/sdd/apply.md` SHALL exist and contain at least two cases: one happy-path case verifying that `test-plan.md` is read as context and `index.yaml` is updated, and one case where `.sdd.yaml` is absent and the index update step is skipped.

#### Scenario: apply reads test-plan and updates index
- **WHEN** `skill:test-skill sdd:apply` runs with stub `change-with-sdd-yaml`
- **THEN** output contains evidence that `test-plan.md` was read (acceptance_criteria referenced)
- **THEN** output contains evidence that `index.yaml` was updated with the capability from `.sdd.yaml`

#### Scenario: apply skips index update when .sdd.yaml absent
- **WHEN** `skill:test-skill sdd:apply` runs with stub `fresh-repo`
- **THEN** skill completes without error
- **THEN** output does not attempt to update `index.yaml`

