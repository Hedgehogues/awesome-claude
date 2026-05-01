## ADDED Requirements

### Requirement: dev:install skill installs awesome-claude components
The system SHALL provide a `dev:install` skill that installs awesome-claude components from GitHub into `.claude/`. The skill SHALL accept the same component and flag arguments as the removed `install.sh`.

#### Scenario: Full install
- **WHEN** user asks Claude to install awesome-claude without specifying components
- **THEN** Claude invokes `dev:install`
- **THEN** all components (dev, report, research, sdd, rules) are installed into `.claude/`

#### Scenario: Selective install
- **WHEN** user asks Claude to install specific components (e.g., "install sdd and dev")
- **THEN** Claude invokes `dev:install sdd dev`
- **THEN** only the specified components are installed

#### Scenario: Dev mode install
- **WHEN** user asks Claude to install with dev skills
- **THEN** Claude invokes `dev:install --dev`
- **THEN** all components plus `skill:` namespace are installed

### Requirement: scripts/ directory is removed
The top-level `scripts/` directory SHALL NOT exist in the repository. No bash installer SHALL be distributed or referenced in user-facing documentation.

#### Scenario: scripts/ absent from repo
- **WHEN** developer checks out the repository
- **THEN** no `scripts/` directory exists at the root
- **THEN** no `install.sh` file exists anywhere in the repository

#### Scenario: README contains no curl install command
- **WHEN** user reads the README
- **THEN** no `curl … | bash` command appears
- **THEN** Quick Start instructs user to ask Claude to install
