# Test: sdd:help

## Case: fresh-repo
stub: fresh-repo
contains:
  - "=== Repo state ==="
  - "=== SDD Workflow ==="
  - "=== Explore"
semantic:
  - branch: stub.git.branch appears in output
  - skills: all stub.skills.sdd items appear as /sdd:<name> in output
  - changes: active changes block shows "(none)"

## Case: with-openspec
stub: with-openspec
contains:
  - "=== Repo state ==="
  - "Active changes:"
semantic:
  - branch: stub.git.branch appears in output
  - changes: each stub.openspec.changes item appears in active changes block

## Case: multi-skill
stub: multi-skill
contains:
  - "=== SDD Workflow ==="
semantic:
  - skills: all 5 stub.skills.sdd items appear as /sdd:<name> in output
