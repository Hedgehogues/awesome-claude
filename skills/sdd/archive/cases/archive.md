# Test: sdd:archive

## Case: blocking-missing-test-plan
stub: change-missing-test-plan
contains:
  - "test-plan.md is missing"
semantic:
  - blocked: skill stops immediately and does not invoke openspec-archive-change
  - no_archive: change directory is not moved to archive

## Case: happy-path-no-copy-to-specs
stub: change-with-sdd-yaml
contains:
  - "test-plan.md"
  - "archive"
semantic:
  - archive_proceeds: skill calls openspec-archive-change without blocking
  - test_plan_stays_in_archive: test-plan.md remains in archived change directory (openspec/changes/archive/<date>-<name>/)
  - no_specs_copy: skill does NOT copy test-plan.md to openspec/specs/<capability>/test-plan.md

## Case: index-yaml-update
stub: change-with-sdd-yaml
contains:
  - "index.yaml"
  - "my-capability"
semantic:
  - index_entry_added: output indicates openspec/specs/index.yaml is created or updated with entry for my-capability
  - entry_fields: index entry includes capability, description, path, test_plan fields

## Case: final-report-canonical-block-order-archive
stub: change-with-sdd-yaml
semantic:
  - block_order: final output contains headings in canonical order —
      "## Технические статусы" before "## Описание" before "## Архивированные артефакты"
      before optional "## Решено самостоятельно" before optional "## Прочее"
      before "## Вопросы к пользователю" (last)
  - questions_last: "## Вопросы к пользователю" is the final heading in the output

## Case: no-content-below-questions-archive
stub: change-with-sdd-yaml
semantic:
  - nothing_after_questions: no markdown heading and no prose appears after
      the last line of "## Вопросы к пользователю"

## Case: archive-no-real-questions-renders-prodolzhayu
stub: change-with-sdd-yaml
contains:
  - "Продолжаю."
semantic:
  - prodolzhayu_archive: for archive there are typically no user-only questions,
      so "## Вопросы к пользователю" body is exactly the literal line "Продолжаю."
  - no_synthetic_cta: the string "Продолжаем по флоу?" does NOT appear in the output

## Case: empty-creates-renders-net-in-artifacts
stub: fresh-repo
semantic:
  - artifacts_net: when .sdd.yaml.creates is empty or absent,
      "## Архивированные артефакты" heading is present and body contains "_нет_"
  - heading_present: the "## Архивированные артефакты" heading itself is always rendered

## Case: archived-artifacts-list-paths
stub: change-with-sdd-yaml
semantic:
  - spec_path_listed: for each capability in .sdd.yaml.creates,
      "## Архивированные артефакты" lists the path to openspec/specs/<capability>/spec.md
  - test_plan_path_listed: for each capability, the path to
      openspec/specs/<capability>/test-plan.md is also listed

## Case: no-kak-proveryat-in-archive
stub: change-with-sdd-yaml
semantic:
  - no_heading: the heading "## Как проверить" does NOT appear anywhere
      in the sdd:archive final report

## Case: no-jargon-in-user-facing-blocks-archive
stub: change-with-sdd-yaml
semantic:
  - no_hard_issue: the string "hard issue" does not appear in "## Описание"
      or "## Решено самостоятельно"
  - no_drift_score: the string "drift_score" does not appear in "## Описание"
      or "## Решено самостоятельно"
  - no_ssot: the string "SSOT" does not appear in "## Описание"
      or "## Решено самостоятельно"

## Case: removed-req-file-gone-pass
stub: change-with-removed-req-no-file
semantic:
  - inverted_l1_pass: spec contains "## REMOVED Requirements" referencing skills/sdd/legacy/skill.md, file is absent on disk → verdict for that Requirement is `done`
  - no_l2_l3_for_removed: L2 and L3 are marked N/A for REMOVED Requirements
  - archive_completes: skill completes archive flow without red-banner

## Case: removed-req-file-remains-fail
stub: change-with-removed-req-file-present
semantic:
  - inverted_l1_fail: spec contains "## REMOVED Requirements" but referenced file still exists on disk → verdict is `missing`
  - note_removal_not_performed: verifier output includes note "removal not performed"
  - red_banner_emitted: archive halts with red-banner when REMOVED-inversion fails

## Case: verify-fail-red-banner
stub: change-verify-failed
contains:
  - "SPECS MODIFIED"
  - "git restore openspec/specs/"
semantic:
  - banner_exact_text: output contains all three banner lines verbatim
  - state_archive_failed: .sdd-state.yaml stage transitions to archive-failed
  - no_auto_rollback: openspec/specs/ files are NOT reverted by the skill
  - state_file_preserved: .sdd-state.yaml is NOT deleted on archive-fail

## Case: state-deleted-on-success
stub: change-with-sdd-yaml
semantic:
  - delete_is_last_step: state.py delete is the FINAL step of archive, after merge specs and copy operations
  - no_state_after_success: .sdd-state.yaml does not exist after successful archive
  - delete_only_on_archived: delete is invoked only when state transitions to archived, never on intermediate stages

## Case: state-preserved-on-archive-fail
stub: change-verify-failed
semantic:
  - state_remains: .sdd-state.yaml file still exists after archive-fail
  - state_shows_failed_stage: state-file content has stage=archive-failed for resume capability
  - no_silent_cleanup: skill does not delete state-file at any failure path
