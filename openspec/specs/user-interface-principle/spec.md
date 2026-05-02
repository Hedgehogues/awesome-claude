## ADDED Requirements

### Requirement: Claude Code skills are the only user-facing interface
Awesome-claude follows the Claude-way principle: after initial bootstrap, users SHALL interact exclusively through Claude Code. Any direct system call (bash, curl, or otherwise) is NOT part of the public interface — for any operation, not just namespace updates.

#### Scenario: User wants to perform any awesome-claude operation
- **WHEN** user wants to perform any operation (update namespace, init project, etc.)
- **THEN** user invokes a Claude Code skill
- **THEN** no direct system call is required or documented

#### Scenario: README contains no direct system calls outside bootstrap
- **WHEN** user reads the README
- **THEN** no direct system calls appear outside the bootstrap section
- **THEN** every operation has a corresponding skill invocation shown instead

### Requirement: Installation is performed through Claude Code
awesome-claude SHALL be installed by asking Claude Code to clone and copy files from the repository. User-facing documentation SHALL NOT contain curl or bash commands for installation.

#### Scenario: First-time installation
- **WHEN** user installs awesome-claude for the first time
- **THEN** they open Claude Code and ask Claude to install awesome-claude from GitHub
- **THEN** no curl or bash command is shown in the Quick Start or Usage sections

#### Scenario: README contains no curl install command
- **WHEN** user reads the README
- **THEN** no `curl ... | bash` command appears in the document
- **THEN** installation instructions reference Claude Code only

### Requirement: claude-way rule is installed with awesome-claude
The repository SHALL contain `rules/claude-way.md` documenting the Claude-way principle. It SHALL be installed into `.claude/rules/` alongside other rules and loaded automatically by Claude Code.

#### Scenario: User installs awesome-claude with rules component
- **WHEN** user installs awesome-claude including the `rules` component
- **THEN** `rules/claude-way.md` is present in `.claude/rules/`
- **THEN** Claude Code loads the rule automatically in every session

### Requirement: A sequence of skill steps defines a bounded context
A sequence of Claude Code skill invocations IS the bounded context — it defines its boundary. Each skill SHALL correspond to exactly one step within that sequence. The number of steps SHALL be small: 1–2 preferred, 3 is the maximum. An artifact lives within its step and does not carry over to the next as a shared object. The next step receives the outputs of one or more previous steps as its own input artifacts. The canonical sequence shape is two stages, analogous to ETL: step 1 produces a raw artifact, step 2 transforms it into the final artifact.

#### Scenario: Skill stays within one bounded context
- **WHEN** a skill is invoked
- **THEN** all operations it performs belong to a single bounded context

#### Scenario: Artifact scope is limited to its step
- **WHEN** a skill completes its step
- **THEN** the artifact produced by that step is not mutated by subsequent steps
- **THEN** the next step receives the outputs of one or more prior steps as its own input artifacts

#### Scenario: Canonical two-stage sequence
- **WHEN** a user performs a two-step operation using skills
- **THEN** the first step produces a raw artifact
- **THEN** the second step transforms that raw artifact into a processed artifact

#### Scenario: Multi-step sequence is minimal
- **WHEN** a user performs a multi-step operation using skills
- **THEN** the total number of steps in the sequence does not exceed 3
- **THEN** a sequence exceeding 3 steps is a signal to decompose the skill or revise bounded context boundaries

### Requirement: Each artifact declares its scope and lifetime
Every artifact created or modified by a Claude Code skill SHALL declare: (1) its scope — what it covers and what it explicitly does not cover; (2) its lifetime — ephemeral (single invocation), session (duration of a Claude Code session), or persistent (written to disk, survives the session).

#### Scenario: Artifact has explicit scope boundary
- **WHEN** a skill creates or modifies an artifact
- **THEN** the artifact's header or documentation declares what bounded context it belongs to
- **THEN** the artifact does not modify state outside that bounded context in the same step

#### Scenario: Artifact lifetime is declared
- **WHEN** a skill produces an artifact
- **THEN** the artifact's type (ephemeral / session / persistent) is stated in `rules/claude-way.md` or in the skill's own documentation

### Requirement: Structured data is accessed through Python scripts
Any read or write access to data with a schema or repeating structure SHALL be performed through a Python script, not natively. In-scope formats: YAML, JSON, TOML, INI, CSV, databases, `.versions`, `.manifest`. Out-of-scope: Markdown, source code, free-text configs without a schema. The script's lifetime SHALL match the lifetime of the transformation: ephemeral for one-off operations, persistent for recurring ones.

#### Scenario: Claude reads structured data
- **WHEN** a skill requires reading data from YAML, JSON, a database, or similar structured source
- **THEN** Claude writes and executes a Python script to perform the read
- **THEN** Claude does not open and parse the file directly in its reasoning

#### Scenario: Claude writes structured data
- **WHEN** a skill requires modifying YAML, JSON, a database, or similar structured source
- **THEN** Claude writes a Python script to perform the mutation
- **THEN** the script is reviewed before execution
- **THEN** the script's lifetime is declared (ephemeral or persistent)

### Requirement: Scripts that serve a single skill live alongside that skill
Scripts used exclusively by one skill SHALL reside in `skills/<ns>/scripts/` next to the skill file, not in the top-level `scripts/` directory. `scripts/` SHALL contain only `install.sh`.

#### Scenario: bump-namespace.sh location after migration
- **WHEN** developer looks for the bump script for the `dev` namespace
- **THEN** it is found at `skills/dev/scripts/bump-namespace.sh`
- **THEN** it is NOT present at `scripts/bump-namespace.sh`

#### Scenario: bump-version skill references local script
- **WHEN** `skills/dev/bump-version.md` is executed
- **THEN** it calls `${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh`
- **THEN** no hardcoded absolute path is used
