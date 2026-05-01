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

## Case: happy-path-with-mocks
stub: with-deploy-config
semantic:
  - makefile_exists: skill finds Makefile with deploy target
  - docker_mocked: skill calls docker push (caught by mock in PATH)
  - env_passed: DEPLOY_ENV and DEPLOY_TOKEN are available in environment
  - deploy_output: output contains "Deploying to staging" and "Deploy complete"
