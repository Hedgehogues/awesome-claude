## ADDED Requirements

### Requirement: sdd:contradiction delegates spec collection to Python script
`sdd:contradiction` SHALL invoke `contradiction.py` (located next to the skill) to collect spec content. The script reads `openspec/specs/index.yaml` and `.sdd.yaml` of the current change, loads the content of relevant specs, and returns a structured package. Claude analyzes the package for contradictions.

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

### Requirement: contradiction.py outputs structured package
`contradiction.py` SHALL output a structured text package that Claude can analyze, containing: list of capabilities scanned, their spec contents, and any warnings.

#### Scenario: Package structure
- **WHEN** `contradiction.py` completes collection
- **THEN** output contains for each capability: capability name, spec.md content
- **THEN** output contains summary: total capabilities discovered, total loaded, any skipped with reason

### Requirement: Contradiction report shows full coverage
The contradiction report Claude produces SHALL state how many specs were analyzed and list all contradictions found with the capabilities involved.

#### Scenario: Report shows coverage
- **WHEN** Claude finishes analysis
- **THEN** report header shows: "Analyzed: N capabilities"
- **THEN** each contradiction names the capabilities involved and the conflicting requirements
- **THEN** capabilities skipped due to missing files are listed separately
