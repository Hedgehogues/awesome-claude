## ADDED Requirements

### Requirement: skill:deps installs all dependencies declared in manifest.yaml
`/skill:deps` SHALL read `manifest.yaml`, install each tool listed in `tools:`, and invoke `sdd:sync` if `repos:` is non-empty. It is the single orchestration point for setting up everything needed before development work begins.

#### Scenario: Fresh environment — all deps installed
- **WHEN** developer invokes `/skill:deps` in a freshly cloned repo
- **THEN** each tool in `manifest.yaml tools:` is installed or verified
- **THEN** if `repos:` is non-empty, `sdd:sync` is invoked
- **THEN** skill reports the result for each dependency

#### Scenario: Dependencies already satisfied
- **WHEN** all tools are already at the required versions and repos are initialised
- **THEN** skill reports "already up to date" for each item
- **THEN** skill exits without making changes

#### Scenario: Partial state — some tools missing
- **WHEN** some tools are installed and some are not
- **THEN** skill installs only the missing tools
- **THEN** skill does not reinstall already-satisfied dependencies

### Requirement: skill:deps does not modify manifest.yaml
`/skill:deps` SHALL only read `manifest.yaml` — it SHALL NOT write to it. Adding or removing dependencies is done by editing `manifest.yaml` directly or via `sdd:repo` for the `repos:` section.

#### Scenario: skill:deps run leaves manifest.yaml unchanged
- **WHEN** `/skill:deps` completes successfully
- **THEN** `manifest.yaml` content is identical to before the invocation
