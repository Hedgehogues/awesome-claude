---
git:
  branch: feature-test
  commits:
    - "initial commit"
skills:
  sdd:
    - archive
openspec:
  changes:
    - my-feature
  change_files:
    my-feature:
      - proposal.md
      - design.md
      - tasks.md
      - .sdd.yaml
  sdd_yaml:
    my-feature:
      creates:
        - my-capability
      merges-into: []
---
