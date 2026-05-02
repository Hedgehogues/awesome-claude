---
git:
  branch: feature-test
  user_email: current@example.com
  commits:
    - "initial commit"
skills:
  sdd:
    - propose
openspec:
  specs:
    - capability: existing-cap
      description: "Pre-existing live capability."
      path: existing-cap/spec.md
      test_plan: existing-cap/test-plan.md
  spec_contents:
    existing-cap: |
      ## ADDED Requirements

      ### Requirement: existing capability provides feature
      `existing-cap` SHALL provide the existing feature.

      #### Scenario: Basic invocation
      - **WHEN** existing-cap is called
      - **THEN** it returns success
  changes:
    - new-feature
  change_files:
    new-feature:
      - proposal.md
      - design.md
      - tasks.md
      - test-plan.md
      - .sdd.yaml
  sdd_yaml:
    new-feature:
      creates:
        - existing-cap
        - new-cap
      merges-into: []
      owner: current@example.com
  test_plan:
    new-feature:
      approach: "Test merge-dialog when creates collides with index.yaml."
      acceptance_criteria:
        - "/sdd:propose detects existing-cap is already in index.yaml"
        - "AskUserQuestion is invoked for existing-cap"
        - "If user picks merges-into, .sdd.yaml moves existing-cap from creates to merges-into"
        - "new-cap stays in creates (no collision)"
      scenarios: "Author picks `existing-cap` name unaware it already exists in live specs."
---
