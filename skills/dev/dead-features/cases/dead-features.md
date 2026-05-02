# Test: dev:dead-features

## Case: empty-repo
stub: fresh-repo
semantic:
  - no_features: skill reports no dead features when codebase is empty
  - graceful: skill completes without error

## Case: with-openspec
stub: with-openspec
semantic:
  - scan_runs: skill scans the project for unused/dead features
  - report_format: output contains a structured list (or "(none)") of candidates
