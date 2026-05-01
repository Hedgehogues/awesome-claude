# Test: dev:commit

## Case: clean-repo-nothing-to-commit
stub: fresh-repo
semantic:
  - no_changes: when no uncommitted changes exist, skill reports "nothing to commit" or skips gracefully

## Case: with-staged-changes
stub: fresh-repo
# Scenario: assume stub repo has at least one tracked file changed (covered by stub.git.commits).
semantic:
  - commit_attempted: skill runs git status / git diff to inspect changes before composing message
