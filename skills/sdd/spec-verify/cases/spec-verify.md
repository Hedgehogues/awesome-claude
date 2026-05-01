# Test: sdd:spec-verify

## Case: specs-with-index
stub: specs-with-index
semantic:
  - specs_loaded: skill reads cap-alpha and cap-beta specs from openspec/specs/
  - verification_runs: output contains a verification report with per-capability findings
  - index_consulted: skill uses openspec/specs/index.yaml to discover capabilities

## Case: fresh-repo-no-specs
stub: fresh-repo
semantic:
  - graceful_empty: when no specs exist, skill reports empty state without error
  - no_false_positives: skill does not invent capabilities to verify
