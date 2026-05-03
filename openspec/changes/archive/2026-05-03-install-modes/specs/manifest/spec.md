## ADDED Requirements

### Requirement: manifest.yaml is the single source of truth for repo dependencies
The repository SHALL contain `manifest.yaml` in the root with three sections: `version:` (repo version), `tools:` (CLI tool versions), `repos:` (submodules managed by `sdd:repo`).

#### Scenario: manifest.yaml contains openspec version
- **WHEN** developer checks the openspec version
- **THEN** the version is found at `manifest.yaml tools.openspec`

#### Scenario: sdd: skills read version from manifest.yaml
- **WHEN** any `sdd:` skill reads the openspec version
- **THEN** it reads from `manifest.yaml tools.openspec`

#### Scenario: repos section is managed by sdd:repo
- **WHEN** `sdd:repo` adds or removes a submodule entry
- **THEN** the change is written to `manifest.yaml repos:`
- **THEN** no separate submodule manifest file is used

### Requirement: manifest.yaml schema is stable and versioned
`manifest.yaml` SHALL follow a fixed schema with required top-level keys: `version`, `tools`, `repos`. Any tool or submodule entry added outside these keys is invalid.

#### Scenario: manifest.yaml has all required top-level keys
- **WHEN** `skill:deps` reads `manifest.yaml`
- **THEN** keys `version`, `tools`, and `repos` are all present
- **THEN** missing keys cause skill:deps to report an error and stop
