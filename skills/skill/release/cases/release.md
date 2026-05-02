## Case: positive-happy-release-clean-tree
stub: fresh-repo
# Pre-condition: чистый working tree, manifest.yaml с version: "0.6.0"
contains:
  - "Current version"
  - "skill:release completed"
semantic:
  - bumps_version: manifest.yaml после release содержит новую версию (X.Y.Z+1 для patch)
  - creates_commit: git log показывает новый commit с release-сообщением
  - creates_tag: git tag показывает новый v<new> tag

## Case: positive-corner-release-major-bump
stub: fresh-repo
# Pre-condition: пользователь выбирает major bump
contains:
  - "Current version"
semantic:
  - major_increments: при выборе major из 0.6.0 получается 1.0.0 (minor и patch обнуляются)

## Case: negative-missing-input-release-no-manifest
stub: fresh-repo
# Pre-condition: manifest.yaml отсутствует
contains:
  - "manifest.yaml not found"
semantic:
  - early_exit: скилл останавливается до попытки read version

## Case: negative-invalid-input-release-dirty-tree
stub: fresh-repo
# Pre-condition: git status имеет uncommitted changes
contains:
  - "uncommitted changes"
semantic:
  - early_exit: скилл останавливается, не модифицирует manifest.yaml, не создаёт commit/tag
  - shows_diff: вывод включает git status --short с перечислением неcommitted файлов
