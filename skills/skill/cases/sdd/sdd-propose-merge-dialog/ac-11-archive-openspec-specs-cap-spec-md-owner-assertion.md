# Test: sdd:sdd-propose-merge-dialog (ac-11-archive-openspec-specs-cap-spec-md-owner-assertion)

## Case: ac-11-archive-openspec-specs-cap-spec-md-owner-assertion
stub: fresh-repo
semantic:
  - acceptance: после archive файлы в openspec/specs/<cap>/spec.md НЕ содержат поля owner (assertion: grep -L '^owner:' openspec/specs/**/spec.md)
