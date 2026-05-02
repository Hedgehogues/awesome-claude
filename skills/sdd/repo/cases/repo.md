# Test: sdd:repo

## Case: with-openspec
stub: with-openspec
semantic:
  - repo_state: skill outputs current repository state including active changes
  - changes_visible: each change from stub.openspec.changes appears in output

## Case: fresh-repo
stub: fresh-repo
semantic:
  - empty_state: skill reports a clean repo state when no changes exist
  - branch_displayed: stub.git.branch appears in output
