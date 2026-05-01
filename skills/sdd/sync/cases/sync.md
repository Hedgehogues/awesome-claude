# Test: sdd:sync

## Case: with-openspec-changes
stub: with-openspec
semantic:
  - sync_runs: skill performs sync operation across changes from stub.openspec.changes
  - state_reported: output describes what was synced

## Case: fresh-repo-nothing-to-sync
stub: fresh-repo
semantic:
  - nothing_to_sync: when no changes exist, skill reports "nothing to sync" or equivalent
  - no_error: skill completes gracefully on empty repo
