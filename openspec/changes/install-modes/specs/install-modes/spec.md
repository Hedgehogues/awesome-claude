## ADDED Requirements

### Requirement: Two modes define how Claude sets up awesome-claude
awesome-claude operates in two modes. The mode determines what Claude does when invoked — not what the user runs manually. There are no public CLI commands for setup; Claude handles everything.

#### Scenario: User mode — Claude sets up awesome-claude in a project
- **WHEN** user asks Claude to set up awesome-claude in their project
- **THEN** Claude clones the awesome-claude repo to a temp directory
- **THEN** Claude copies the selected namespaces to `.claude/`
- **THEN** Claude removes the temp directory
- **THEN** no `install.sh` or manual bash command is required from the user

#### Scenario: Dev mode — Claude sets up awesome-claude repo for development
- **WHEN** user asks Claude to work on the awesome-claude repo itself
- **THEN** Claude runs `skill:setup` to create symlinks
- **THEN** no `make dev` or manual bash command is required from the user

### Requirement: install.sh is removed
`scripts/install.sh` SHALL be deleted. Its logic (git clone + cp) is performed directly by Claude when needed. No curl-pipe-bash bootstrap is documented or supported.

#### Scenario: No install.sh in repo
- **WHEN** developer looks for `scripts/install.sh`
- **THEN** the file does not exist
- **THEN** README contains no `curl | bash` commands
