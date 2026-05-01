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

## Case: design-formatter-openspec-sections
stub: change-with-sdd-yaml
semantic:
  - design_sections: if design.md is missing any of Context, Goals / Non-Goals,
      Decisions, Risks / Trade-offs (per openspec template) — propose invokes
      check-design.py and reports "design.md is missing section: <name>"; propose blocks until fix
