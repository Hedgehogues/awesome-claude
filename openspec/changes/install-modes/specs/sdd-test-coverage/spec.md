## ADDED Requirements

### Requirement: skill/cases/sdd/ contains test specs for all sdd skills
The `skills/skill/cases/sdd/` directory SHALL contain a test-spec file for every skill in the `sdd:` namespace: `apply`, `archive`, `audit`, `bump-version`, `change-verify`, `contradiction`, `explore`, `help`, `propose`, `repo`, `spec-verify`, `sync`. Each file SHALL define at least one `## Case:` with `stub`, `contains`, and `semantic` fields.

#### Scenario: every sdd skill has a test spec
- **WHEN** `skill:test-skill sdd:<name>` is invoked for any sdd skill
- **THEN** `skills/skill/cases/sdd/<name>.md` is found
- **THEN** at least one Case is executed against a materialized stub

#### Scenario: propose test spec exists
- **WHEN** `skill:test-skill sdd:propose` is invoked
- **THEN** `skills/skill/cases/sdd/propose.md` is found
- **THEN** at least one Case is executed against a materialized stub

#### Scenario: apply test spec exists
- **WHEN** `skill:test-skill sdd:apply` is invoked
- **THEN** `skills/skill/cases/sdd/apply.md` is found
- **THEN** at least one Case is executed

#### Scenario: sync test spec exists
- **WHEN** `skill:test-skill sdd:sync` is invoked
- **THEN** `skills/skill/cases/sdd/sync.md` is found
- **THEN** at least one Case is executed

### Requirement: sdd test specs use appropriate stubs
`propose` and `sync` specs SHALL use the `fresh-repo` stub or a stub without active openspec changes. `apply` spec SHALL use a stub that includes at least one entry in `openspec.changes`.

#### Scenario: propose case uses fresh-repo stub
- **WHEN** `sdd:propose` case is materialized
- **THEN** the stub has no `openspec.changes` entries
- **THEN** the case verifies that proposal creation output appears

#### Scenario: apply case uses stub with existing change
- **WHEN** `sdd:apply` case is materialized
- **THEN** the stub contains at least one name in `openspec.changes`
- **THEN** the case verifies that task listing or implementation output appears
