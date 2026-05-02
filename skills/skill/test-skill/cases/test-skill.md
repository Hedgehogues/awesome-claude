## Case: lifecycle-cleanup
stub: fresh-repo

# Scenario: after skill:test-skill completes, $RUN_ROOT must be absent on disk.
contains:
  - "Run root:"
  - "cleaned up"
semantic:
  - tmp_cleaned: output confirms $RUN_ROOT was removed (prints "cleaned up"), not preserved
  - no_residue: run root path reported in output is absent on disk after run

## Case: keep-tmp-failed-only
stub: fresh-repo

# Scenario: with --keep-tmp=failed-only, only failed case dirs are preserved under ~/.cache/skill-test/.
contains:
  - "Run root:"
semantic:
  - failed_preserved: if a case fails, its tmp dir path under ~/.cache/skill-test/ is printed
  - passed_cleaned: passing case dirs are not preserved, only failed ones
