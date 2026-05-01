## ADDED Requirements

### Requirement: Dev mode setup via symlinks
`skill:setup` SHALL create symlinks from repo source directories to `.claude/` so that edits in `skills/`, `commands/`, and `rules/` are immediately visible to Claude Code without manual copying. The idempotency contract for `skill:setup` lives in `specs/dev-setup-skill/spec.md`.

#### Scenario: Edit propagates immediately
- **WHEN** developer edits any file under `skills/`
- **THEN** Claude Code sees the change without any additional commands

### Requirement: Dev mode bootstrap when skill:setup is not yet available
On first use in a freshly cloned repo, `skill:setup` is not yet accessible via Claude Code (symlinks don't exist yet). Claude SHALL read `skills/skill/setup.md` directly and execute it as a one-time bootstrap.

#### Scenario: First-time bootstrap in cloned repo
- **WHEN** Claude is invoked in the awesome-claude repo and `.claude/skills` is not a symlink
- **THEN** Claude reads `skills/skill/setup.md` directly from the repo
- **THEN** Claude creates symlinks as specified in the skill
- **THEN** subsequent invocations use `skill:setup` normally via `.claude/`
