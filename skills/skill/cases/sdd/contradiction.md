# Test: sdd:contradiction

## Case: cross-spec-no-conflict
stub: specs-with-index
contains:
  - "Analyzed:"
  - "cap-alpha"
  - "cap-beta"
semantic:
  - coverage: report header shows "Analyzed: 2 capabilities"
  - no_errors: hard issues section shows "(none)" — the two specs are consistent

## Case: cross-spec-with-contradiction
stub: specs-with-index
# Scenario: cap-beta says cap-alpha SHALL be called; another spec says it SHALL NOT be called.
# Expected: deontic error is detected and reported.
semantic:
  - deontic_conflict: if cap-alpha has conflicting SHALL / SHALL NOT across caps,
      report shows [error] deontic for the conflicting subject

## Case: index-missing
stub: fresh-repo
contains:
  - "index.yaml not found"
semantic:
  - graceful_missing: when openspec/specs/index.yaml does not exist,
      contradiction outputs "Analyzed: 0 capabilities from index" and proceeds with local analysis only
