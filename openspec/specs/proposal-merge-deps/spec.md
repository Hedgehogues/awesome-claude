## ADDED Requirements

### Requirement: Change directory contains .sdd.yaml
Every new change created after implementing this capability SHALL include a `.sdd.yaml` file declaring which capabilities it creates and which existing capabilities it merges into. `sdd:propose` creates the file automatically. Existing changes without `.sdd.yaml` continue to work.

```yaml
creates:
  - capability-name
merges-into:
  - other-capability
```

#### Scenario: New change is created
- **WHEN** author creates a new change via `sdd:propose`
- **THEN** `openspec/changes/<name>/.sdd.yaml` exists with `creates` and `merges-into` fields

#### Scenario: Change introduces only new capabilities
- **WHEN** a change adds entirely new capabilities with no cross-spec impact
- **THEN** `.sdd.yaml` has `creates` list and `merges-into: []`

#### Scenario: Change modifies existing capabilities
- **WHEN** a change modifies existing capabilities
- **THEN** `.sdd.yaml` `merges-into` lists all affected capability names

### Requirement: proposal.md references .sdd.yaml
`proposal.md` SHALL contain a reference to `.sdd.yaml` so readers know where to find the machine-readable capability declarations.

#### Scenario: proposal.md has .sdd.yaml reference
- **WHEN** developer reads `proposal.md`
- **THEN** a reference to `.sdd.yaml` is present (e.g. "See `.sdd.yaml` for capability declarations")

### Requirement: sdd:contradiction reads .sdd.yaml
`sdd:contradiction` SHALL read `.sdd.yaml` of the current change to determine which capabilities to include in contradiction analysis.

#### Scenario: contradiction uses .sdd.yaml to scope analysis
- **WHEN** `sdd:contradiction` runs for a change
- **THEN** Python script reads `.sdd.yaml` fields `creates` and `merges-into`
- **THEN** specs of all listed capabilities are included in the analysis package
