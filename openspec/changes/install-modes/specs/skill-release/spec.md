## ADDED Requirements

### Requirement: skill:release cuts an awesome-claude release
`/skill:release` SHALL perform all steps to release a new version of awesome-claude: bump the version in `manifest.yaml version:`, create a git commit, and apply a version tag. It is the final step in the contributor workflow.

#### Scenario: Release from clean working tree
- **WHEN** developer invokes `/skill:release` with a clean working tree
- **THEN** version in `manifest.yaml version:` is bumped
- **THEN** a git commit is created with the new version
- **THEN** a version tag is applied to the commit

#### Scenario: Uncommitted changes present
- **WHEN** there are uncommitted changes in the working tree
- **THEN** skill reports the uncommitted changes and stops without making a release
