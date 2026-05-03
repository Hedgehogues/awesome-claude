## ADDED Requirements

### Requirement: .manifest declares all namespace directories via namespaces field
Each namespace `.manifest` file SHALL contain a `namespaces:` field listing all directory paths that belong to the namespace.

#### Scenario: .manifest with namespaces field
- **WHEN** developer reads `.manifest` for namespace `dev`
- **THEN** file contains `namespaces:` list with at least `skills/dev/`
- **THEN** list may include additional paths like `rules/dev/`, `scripts/dev/`

#### Scenario: .manifest without namespaces field is an error
- **WHEN** `bump-namespace.sh` reads a `.manifest` without `namespaces:` field
- **THEN** script exits with an error message describing the missing field

### Requirement: bump-namespace.sh copies all directories listed in namespaces
`bump-namespace.sh` SHALL read the `namespaces:` field from `.manifest` and copy every listed directory to the corresponding path in `.claude/`, not only `skills/<ns>/`.

#### Scenario: Full namespace copy
- **WHEN** `.manifest` declares `namespaces: [skills/dev/, rules/dev/]`
- **THEN** `bump-namespace.sh` copies both `skills/dev/` and `rules/dev/` to `.claude/`
- **THEN** user's `.claude/rules/dev/` is updated alongside `.claude/skills/dev/`

#### Scenario: Only skills declared
- **WHEN** `.manifest` declares only `namespaces: [skills/dev/]`
- **THEN** `bump-namespace.sh` copies only `skills/dev/`
- **THEN** behaviour is equivalent to the previous version
