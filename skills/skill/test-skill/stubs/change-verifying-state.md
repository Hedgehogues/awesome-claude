---
git:
  branch: feature-test
  user_email: current@example.com
  commits:
    - "initial commit"
skills:
  sdd:
    - apply
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
      - .sdd-state.yaml
  sdd_yaml:
    my-feature:
      creates:
        - my-capability
      merges-into: []
      owner: current@example.com
  sdd_state:
    my-feature:
      stage: verifying
      last_step_at: "2026-05-02T10:00:00Z"
      owner: current@example.com
  tasks:
    my-feature:
      - "[x] 1.1 Implement core function"
      - "[x] 1.2 Write tests"
      - "[ ] 2.1 Update documentation"
  test_plan:
    my-feature:
      approach: "Test resume from verifying state."
      acceptance_criteria:
        - "/sdd:apply resumes from verify step, does not re-implement done tasks"
      scenarios: "Session interrupted mid-verify; user re-runs /sdd:apply."
---
