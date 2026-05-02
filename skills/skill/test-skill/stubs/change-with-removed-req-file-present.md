---
git:
  branch: feature-test
  user_email: current@example.com
  commits:
    - "initial commit"
skills:
  sdd:
    - archive
openspec:
  changes:
    - incomplete-cleanup
  change_files:
    incomplete-cleanup:
      - proposal.md
      - design.md
      - tasks.md
      - test-plan.md
      - .sdd.yaml
      - specs/old-cap/spec.md
  sdd_yaml:
    incomplete-cleanup:
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
    present:
      - skills/sdd/legacy/skill.md
  test_plan:
    incomplete-cleanup:
      approach: "Test REMOVED-инверсия: file present → L1 inverted fail (verdict missing)."
      acceptance_criteria:
        - "Verify verdict for REMOVED Requirement is `missing` when file still exists"
        - "Note 'removal not performed' is included"
      scenarios: "Cleanup change forgot to delete legacy file; archive flags it."
---
