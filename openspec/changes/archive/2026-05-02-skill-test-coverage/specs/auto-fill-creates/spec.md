## ADDED Requirements

### Requirement: sdd:propose fills creates: from New Capabilities
After generating `proposal.md`, `sdd:propose` SHALL read the `### New Capabilities` section and populate the `creates:` field in `.sdd.yaml` with the capability names, replacing the empty `creates: []` stub.

#### Scenario: New Capabilities section present
- **WHEN** `sdd:propose` generates a change with `### New Capabilities` listing `foo-cap` and `bar-cap`
- **THEN** `.sdd.yaml` contains `creates: [foo-cap, bar-cap]`
- **THEN** no manual editing of `.sdd.yaml` is required

#### Scenario: New Capabilities section absent or empty
- **WHEN** `sdd:propose` generates a change with no `### New Capabilities` entries
- **THEN** `.sdd.yaml` contains `creates: []`
- **THEN** skill completes without error
