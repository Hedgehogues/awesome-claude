## Purpose
Rename of __dev namespace to skill across skills/, commands/, and .claude/skills/.
## Requirements
### Requirement: __dev namespace is renamed to skill in all three locations
The `__dev` namespace SHALL be renamed to `skill` across: `skills/__dev/` → `skills/skill/`, `commands/__dev/` → `commands/skill/`, `.claude/skills/__dev/` → `.claude/skills/skill/`. All references to `__dev:test-skill` and `__dev:test-all` SHALL be updated to `skill:test-skill` and `skill:test-all`.

#### Scenario: skills directory renamed
- **WHEN** rename is applied
- **THEN** `skills/skill/` exists and `skills/__dev/` does not

#### Scenario: skill invocation uses new name
- **WHEN** user invokes `skill:test-skill`
- **THEN** skill executes (not SKIP due to missing file)
- **THEN** `__dev:test-skill` no longer resolves

### Requirement: install.sh updated for renamed namespace
`scripts/install.sh` SHALL reference `DEV_COMPONENTS="skill"` instead of `DEV_COMPONENTS="__dev"` after the rename.

#### Scenario: install.sh installs renamed namespace
- **WHEN** install.sh runs with dev components
- **THEN** it copies `skills/skill/` not `skills/__dev/`

