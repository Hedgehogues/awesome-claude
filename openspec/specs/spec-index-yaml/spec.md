## ADDED Requirements

### Requirement: openspec/specs/index.yaml is the single registry of all finalized specs
`openspec/specs/index.yaml` SHALL exist as the single machine-readable registry of all capabilities, containing a reference and description for each.

```yaml
specs:
  - capability: user-auth
    description: Authentication and authorization
    path: user-auth/spec.md
    test_plan: user-auth/test-plan.md
  - capability: session-management
    description: Session lifecycle management
    path: session-management/spec.md
    test_plan: session-management/test-plan.md
```

#### Scenario: Developer reads index.yaml
- **WHEN** developer reads `openspec/specs/index.yaml`
- **THEN** every capability under `openspec/specs/` is listed
- **THEN** each entry has: `capability`, `description`, `path`, `test_plan`

#### Scenario: index.yaml references missing file
- **WHEN** Python script reads `index.yaml` and a referenced file does not exist on disk
- **THEN** script reports: "index.yaml references missing file: <path>"

### Requirement: sdd:apply updates openspec/specs/index.yaml
When `sdd:apply` introduces a new capability, it SHALL add an entry to `openspec/specs/index.yaml`.

#### Scenario: apply adds new capability to index
- **WHEN** `sdd:apply` applies a change that creates capability `user-auth`
- **THEN** `openspec/specs/index.yaml` contains an entry for `user-auth`

### Requirement: sdd:archive updates openspec/specs/index.yaml
When `sdd:archive` archives a change, it SHALL update `openspec/specs/index.yaml` to reflect all capabilities introduced or modified by the change.

#### Scenario: archive updates index
- **WHEN** `sdd:archive` archives a change with `creates: [design-diagrams]` in `.sdd.yaml`
- **THEN** `openspec/specs/index.yaml` contains an entry for `design-diagrams` with correct `path` and `test_plan`
