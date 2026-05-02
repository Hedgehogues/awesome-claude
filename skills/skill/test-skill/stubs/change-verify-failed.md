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
      stage: verify-failed
      last_step_at: "2026-05-02T10:00:00Z"
      owner: current@example.com
      verify_result:
        total: 5
        failed: 2
        failed_tasks:
          - "1.3 missing artifact"
          - "2.1 partial implementation"
  tasks:
    my-feature:
      - "[x] 1.1 Implement core function"
      - "[x] 1.2 Write tests"
      - "[ ] 1.3 Add CLI flag (file missing)"
      - "[x] 2.1 Update documentation (empty stub)"
  test_plan:
    my-feature:
      approach: "Test verify-failed state — index.yaml NOT updated."
      acceptance_criteria:
        - "/sdd:apply does NOT update index.yaml when verify-failed"
        - "Workflow stops after verify; user must fix and re-run"
      scenarios: "Verify finds missing/partial artifacts; apply halts."
---
