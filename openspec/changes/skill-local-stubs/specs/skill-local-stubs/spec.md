## ADDED Requirements

### Requirement: stubs colocated with skill
Each skill MAY have a `stubs/` directory at `skills/<ns>/<skill>/stubs/` containing stub files specific to that skill. These stubs are owned by the skill and may diverge freely from global stubs.

#### Scenario: local stub exists
- **WHEN** `skills/dev/tracing/stubs/with-source-code.md` exists and a case references `stub: with-source-code`
- **THEN** `run_test.py` uses the local stub without consulting the global pool

#### Scenario: skill has no local stubs directory
- **WHEN** `skills/dev/tdd/stubs/` does not exist
- **THEN** `run_test.py` falls back to global pool for all stubs

### Requirement: local-first stub resolution
`run_test.py` and `skill:test-skill` SHALL resolve stub names in order: (1) `skills/<ns>/<skill>/stubs/<name>.md`, (2) `skills/skill/test-skill/stubs/<name>.md`. If neither exists, the run SHALL fail with an error listing both paths checked.

#### Scenario: local stub shadows global
- **WHEN** both `skills/dev/tracing/stubs/fresh-repo.md` and `skills/skill/test-skill/stubs/fresh-repo.md` exist
- **THEN** the local copy is used and `stub resolved: local` is logged

#### Scenario: fallback to global pool
- **WHEN** local stub does not exist but global does
- **THEN** global stub is used and `stub resolved: global fallback (skills/skill/test-skill/stubs/<name>.md)` is logged

#### Scenario: stub not found in either location
- **WHEN** stub name is not found locally or globally
- **THEN** run fails with `ERROR: stub <name> not found. Checked: skills/<ns>/<skill>/stubs/<name>.md, skills/skill/test-skill/stubs/<name>.md`

### Requirement: global stubs are starter-kit templates
`skills/skill/test-skill/stubs/` SHALL be documented as a starter-kit: templates to copy when creating a new skill's test environment. Global stubs SHALL NOT be treated as canonical source of truth. Local copies MAY diverge from global templates freely.

#### Scenario: diverged local copy is valid
- **WHEN** `skills/dev/tracing/stubs/fresh-repo.md` has different content than `skills/skill/test-skill/stubs/fresh-repo.md`
- **THEN** no error or warning is produced — divergence is expected

#### Scenario: global stub updated independently
- **WHEN** `skills/skill/test-skill/stubs/fresh-repo.md` is modified
- **THEN** skills with local copies of `fresh-repo` are unaffected

### Requirement: existing cases require no changes
The format `stub: <name>` in `cases/*.md` files SHALL remain unchanged. The resolution logic change is transparent to case authors.

#### Scenario: existing case with global stub continues to work
- **WHEN** `skills/sdd/apply/cases/apply.md` references `stub: change-with-sdd-yaml` and no local copy exists
- **THEN** global fallback is used and the case runs without modification
