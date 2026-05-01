# Test: dev:deploy

## Case: missing-deploy-config
stub: fresh-repo
semantic:
  - config_missing: when no deploy config / Makefile is present, skill reports missing prerequisites
  - no_destructive: skill does not perform destructive operations without config

## Case: with-openspec-context
stub: with-openspec
semantic:
  - dry_run_ok: skill describes deploy steps before executing
  - context_aware: skill mentions current branch from stub.git.branch
