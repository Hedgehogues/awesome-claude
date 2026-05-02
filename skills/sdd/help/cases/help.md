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

## Case: no-change-verify-in-pipeline
stub: fresh-repo
semantic:
  - no_change_verify_command: help output does NOT contain "/sdd:change-verify" as a numbered pipeline step
  - merged_into_apply: help output mentions verify is part of /sdd:apply (e.g. "verify встроен" or similar phrasing)

## Case: no-spec-verify-in-pipeline
stub: fresh-repo
semantic:
  - no_spec_verify_command: help output does NOT contain "/sdd:spec-verify" as a numbered pipeline step
  - merged_into_archive: help output mentions spec-verify is part of /sdd:archive

## Case: workflow-step-indices-updated
stub: fresh-repo
contains:
  - "/sdd:apply"
  - "/sdd:archive"
semantic:
  - apply_at_6: /sdd:apply appears as numbered step 6 in pipeline output
  - archive_at_7: /sdd:archive appears as numbered step 7
  - audit_at_8: /sdd:audit appears as numbered step 8
  - pipeline_total_8: numbered pipeline has exactly 8 steps (down from 10 after removing change-verify and spec-verify)
