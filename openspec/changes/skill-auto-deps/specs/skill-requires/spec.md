## ADDED Requirements

### Requirement: Skill declares dependencies on other skills in frontmatter
A skill file SHALL declare dependencies on other skills via a `requires:` field in YAML frontmatter. Each entry MUST include `skill` (name) and `namespace` fields.

#### Scenario: Skill with skill dependency
- **WHEN** a skill file contains a `skill:` entry in `requires:`
- **THEN** both `skill` and `namespace` fields are present

#### Scenario: Skill without requires field
- **WHEN** a skill file has no `requires:` field
- **THEN** skill behaves identically to current behavior

### Requirement: Claude resolves skill dependencies before skill logic
When invoked, Claude SHALL check that each `requires:` entry exists as `.claude/skills/<namespace>/<skill>.md`. If missing, Claude SHALL install it via skill `<namespace>:bump-version` before proceeding.

#### Scenario: Skill dependency present
- **WHEN** `.claude/skills/<namespace>/<skill>.md` exists
- **THEN** Claude proceeds to skill logic without installing

#### Scenario: Skill dependency missing — install succeeds
- **WHEN** skill file is absent
- **THEN** Claude reports "Installing <namespace>:<skill>..."
- **THEN** Claude invokes skill `<namespace>:bump-version` via Skill tool
- **THEN** Claude verifies the file now exists and proceeds to skill logic

#### Scenario: Skill dependency missing — bump-version skill unavailable
- **WHEN** `<namespace>:bump-version` skill is not found
- **THEN** Claude stops and reports: "Missing skill <skill>. Install manually: bash scripts/install.sh <namespace>"
- **THEN** skill logic does NOT execute

### Requirement: All skills with inter-skill dependencies declare them via requires
Every skill that invokes another skill via the Skill tool SHALL declare that skill in `requires:`.

#### Scenario: dev:fix-bug declares dev:tracing and dev:tdd
- **WHEN** developer reads `skills/dev/fix-bug.md`
- **THEN** frontmatter contains `requires:` with entries for `dev:tracing` and `dev:tdd`

#### Scenario: sdd:propose declares openspec-propose
- **WHEN** developer reads `skills/sdd/propose.md`
- **THEN** frontmatter contains `requires:` with entry for `openspec-propose`

#### Scenario: New skill invoking another skill is added
- **WHEN** a contributor adds a skill that calls another skill via Skill tool
- **THEN** the called skill MUST be declared in `requires:` before merging

### Requirement: SKILL_DESIGN.md documents requires field
`docs/SKILL_DESIGN.md` SHALL document the `requires:` frontmatter field with syntax reference and example.

#### Scenario: Developer reads SKILL_DESIGN.md
- **WHEN** developer reads the Frontmatter Reference section
- **THEN** `requires:` appears in the reference table with description
- **THEN** an example with `skill:` and `namespace:` fields is shown
