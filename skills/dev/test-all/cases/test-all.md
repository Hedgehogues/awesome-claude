# Test: dev:test-all

## Case: fresh-repo-no-tests
stub: fresh-repo
semantic:
  - no_tests: when no test suite is configured, skill reports nothing to run
  - graceful: skill completes without crashing

## Case: with-context
stub: with-openspec
semantic:
  - suite_invoked: skill attempts to run the project test suite (make test or equivalent)
  - results_summarized: output contains a pass/fail summary
