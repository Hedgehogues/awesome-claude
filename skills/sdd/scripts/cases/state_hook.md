# Test: state_hook.py

## Case: positive-happy-resolves-from-args
stub: with-hooks-config
semantic:
  - resolves_change_from_args: when stdin JSON contains tool_input.args="test-hook",
      hook finds openspec/changes/test-hook/.sdd-state.yaml
  - applies_pending_transitions: hook reads pending_transitions field and calls
      state.py transition for each stage in order
  - clears_field_after: pending_transitions field is empty string after hook completes

## Case: positive-corner-freshest-fallback
stub: with-hooks-config
semantic:
  - freshest_fallback: when tool_input.args is empty or change name not in args,
      hook finds the state-file with the most recent last_step_at timestamp
  - applies_transitions_to_freshest: transitions applied to the freshest change

## Case: negative-missing-input-no-change
stub: fresh-repo
semantic:
  - silent_skip: when no .sdd-state.yaml files exist in openspec/changes/,
      hook exits 0 without error and without calling state.py transition
  - no_harness_failure: hook exit code is 0 in all cases including missing change

## Case: negative-invalid-input-bad-json
stub: with-hooks-config
semantic:
  - bad_json_exit_0: when stdin contains malformed JSON, hook warns to stderr
      and exits 0 (does not raise exception or exit non-zero)
  - no_transition_on_bad_json: state file is not modified when JSON is invalid
