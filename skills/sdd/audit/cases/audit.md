# Test: sdd:audit

## Case: with-openspec-changes
stub: with-openspec
semantic:
  - changes_listed: skill reports each active change from stub.openspec.changes
  - audit_format: output contains an audit-style summary (state of each change, gaps, drift)

## Case: fresh-repo-no-changes
stub: fresh-repo
semantic:
  - no_changes_handled: when no openspec changes exist, skill reports an empty or "no changes" state without error
  - no_crash: skill completes gracefully on empty repo
