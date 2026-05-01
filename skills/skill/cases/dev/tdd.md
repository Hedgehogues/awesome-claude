# Test: dev:tdd

## Case: no-feature-description
stub: fresh-repo
semantic:
  - prompt_for_feature: skill asks for the feature/behavior to implement via TDD
  - red_first: skill emphasizes writing a failing test before any implementation

## Case: with-context
stub: with-openspec
semantic:
  - tdd_cycle: output describes red→green→refactor cycle
  - test_first: skill creates or proposes a failing test before production code
