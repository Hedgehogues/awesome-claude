# Test: sdd:apply

## Case: happy-path-with-sdd-yaml
stub: change-with-sdd-yaml
contains:
  - "test-plan.md"
  - "index.yaml"
  - "my-capability"
semantic:
  - test_plan_read: skill reads test-plan.md from change directory and uses acceptance_criteria as context
  - index_updated: openspec/specs/index.yaml is updated with entry for "my-capability" from .sdd.yaml creates field
  - sdd_yaml_consumed: skill reads .sdd.yaml to determine which capabilities to register
  - cases_generated: skill invokes test-plan-to-cases.py and generates semantic case files at skills/skill/cases/<ns>/my-capability/

## Case: no-sdd-yaml-skip-index
stub: fresh-repo
semantic:
  - graceful_skip: when .sdd.yaml is absent in change directory, skill completes without error
  - no_index_attempt: skill does not attempt to read or update openspec/specs/index.yaml
  - no_test_plan_attempt: skill does not fail when test-plan.md is also absent

## Case: specs-with-index-context
stub: specs-with-index
semantic:
  - existing_index_respected: skill reads existing openspec/specs/index.yaml and merges new entries
      rather than overwriting cap-alpha and cap-beta

## Case: final-report-canonical-block-order
stub: change-with-sdd-yaml
semantic:
  - block_order: final output contains headings in canonical order top-to-bottom —
      "## Технические статусы" before "## Описание" before "## Реализованные фичи"
      before "## Как проверить" before optional "## Решено самостоятельно"
      before optional "## Прочее" before "## Вопросы к пользователю" (last)
  - questions_last: "## Вопросы к пользователю" is the final heading in the output

## Case: no-content-below-questions-block
stub: change-with-sdd-yaml
semantic:
  - nothing_after_questions: no markdown heading and no prose appears after the last line
      of "## Вопросы к пользователю"; the section is always the terminal block

## Case: no-real-questions-renders-prodolzhayu
stub: change-with-sdd-yaml
contains:
  - "Продолжаю."
semantic:
  - prodolzhayu_present: when all forks are resolved autonomously,
      "## Вопросы к пользователю" body is exactly the literal line "Продолжаю."
  - no_numbered_list: no numbered list and no question mark appear inside
      "## Вопросы к пользователю" when there are no real user-only questions
  - no_synthetic_cta: the string "Продолжаем по флоу?" does NOT appear in the output;
      it is absent unless the user literally asked that exact question in this session

## Case: empty-creates-renders-net-in-features
stub: fresh-repo
semantic:
  - features_net: when .sdd.yaml.creates is empty or absent,
      "## Реализованные фичи" heading is present and its body contains "_нет_"
  - heading_present: the "## Реализованные фичи" heading itself is always rendered

## Case: autonomous-decisions-in-resolved-block
stub: change-with-sdd-yaml
semantic:
  - decisions_in_resolved: any autonomous fork resolution (name, path, command choice)
      appears as a line with "→" only inside "## Решено самостоятельно",
      not inside "## Вопросы к пользователю"
  - arrow_marker: "## Решено самостоятельно" entries follow the format "вопрос → решение"

## Case: kak-proveryat-has-three-fields-per-feature
stub: change-with-sdd-yaml
contains:
  - "**Что:**"
  - "**Где:**"
  - "**Как:**"
semantic:
  - three_fields: for each capability listed in "## Реализованные фичи",
      "## Как проверить" contains at least one numbered entry with all three fields:
      "**Что:**", "**Где:**", "**Как:**"
  - coverage: number of entries in "## Как проверить" matches number of capabilities
      in "## Реализованные фичи"

## Case: empty-creates-kak-proveryat-renders-net
stub: fresh-repo
semantic:
  - kak_proveryat_heading: "## Как проверить" heading is present even when creates is empty
  - kak_proveryat_net: body of "## Как проверить" contains "_нет_" when .sdd.yaml.creates
      is empty or test-plan.md is missing or has only placeholder content

## Case: no-jargon-in-user-facing-blocks
stub: change-with-sdd-yaml
semantic:
  - no_hard_issue: the string "hard issue" does not appear in "## Описание"
      or "## Решено самостоятельно"
  - no_drift_score: the string "drift_score" does not appear in "## Описание"
      or "## Решено самостоятельно"
  - no_ssot: the string "SSOT" does not appear in "## Описание"
      or "## Решено самостоятельно"
  - no_pointer_rewrite: the string "pointer-rewrite" does not appear in
      "## Описание" or "## Решено самостоятельно"

## Case: intermediate-clarifications-use-prose
stub: change-with-sdd-yaml
semantic:
  - no_block_headers_in_intermediate: when the skill responds to a clarification
      or meta-question before the final report is produced, the intermediate reply
      does NOT contain the headings "## Технические статусы", "## Описание",
      or "## Вопросы к пользователю"
  - prose_only: intermediate responses are 2–3 sentences of plain prose

