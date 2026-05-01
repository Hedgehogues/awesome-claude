# Test: sdd:archive

## Case: blocking-missing-test-plan
stub: change-missing-test-plan
contains:
  - "test-plan.md is missing"
semantic:
  - blocked: skill stops immediately and does not invoke openspec-archive-change
  - no_archive: change directory is not moved to archive

## Case: happy-path-copies-test-plan
stub: change-with-sdd-yaml
contains:
  - "test-plan.md"
  - "openspec/specs"
semantic:
  - archive_proceeds: skill calls openspec-archive-change without blocking
  - test_plan_copy: output references copying test-plan.md to openspec/specs/<capability>/test-plan.md
  - capability_resolved: my-capability from .sdd.yaml.creates is used as target directory

## Case: index-yaml-update
stub: change-with-sdd-yaml
contains:
  - "index.yaml"
  - "my-capability"
semantic:
  - index_entry_added: output indicates openspec/specs/index.yaml is created or updated with entry for my-capability
  - entry_fields: index entry includes capability, description, path, test_plan fields
