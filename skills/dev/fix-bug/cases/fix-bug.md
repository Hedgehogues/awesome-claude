# Test: dev:fix-bug

## Case: no-bug-description
stub: fresh-repo
semantic:
  - prompt_for_input: when invoked without a bug description, skill asks for the bug to be specified
  - no_random_fix: skill does not start changing files without a target

## Case: with-context
stub: with-openspec
semantic:
  - investigation_starts: skill begins by investigating the codebase before proposing a fix
  - structured_output: output describes hypothesis, root cause, fix approach
