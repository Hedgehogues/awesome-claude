---
git:
  branch: feature-test
  user_email: current@example.com
  commits:
    - "initial commit"
skills:
  sdd:
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
      owner: other@example.com
  test_plan:
    my-feature:
      approach: "Test ownership warning."
      acceptance_criteria:
        - "Identity check warns when current email differs from owner"
      scenarios: "current@example.com tries to edit change owned by other@example.com"
---
