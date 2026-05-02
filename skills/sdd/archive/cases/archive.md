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
