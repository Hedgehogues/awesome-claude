## Case: positive-happy-post-release-minor-bump
stub: fresh-repo
# Pre-condition: чистый working tree, manifest.yaml с version: "0.7.0", пользователь выбирает minor
contains:
  - "release-0.8.0"
  - "skill:post-release completed"
semantic:
  - creates_branch: git branch показывает release-0.8.0
  - bumps_manifest: manifest.yaml содержит version: "0.8.0"
  - creates_commit: git log содержит коммит с bump-сообщением

## Case: positive-corner-post-release-major-bump
stub: fresh-repo
# Pre-condition: пользователь выбирает major из 0.7.0
contains:
  - "release-1.0.0"
semantic:
  - major_increments: minor и patch обнуляются, получается 1.0.0

## Case: negative-missing-input-post-release-no-manifest
stub: fresh-repo
# Pre-condition: manifest.yaml отсутствует
contains:
  - "manifest.yaml not found"
semantic:
  - early_exit: скилл останавливается, ветка не создаётся

## Case: negative-invalid-input-post-release-dirty-tree
stub: fresh-repo
# Pre-condition: uncommitted changes в working tree
contains:
  - "uncommitted changes"
semantic:
  - early_exit: скилл останавливается, manifest.yaml не изменяется, ветка не создаётся
