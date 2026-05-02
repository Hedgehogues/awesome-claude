## MODIFIED Requirements

### Requirement: Scripts that serve a single skill live alongside that skill
Scripts used exclusively by one skill SHALL reside in `skills/<ns>/<skill>/scripts/` next to the skill file. The top-level `scripts/` directory SHALL NOT exist — `scripts/install.sh` is removed by the install-modes change (see `specs/install-modes/spec.md` → Requirement: install.sh is removed); installation is performed by Claude directly via git clone + cp without any bootstrap script.

#### Scenario: bump-namespace.sh location after migration
- **WHEN** developer looks for the bump script for the `dev` namespace
- **THEN** it is found at `skills/dev/bump-version/scripts/bump-namespace.sh` (or analogous path next to the skill that uses it)
- **THEN** it is NOT present at `scripts/bump-namespace.sh`

#### Scenario: bump-version skill references local script
- **WHEN** a `bump-version` skill is executed
- **THEN** it calls `${CLAUDE_SKILL_DIR}/scripts/<script>.sh`
- **THEN** no hardcoded absolute path is used

#### Scenario: No top-level scripts/ directory
- **WHEN** developer checks out the repository after install-modes is applied
- **THEN** no `scripts/` directory exists at the root level
- **THEN** in particular, no `scripts/install.sh` is present
