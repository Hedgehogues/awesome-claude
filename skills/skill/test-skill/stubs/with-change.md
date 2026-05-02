---
git:
  branch: feature-with-change
  commits:
    - "initial commit"
skills:
  sdd:
    - propose
    - apply
    - archive
    - contradiction
    - audit
    - explore
    - help
    - sync
    - bump-version
    - repo
manifest:
  version: "0.6.0"
  tools:
    openspec: "0.13.1"
  repos: []
openspec:
  changes:
    - sample-change
  change_files:
    sample-change:
      - proposal.md
      - design.md
      - tasks.md
      - test-plan.md
      - .sdd.yaml
      - .sdd-state.yaml
  sdd_yaml:
    sample-change:
      creates:
        - sample-capability
      merges-into: []
      owner: "test@example.com"
  sdd_state:
    sample-change:
      stage: contradiction-ok
      owner: "test@example.com"
  test_plan:
    sample-change:
      approach: "Run skill:test-skill on the new capability."
      acceptance_criteria:
        - "Stub repo has one active change"
        - "manifest.yaml is present and valid"
      scenarios: "Happy path: skill that requires existing change can find it; skill validates manifest schema."
---
