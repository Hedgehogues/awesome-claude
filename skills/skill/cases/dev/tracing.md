# Test: dev:tracing

## Case: no-trace-target
stub: fresh-repo
semantic:
  - prompt_for_target: skill asks which function/flow to add tracing for
  - no_random_changes: skill does not insert tracing without explicit target

## Case: with-context
stub: with-openspec
semantic:
  - trace_plan: output describes where tracing will be inserted before applying
  - structured_output: skill identifies entry points / boundaries for instrumentation
