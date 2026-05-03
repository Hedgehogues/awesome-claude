## ADDED Requirements

### Requirement: sdd:contradiction delegates spec collection to Python script
`sdd:contradiction` SHALL invoke `contradiction.py` (at `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`) to collect spec content. The script reads `openspec/specs/index.yaml` and `.sdd.yaml` of the current change, loads the content of relevant specs, and returns a structured package. Claude analyzes the package for contradictions.

#### Scenario: Full scan on invocation
- **WHEN** user runs `sdd:contradiction`
- **THEN** `contradiction.py` is invoked
- **THEN** script reads `openspec/specs/index.yaml` to discover all capabilities
- **THEN** script reads `.sdd.yaml` to determine `creates` and `merges-into` for the current change
- **THEN** script loads `spec.md` content for all relevant capabilities
- **THEN** script outputs a structured package with all spec contents
- **THEN** Claude analyzes the package and reports contradictions

#### Scenario: Script reports missing files
- **WHEN** `contradiction.py` reads `index.yaml` and a referenced `spec.md` does not exist
- **THEN** script includes a warning in the package: "missing file: <path>"
- **THEN** Claude includes the warning in the contradiction report

### Requirement: contradiction.py outputs structured package with PRIMARY labeling
`contradiction.py` SHALL output a structured text package. Capabilities from `.sdd.yaml.creates` ∪ `merges-into` SHALL be labeled as PRIMARY in their section header. Draft specs SHALL be labeled `[PRIMARY/creates DRAFT]`. Background capabilities carry no label.

#### Scenario: Package structure with PRIMARY labels
- **WHEN** `contradiction.py` completes collection
- **THEN** output contains for each capability: capability name, spec.md content, PRIMARY label if applicable
- **THEN** merges-into capabilities carry `[PRIMARY/merges-into]` suffix
- **THEN** creates draft capabilities carry `[PRIMARY/creates DRAFT]` suffix
- **THEN** output contains `--- ADJACENT Capabilities ---` section (listing or `(none)`)
- **THEN** output contains summary with fields: `total_discovered`, `total_loaded`, `draft_specs_loaded`, `primary_capabilities`, `merges_into_missing`, `adjacent_capabilities`, `skipped`

### Requirement: merges-into validation
For each capability in `.sdd.yaml.merges-into`, `contradiction.py` SHALL verify it is present in `index.yaml`. If absent — add to Warnings section with text `merges-into capability '<name>' not found in index.yaml`.

#### Scenario: Missing merges-into capability
- **WHEN** `.sdd.yaml.merges-into` contains a capability absent from `index.yaml`
- **THEN** Warnings section contains `merges-into capability '<name>' not found in index.yaml`
- **THEN** `merges_into_missing` counter in Summary reflects the count

### Requirement: ADJACENT capabilities detection
`contradiction.py` SHALL detect capabilities in `index.yaml` not declared in `creates` ∪ `merges-into` but sharing ≥ 2 non-trivial tokens with the change's declared capabilities. These SHALL be listed in `--- ADJACENT Capabilities ---` section.

#### Scenario: ADJACENT section always present
- **WHEN** `contradiction.py` completes collection
- **THEN** output always contains `--- ADJACENT Capabilities ---` section
- **THEN** if no adjacent capabilities found, section contains `(none)`
- **THEN** `adjacent_capabilities` field in Summary reflects the count

### Requirement: Contradiction report shows full coverage
The contradiction report Claude produces SHALL state how many specs were analyzed and list all contradictions found with the capabilities involved.

#### Scenario: Report shows coverage
- **WHEN** Claude finishes analysis
- **THEN** report header shows: "Analyzed: N capabilities"
- **THEN** each contradiction names the capabilities involved and the conflicting requirements
- **THEN** capabilities skipped due to missing files are listed separately
