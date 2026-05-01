---
git:
  branch: feature-test
  commits:
    - "initial commit"
skills:
  sdd:
    - propose
    - apply
    - archive
    - contradiction
openspec:
  changes:
    - my-feature
  change_files:
    my-feature:
      - proposal.md
      - design.md
      - tasks.md
      - test-plan.md
      - .sdd.yaml
  sdd_yaml:
    my-feature:
      creates:
        - my-capability
      merges-into: []
  test_plan:
    my-feature:
      approach: "Unit tests for the new capability."
      acceptance_criteria:
        - "Capability is created successfully"
        - "Index is updated"
      scenarios: "Happy path: create capability, verify index entry."
---
