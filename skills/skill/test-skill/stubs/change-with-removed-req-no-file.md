---
git:
  branch: feature-test
  user_email: current@example.com
  commits:
    - "initial commit"
    - "remove deprecated module"
skills:
  sdd:
    - archive
openspec:
  changes:
    - cleanup-feature
  change_files:
    cleanup-feature:
      - proposal.md
      - design.md
      - tasks.md
      - test-plan.md
      - .sdd.yaml
      - specs/old-cap/spec.md
  sdd_yaml:
    cleanup-feature:
      creates: []
      merges-into:
        - old-cap
      owner: current@example.com
  spec_contents:
    old-cap: |
      ## REMOVED Requirements

      ### Requirement: legacy module is present
      **Reason**: Replaced by new architecture.
      **Migration**: All callers updated to use new-module instead.

      The file `skills/sdd/legacy/skill.md` SHALL be removed.
  filesystem:
    absent:
      - skills/sdd/legacy/skill.md
  test_plan:
    cleanup-feature:
      approach: "Test REMOVED-инверсия: file absent → L1 inverted pass."
      acceptance_criteria:
        - "Verify verdict for REMOVED Requirement is `done` when file absent"
      scenarios: "Cleanup change removes legacy module; archive verifies absence."
---
