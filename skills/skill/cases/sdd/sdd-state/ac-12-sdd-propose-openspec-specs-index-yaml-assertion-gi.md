# Test: sdd:sdd-state (ac-12-sdd-propose-openspec-specs-index-yaml-assertion-gi)

## Case: ac-12-sdd-propose-openspec-specs-index-yaml-assertion-gi
stub: fresh-repo
semantic:
  - acceptance: /sdd:propose НЕ модифицирует openspec/specs/index.yaml (assertion: git diff --exit-code openspec/specs/index.yaml после propose возвращает 0)
