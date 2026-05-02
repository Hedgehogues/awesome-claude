# Test: sdd:propose

## Case: full-structure
stub: change-with-sdd-yaml
contains:
  - ".sdd.yaml"
  - "test-plan.md"
  - "creates:"
  - "merges-into:"
  - "approach:"
  - "acceptance_criteria:"
  - "## Scenarios"
semantic:
  - sdd_yaml: change directory contains .sdd.yaml with creates and merges-into fields
  - test_plan: change directory contains test-plan.md with YAML front matter and ## Scenarios

## Case: missing-sdd-yaml
stub: fresh-repo
contains:
  - ".sdd.yaml"
semantic:
  - sdd_yaml: propose creates .sdd.yaml stub even for minimal change

## Case: missing-sdd-yaml-reference-in-proposal
stub: change-with-sdd-yaml
semantic:
  - reference_check: if proposal.md lacks reference to .sdd.yaml, propose reports
      "proposal.md does not reference .sdd.yaml"

## Case: design-formatter-openspec-sections
stub: change-with-sdd-yaml
semantic:
  - design_sections: if design.md is missing any of Context, Goals / Non-Goals,
      Decisions, Risks / Trade-offs (per openspec template) — propose invokes
      check-design.py and reports "design.md is missing section: <name>"; propose blocks until fix

## Case: state-file-created-proposed
stub: fresh-repo
semantic:
  - state_file_created: after propose, openspec/changes/<name>/.sdd-state.yaml exists
  - stage_is_proposed: .sdd-state.yaml stage field equals "proposed"
  - owner_in_state: .sdd-state.yaml owner field is set to current identity email
  - last_step_at_set: .sdd-state.yaml has ISO-8601 last_step_at timestamp

## Case: owner-initialized-from-identity
stub: fresh-repo
semantic:
  - owner_in_sdd_yaml: after propose, .sdd.yaml has owner field set to current identity email (from identity.py)
  - owner_is_string: owner is a single string value, not a list
  - identity_priority: identity comes from claude auth status when available, falls back to git config user.email otherwise

## Case: merge-dialog-collision
stub: creates-collision
contains:
  - "existing-cap"
semantic:
  - collision_detected: propose detects existing-cap is in both .sdd.yaml.creates and openspec/specs/index.yaml
  - ask_user_question_invoked: AskUserQuestion is called with two options (Оставить в creates / Переключить в merges-into)
  - move_capability_on_choice: if user picks merges-into, _sdd_yaml.py move-capability moves existing-cap from creates to merges-into
  - no_dialog_for_new_cap: new-cap is NOT subject to the dialog because it has no collision

## Case: index-yaml-not-modified
stub: creates-collision
semantic:
  - read_only_index: openspec/specs/index.yaml is NOT modified by propose at any step
  - read_only_during_dialog: even when user picks merges-into in dialog, propose only updates .sdd.yaml — index.yaml is left untouched (those updates are deferred to apply/archive)
  - git_diff_clean: git diff openspec/specs/index.yaml after propose returns empty
