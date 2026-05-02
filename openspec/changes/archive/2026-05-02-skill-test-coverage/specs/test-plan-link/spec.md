## REMOVED Requirements

### Requirement: sdd:archive copies test-plan.md to specs
Replaced by capability `test-plan-to-semantic-cases` (semantic cases generated at `skills/skill/cases/<ns>/<cap>/<ac_id>.md`) plus the new ADDED requirement below (test-plan.md remains in archived change directory).

## MODIFIED Requirements

### Requirement: sdd:apply reads test-plan.md as context
When implementing a change, `sdd:apply` SHALL include `test-plan.md` as context AND SHALL invoke `test-plan-to-cases.py` to generate semantic case files at `skills/skill/cases/<namespace>/<capability>/<ac_id>.md`. The previous behavior (read as context only) is extended with case generation.

#### Scenario: apply reads test-plan and generates cases
- **WHEN** `sdd:apply` starts implementing a change
- **THEN** `test-plan.md` is read alongside `specs/` and `design.md`
- **THEN** `test-plan-to-cases.py` is invoked to generate semantic case files
- **THEN** generated cases align with `acceptance_criteria` in `test-plan.md`

## ADDED Requirements

### Requirement: sdd:archive leaves test-plan.md in archived change directory
When archiving, `sdd:archive` SHALL leave `test-plan.md` in the archived change directory (`openspec/changes/archive/<date>-<name>/`) and SHALL NOT copy or move it to `openspec/specs/`.

#### Scenario: archive does not touch test-plan.md
- **WHEN** `sdd:archive` archives change `<name>`
- **THEN** `openspec/changes/archive/<date>-<name>/test-plan.md` exists
- **THEN** `openspec/specs/<capability>/test-plan.md` does NOT exist
