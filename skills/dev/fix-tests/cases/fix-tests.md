# Test: dev:fix-tests

## Case: no-failing-tests
stub: fresh-repo
semantic:
  - all_green: when no tests are failing, skill reports "all tests pass" or equivalent
  - no_modifications: skill does not modify code when tests already pass

## Case: with-test-context
stub: with-openspec
semantic:
  - test_run: skill runs the test suite first to identify failures
  - root_cause: output identifies failing tests before suggesting fixes
