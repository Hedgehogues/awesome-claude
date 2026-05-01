## ADDED Requirements

### Requirement: Namespace as self-contained package

A namespace SHALL be organized as a single top-level directory in the repository containing all its artifacts: `skills/`, `commands/`, `rules/`, `docs/`. Each subdirectory MUST contain only artifacts belonging to this namespace.

#### Scenario: Standard namespace layout
- **WHEN** a contributor adds a new namespace `foo` to the repository
- **THEN** the directory structure is `foo/skills/`, `foo/commands/`, `foo/rules/`, `foo/docs/`
- **AND** no namespace-specific artifacts exist outside the `foo/` directory

#### Scenario: Empty subdirectory is omitted
- **WHEN** a namespace has no rules or no docs
- **THEN** the corresponding subdirectory MAY be omitted (`foo/rules/` or `foo/docs/` is not required to exist)

### Requirement: Deterministic install mapping

The installer SHALL deploy a namespace to `.claude/` by mapping each subdirectory of `<namespace>/` to the corresponding artifact-type directory under `.claude/`.

#### Scenario: Namespace install mapping
- **WHEN** the installer installs namespace `dev`
- **THEN** `dev/skills/` is copied to `.claude/skills/dev/`
- **AND** `dev/commands/` is copied to `.claude/commands/dev/`
- **AND** `dev/rules/` is copied to `.claude/rules/dev/`
- **AND** `dev/docs/` is copied to `.claude/docs/dev/`

#### Scenario: Idempotent reinstall
- **WHEN** the installer runs for an already-installed namespace
- **THEN** existing artifacts under `.claude/skills/<ns>/` are removed before copying new ones
- **AND** no stale files remain from the previous version

### Requirement: Shared namespace for cross-cutting artifacts

The repository SHALL provide a `shared/` namespace for artifacts used by two or more namespaces or considered universal. The installer MUST install `shared/` automatically with any namespace install.

#### Scenario: Shared installed automatically
- **WHEN** the installer installs namespace `dev` and `shared/` exists
- **THEN** `shared/rules/` is copied to `.claude/rules/shared/`
- **AND** `shared/docs/` is copied to `.claude/docs/shared/`
- **AND** the user does not need to request `shared` explicitly

#### Scenario: Shared admission criterion
- **WHEN** a contributor proposes adding a rule to `shared/`
- **THEN** the rule MUST be used by at least two namespaces or be universally applicable
- **AND** otherwise the rule SHALL be duplicated in each consuming namespace's `rules/` directory

### Requirement: Self-describing structure for autonomous install

A Claude agent SHALL be able to install any namespace by inspecting the directory structure alone, without prior knowledge of installer scripts or configuration files.

#### Scenario: Claude installs namespace from cloned repository
- **WHEN** Claude has cloned a repository to `/tmp/<repo>/` and needs to install namespace `dev`
- **THEN** Claude reads the `dev/` directory listing
- **AND** copies each subdirectory to `.claude/<subdir-name>/dev/` following the deterministic mapping
- **AND** does not require running `install.sh` or reading any manifest file
