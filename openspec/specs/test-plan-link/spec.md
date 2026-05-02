## Purpose
Test plan artifact lifecycle: required at archive time, read as context during apply, generates semantic cases via script.

## Requirements

### Requirement: Change directory contains test-plan.md with YAML front matter and markdown body
Every new change created after implementing this capability SHALL include a `test-plan.md` file with YAML front matter (fields: `approach`, `acceptance_criteria`) and a markdown body with `## Scenarios`. `sdd:propose` creates the stub automatically. Existing changes without `test-plan.md` continue to work.

#### Scenario: New change is created
- **WHEN** author creates a new change via `sdd:propose`
- **THEN** `openspec/changes/<name>/test-plan.md` exists
- **THEN** file has YAML front matter with fields: `approach`, `acceptance_criteria`
- **THEN** file has markdown body with `## Scenarios` section

#### Scenario: test-plan.md is missing at archive time
- **WHEN** `sdd:archive` checks the change directory and `test-plan.md` is absent
- **THEN** archive is blocked with: "test-plan.md is missing — required before archiving"

#### Scenario: test-plan.md front matter has unfilled fields at archive time
- **WHEN** `sdd:archive` checks `test-plan.md` and YAML front matter fields contain only stub content
- **THEN** archive warns: "test-plan.md appears unfilled" and prompts author to confirm

### Requirement: sdd:apply reads test-plan.md as context
When implementing a change, `sdd:apply` SHALL include `test-plan.md` as context AND SHALL invoke `test-plan-to-cases.py` to generate semantic case files at `skills/skill/cases/<namespace>/<capability>/<ac_id>.md`. The previous behavior (read as context only) is extended with case generation.

#### Scenario: apply reads test-plan and generates cases
- **WHEN** `sdd:apply` starts implementing a change
- **THEN** `test-plan.md` is read alongside `specs/` and `design.md`
- **THEN** `test-plan-to-cases.py` is invoked to generate semantic case files
- **THEN** generated cases align with `acceptance_criteria` in `test-plan.md`

### Requirement: sdd:archive leaves test-plan.md in archived change directory
When archiving, `sdd:archive` SHALL leave `test-plan.md` in the archived change directory (`openspec/changes/archive/<date>-<name>/`) and SHALL NOT copy or move it to `openspec/specs/`.

#### Scenario: archive does not touch test-plan.md
- **WHEN** `sdd:archive` archives change `<name>`
- **THEN** `openspec/changes/archive/<date>-<name>/test-plan.md` exists
- **THEN** `openspec/specs/<capability>/test-plan.md` does NOT exist
