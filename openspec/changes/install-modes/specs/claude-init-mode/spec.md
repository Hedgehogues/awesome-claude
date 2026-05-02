## ADDED Requirements

### Requirement: README contains an Init section with mode-selection instructions for Claude
The `README.md` SHALL contain a `## Init` section that instructs Claude to detect the current directory context, suggest a mode, describe both modes in 1-2 sentences each, and ask the user to confirm before proceeding.

#### Scenario: Claude opens the awesome-claude repo itself
- **WHEN** Claude is invoked in a directory containing `skills/`, `commands/`, and `manifest.yaml`
- **THEN** Claude identifies this as the awesome-claude repo
- **THEN** Claude suggests dev mode as the default with a 1-2 sentence description
- **THEN** Claude describes user mode in 1-2 sentences
- **THEN** Claude asks the user to confirm

#### Scenario: Claude opens a project without awesome-claude
- **WHEN** Claude is invoked in a directory that has no `.claude/skills/`
- **THEN** Claude suggests user mode as the default
- **THEN** Claude describes both modes and asks the user to confirm

### Requirement: Claude handles setup for the confirmed mode without manual commands
After the user confirms a mode, Claude SHALL perform all setup steps directly — no curl, no make, no manual bash required from the user.

#### Scenario: User confirms dev mode
- **WHEN** user confirms dev mode
- **THEN** Claude checks if symlinks exist
- **THEN** if not — Claude reads `skills/skill/setup/skill.md` directly and executes the symlink bash commands from it
- **THEN** if already linked — Claude confirms and proceeds

#### Scenario: User confirms user mode
- **WHEN** user confirms user mode
- **THEN** Claude asks which namespaces to install (or installs all by default)
- **THEN** Claude clones the awesome-claude repo to a temp directory
- **THEN** Claude copies selected namespaces to `.claude/` and removes the temp directory

### Requirement: Both modes are described in 1-2 sentences each
The Init section SHALL include a concise description of each mode.

#### Scenario: Descriptions are present
- **WHEN** user reads the `## Init` section
- **THEN** dev mode is described: editing skills in this repo, changes visible to Claude Code immediately
- **THEN** user mode is described: using awesome-claude skills in your own project
