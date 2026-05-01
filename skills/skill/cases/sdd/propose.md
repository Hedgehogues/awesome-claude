# Test: sdd:propose

## Case: full-structure
stub: change-with-sdd-yaml
contains:
  - ".sdd.yaml"
  - "test-plan.md"
  - "creates:"
  - "merges-into:"
  - "approach:"
  - "acceptance_criteria:"
  - "## Scenarios"
semantic:
  - sdd_yaml: change directory contains .sdd.yaml with creates and merges-into fields
  - test_plan: change directory contains test-plan.md with YAML front matter and ## Scenarios

## Case: missing-sdd-yaml
stub: fresh-repo
contains:
  - ".sdd.yaml"
semantic:
  - sdd_yaml: propose creates .sdd.yaml stub even for minimal change

## Case: missing-sdd-yaml-reference-in-proposal
stub: change-with-sdd-yaml
semantic:
  - reference_check: if proposal.md lacks reference to .sdd.yaml, propose reports
      "proposal.md does not reference .sdd.yaml"

## Case: design-formatter
stub: change-with-sdd-yaml
semantic:
  - design_sections: if design.md is missing any of Technical Approach, Architecture Decisions,
      Data Flow, File Changes — propose reports "design.md is missing section: <name>"
