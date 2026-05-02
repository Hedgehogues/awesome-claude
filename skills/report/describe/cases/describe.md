# Test: report:describe

## Case: empty-repo
stub: fresh-repo
semantic:
  - no_content: when no project context exists, skill reports minimal description
  - branch_in_output: stub.git.branch appears in output

## Case: with-openspec
stub: with-openspec
semantic:
  - structured_description: skill produces a structured description (purpose, structure, state)
  - changes_referenced: active changes from stub.openspec.changes are mentioned
