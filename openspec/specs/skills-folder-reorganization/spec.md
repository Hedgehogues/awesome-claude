## Purpose
Hierarchical skills structure: each skill in its own subdirectory with colocated scripts and cases.
## Requirements
### Requirement: Each skill is self-contained in its folder
Every skill SHALL be located in `skills/<namespace>/<skill>/skill.md` with:
- `skill.md` — the skill itself
- `scripts/` — if skill has helper scripts (optional)
- `cases/` — if skill has test cases (optional)

#### Scenario: Finding a skill's resources
- **WHEN** developer needs to locate skill `dev:tdd`
- **THEN** all artifacts live in `skills/dev/tdd/`
- **THEN** related scripts are in `skills/dev/tdd/scripts/`
- **THEN** test cases are in `skills/dev/tdd/cases/`

### Requirement: Scripts are colocated with skills
Script files SHALL live in the same folder hierarchy as the skill that uses them, not in a top-level `scripts/` directory.

#### Scenario: Adding a script to a skill
- **WHEN** skill `sdd:apply` needs a new helper script
- **THEN** script goes in `skills/sdd/apply/scripts/` 
- **THEN** not in `skills/sdd/scripts/` or `skills/scripts/`

### Requirement: Folder structure is consistent across all namespaces
All 4 namespaces (dev, sdd, report, research) SHALL use the same hierarchy: `skills/<ns>/<skill>/`.

#### Scenario: Adding a new skill to report namespace
- **WHEN** creating `/report:new-skill`
- **THEN** location is `skills/report/new-skill/skill.md`
- **THEN** same pattern as dev, sdd, research

---

