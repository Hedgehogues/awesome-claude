# Test: sdd:contradiction

## Case: cross-spec-no-conflict
stub: specs-with-index
contains:
  - "Analyzed:"
  - "cap-alpha"
  - "cap-beta"
semantic:
  - coverage: report header shows "Analyzed: 2 capabilities"
  - no_errors: hard issues section shows "(none)" — the two specs are consistent

## Case: cross-spec-with-contradiction
stub: specs-with-index
# Scenario: cap-beta says cap-alpha SHALL be called; another spec says it SHALL NOT be called.
# Expected: deontic error is detected and reported.
semantic:
  - deontic_conflict: if cap-alpha has conflicting SHALL / SHALL NOT across caps,
      report shows [error] deontic for the conflicting subject

## Case: index-missing
stub: fresh-repo
contains:
  - "index.yaml not found"
semantic:
  - graceful_missing: when openspec/specs/index.yaml does not exist,
      contradiction outputs "Analyzed: 0 capabilities from index" and proceeds with local analysis only

## Case: final-report-canonical-block-order-contradiction
stub: change-with-sdd-yaml
semantic:
  - block_order: final output contains headings in canonical order —
      "## Технические статусы" before "## Описание" before "## Найденные противоречия"
      before optional "## Решено самостоятельно" before optional "## Прочее"
      before "## Вопросы к пользователю" (last)
  - questions_last: "## Вопросы к пользователю" is the final heading in the output

## Case: no-content-below-questions-contradiction
stub: change-with-sdd-yaml
semantic:
  - nothing_after_questions: no markdown heading and no prose appears after
      the last line of "## Вопросы к пользователю"

## Case: no-real-questions-renders-prodolzhayu-contradiction
stub: change-with-sdd-yaml
contains:
  - "Продолжаю."
semantic:
  - prodolzhayu_when_no_decision_gate: when the detector phases produce no decision-gate
      and there are no other user-only questions, "## Вопросы к пользователю"
      body is exactly the literal line "Продолжаю."
  - no_synthetic_cta: the string "Продолжаем по флоу?" does NOT appear in the output
      unless the user literally asked it in this session

## Case: existing-report-embedded-verbatim
stub: change-with-sdd-yaml
contains:
  - "--- Hard issues ---"
  - "--- Summary ---"
semantic:
  - verbatim_in_tech_statuses: the existing detailed detector report
      (including "--- Hard issues ---", "--- Soft warnings ---", "--- Summary ---" headers)
      appears unchanged inside "## Технические статусы"
  - no_deduplication: detector output is not moved, deduplicated, or reformatted
      between the verbatim section and the user-facing wrapper

## Case: no-hard-issues-renders-net
stub: specs-with-index
semantic:
  - net_when_clean: when the detector phases find zero hard issues,
      "## Найденные противоречия" heading is present and its body contains "_нет_"

## Case: no-kak-proveryat-in-contradiction
stub: change-with-sdd-yaml
semantic:
  - no_heading: the heading "## Как проверить" does NOT appear anywhere
      in the sdd:contradiction final report

## Case: no-jargon-in-user-facing-blocks-contradiction
stub: change-with-sdd-yaml
semantic:
  - no_hard_issue_in_description: the string "hard issue" does not appear
      in "## Описание" or "## Решено самостоятельно"
  - no_drift_score_in_description: the string "drift_score" does not appear
      in "## Описание" or "## Решено самостоятельно"
  - jargon_allowed_in_tech: detector jargon MAY appear inside "## Технические статусы"
      because the detailed report is embedded verbatim there

## Case: state-transition-on-no-issues
stub: change-with-sdd-yaml
semantic:
  - transition_to_ok: when contradiction detector run produces 0 hard issues, .sdd-state.yaml stage transitions to contradiction-ok
  - state_file_updated: .sdd-state.yaml last_step_at is updated with current ISO timestamp

## Case: state-transition-on-hard-issues
stub: change-with-sdd-yaml
semantic:
  - transition_to_failed: when contradiction detector run produces ≥1 hard issue (numeric/reference/deontic/semantic), .sdd-state.yaml stage transitions to contradiction-failed
  - report_still_rendered: even on contradiction-failed, the full 7-block report is rendered first; transition is the LAST action

## Case: identity-warn-other-owner
stub: change-other-owner
contains:
  - "owner"
semantic:
  - identity_check_at_start: skill calls identity.py before running detectors
  - warning_when_mismatch: when current email differs from .sdd.yaml owner, skill emits warning naming both emails
  - opt_in_overwrite: skill invokes AskUserQuestion before overwriting owner; does not silently proceed
