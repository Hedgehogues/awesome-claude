## MODIFIED Requirements

### Requirement: Scripts that serve a single skill live alongside that skill
Scripts used exclusively by one skill SHALL reside in `skills/<ns>/scripts/` next to the skill file. The top-level `scripts/` directory SHALL NOT exist — there is no bootstrap exception.

#### Scenario: bump-namespace.sh location after migration
- **WHEN** developer looks for the bump script for the `dev` namespace
- **THEN** it is found at `skills/dev/scripts/bump-namespace.sh`
- **THEN** it is NOT present at `scripts/bump-namespace.sh`

#### Scenario: bump-version skill references local script
- **WHEN** `skills/dev/bump-version.md` is executed
- **THEN** it calls `${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh`
- **THEN** no hardcoded absolute path is used

#### Scenario: No top-level scripts/ directory
- **WHEN** developer checks out the repository
- **THEN** no `scripts/` directory exists at the root level