## Case: identity-mismatch-warning
stub: change-other-owner
contains:
  - "owner"
semantic:
  - warning_emitted: skill detects current identity differs from .sdd.yaml owner and emits warning containing both emails
  - opt_in_required: skill invokes AskUserQuestion before overwriting owner; does not overwrite silently
  - no_silent_proceed: skill does not proceed to applying stage without explicit user consent

## Case: resume-from-verifying
stub: change-verifying-state
semantic:
  - state_read_first: skill reads .sdd-state.yaml before any other action and observes stage=verifying
  - no_reimplement: skill does not re-execute openspec-apply-change for tasks already marked [x]
  - resume_at_verify: skill continues from inline L1/L2/L3 verify, not from start

## Case: verify-failed-no-index-update
stub: change-verify-failed
semantic:
  - state_verify_failed: skill detects existing .sdd-state.yaml stage=verify-failed
  - index_not_updated: openspec/specs/index.yaml is NOT modified when stage=verify-failed
  - workflow_halted: skill stops with verify-failed verdict and instructs user to fix and re-run /sdd:apply

## Case: pending-transitions-written-before-end
stub: change-with-sdd-yaml
semantic:
  - pending_transitions_written: before the skill finishes, .sdd-state.yaml contains
      a non-empty pending_transitions field (e.g. "applying,verifying,verify-ok")
  - written_via_state_update: the field is written via `state.py update ... pending_transitions`
      not via `state.py transition`

## Case: no-direct-transition-in-apply
stub: change-with-sdd-yaml
semantic:
  - no_direct_transition: skills/sdd/apply/skill.md does NOT contain any line matching
      `state.py transition` (only `state.py update ... pending_transitions` is allowed)

## Case: keep-in-sync-marker-present
stub: change-with-sdd-yaml
semantic:
  - marker_in_apply: skills/sdd/apply/skill.md verify section contains literal comment "<!-- KEEP IN SYNC: skills/sdd/archive/skill.md verify section -->"
  - marker_in_archive: skills/sdd/archive/skill.md verify section contains literal comment "<!-- KEEP IN SYNC: skills/sdd/apply/skill.md verify section -->"
  - intentional_duplication: marker documents that L1/L2/L3 verifier text is intentionally copied between apply and archive (per design D2)

## Case: state-manager-called-on-each-step
stub: change-with-sdd-yaml
semantic:
  - uses_state_manager: skills/sdd/apply/skill.md содержит вызовы state_manager.py с --ns sdd --skill apply на ключевых шагах (start, verify-start, verify-passed/verify-failed)
  - no_direct_pending_update: skills/sdd/apply/skill.md НЕ содержит прямых вызовов `state.py update ... pending_transitions` (заменены на state_manager.py)

## Case: title-renders-instead-of-name-in-features
stub: change-with-sdd-yaml
semantic:
  - title_shown: when .sdd.yaml contains creates entry as object {name: "cap-alpha", title: "Человекочитаемый заголовок"},
      "## Реализованные фичи" shows "Человекочитаемый заголовок", not "cap-alpha"
  - kebab_absent: the kebab-case name "cap-alpha" does NOT appear inside "## Реализованные фичи"

## Case: status-in-russian
stub: change-with-sdd-yaml
semantic:
  - done_in_russian: when a capability status is done, "## Реализованные фичи" contains «готово», not bare "done"
  - partial_in_russian: when a capability status is partial, "## Реализованные фичи" contains «частично», not bare "partial"

## Case: partial-shows-incomplete-count-not-raw-tasks
stub: change-with-sdd-yaml
semantic:
  - count_shown: when a capability is partial with N unchecked tasks,
      the line in "## Реализованные фичи" contains "задач не завершено"
  - no_raw_task_text: raw task text (e.g. "integration тесты требуют live-run") does NOT
      appear in "## Реализованные фичи"

## Case: string-capability-fallback-to-name
stub: change-with-sdd-yaml
semantic:
  - name_fallback: when .sdd.yaml contains creates entry as plain string "some-capability"
      (no title field), "## Реализованные фичи" shows "some-capability" as the display name

## Case: verify-section-uses-title-not-kebab
stub: change-with-sdd-yaml
semantic:
  - title_in_header: when capability has title, the numbered entry header in "## Как проверить"
      shows the title, not the kebab-case name
  - kebab_absent_in_verify: the kebab-case capability name does NOT appear as a standalone
      section header in "## Как проверить"

## Case: verify-how-field-starts-with-human-expectation
stub: change-with-sdd-yaml
semantic:
  - expectation_first: the "**Как:**" field in each "## Как проверить" entry begins with
      a sentence in Russian describing the expected result before any shell command
  - no_raw_command_start: the "**Как:**" field does NOT start with grep, cat, curl,
      or any other shell command without preceding context
