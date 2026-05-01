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
