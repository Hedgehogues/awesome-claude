---
git:
  branch: feature-test
  commits:
    - "initial commit"
skills:
  sdd:
    - contradiction
openspec:
  specs:
    - capability: cap-alpha
      description: "First capability"
      path: cap-alpha/spec.md
      test_plan: cap-alpha/test-plan.md
    - capability: cap-beta
      description: "Second capability, depends on cap-alpha"
      path: cap-beta/spec.md
      test_plan: cap-beta/test-plan.md
  spec_contents:
    cap-alpha: |
      ## ADDED Requirements

      ### Requirement: cap-alpha core behavior
      `cap-alpha` SHALL provide the core behavior.

      #### Scenario: Basic usage
      - **WHEN** cap-alpha is invoked
      - **THEN** it returns a result
    cap-beta: |
      ## ADDED Requirements

      ### Requirement: cap-beta uses cap-alpha
      `cap-beta` SHALL invoke `cap-alpha` as a dependency.

      #### Scenario: Dependency invocation
      - **WHEN** cap-beta runs
      - **THEN** cap-alpha is called first
---
