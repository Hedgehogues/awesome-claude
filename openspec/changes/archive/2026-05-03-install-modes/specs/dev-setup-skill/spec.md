## ADDED Requirements

### Requirement: skill:setup creates symlinks for dev mode directly
`/skill:setup` SHALL create symlinks from repo source directories to `.claude/` using bash commands directly, without delegating to an external script.

#### Scenario: Fresh dev setup
- **WHEN** Claude invokes `/skill:setup` in the repo root
- **THEN** `.claude/skills` becomes a symlink to `$(pwd)/skills`
- **THEN** `.claude/commands` becomes a symlink to `$(pwd)/commands`
- **THEN** `.claude/rules` becomes a symlink to `$(pwd)/rules`
- **THEN** skill reports which symlinks were created

#### Scenario: Already linked
- **WHEN** symlinks already point to repo source directories
- **THEN** skill reports "Already linked" and exits without changes

#### Scenario: Existing real directory
- **WHEN** `.claude/skills/` exists as a real directory (not a symlink)
- **THEN** skill prints a warning listing what will be replaced
- **THEN** skill asks for confirmation before replacing
