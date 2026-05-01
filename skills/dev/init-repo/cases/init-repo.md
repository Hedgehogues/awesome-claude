# Test: dev:init-repo

## Case: fresh-repo-init
stub: fresh-repo
semantic:
  - init_runs: skill initializes repository structure (CLAUDE.md, .claude/, rules, etc.)
  - branch_aware: stub.git.branch is recognized

## Case: already-initialized
stub: with-openspec
semantic:
  - idempotent: when repo is already initialized, skill detects existing setup and does not duplicate
  - safe: skill does not overwrite existing CLAUDE.md or rules without confirmation
