# Test: sdd:change-verify

## Case: all-tasks-done-passed
stub: change-with-sdd-yaml
contains:
  - "verdict:"
  - "passed"
semantic:
  - verdict_passed: when all tasks are checked and artifacts exist, output contains "verdict: passed"
  - missing_zero: summary indicates "missing: 0" or equivalent zero-gap formulation

## Case: missing-artifact-gaps-found
stub: change-with-sdd-yaml
# Scenario: tasks.md references an artifact path that does not exist in stub.
# Expected: L1 fail → missing verdict.
contains:
  - "gaps_found"
semantic:
  - verdict_gaps: output contains "verdict: gaps_found" for the change
  - missing_path_listed: output names at least one file path that was expected but absent

## Case: human-needed-task
stub: change-with-sdd-yaml
# Scenario: a task requires live skill invocation (e.g. "запустить и убедиться что вывод корректен").
contains:
  - "human_needed"
semantic:
  - human_step_present: output contains "human_needed" with a concrete verification step description
  - not_auto_passed: skill does not silently mark such tasks as "done"
