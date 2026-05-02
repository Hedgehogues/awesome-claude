## ADDED Requirements

### Requirement: scripts/install.sh is removed from the repository
`scripts/install.sh` SHALL be removed entirely from the repository. The repository SHALL NOT contain any shell-based installation script. Installation SHALL be performed exclusively through Claude Code per `rules/claude-way.md`.

#### Scenario: install.sh does not exist
- **WHEN** developer lists files in `scripts/`
- **THEN** `install.sh` is not present
- **THEN** no shell-based installer exists anywhere in the repository

#### Scenario: README contains no install.sh references
- **WHEN** developer reads `README.md`
- **THEN** no mention of `install.sh`, `bash install.sh`, or `curl ... | bash` appears
- **THEN** installation instructions reference Claude Code only

### Requirement: Documentation references Claude Code for installation
All documentation (`README.md`, `docs/`, `.claude/`) SHALL reference Claude Code as the installation mechanism. Any mention of shell-based installation SHALL be removed.

#### Scenario: docs and .claude do not reference install.sh
- **WHEN** developer greps for `install.sh` in `docs/` and `.claude/`
- **THEN** no occurrences are found
- **THEN** installation guidance points to Claude Code skill invocations
