## Case: positive-happy-deps-fresh-install
stub: fresh-repo
# Pre-condition: manifest.yaml с version, tools (openspec), repos: []; openspec не установлен
contains:
  - "manifest.yaml schema OK"
  - "openspec"
  - "skill:deps completed"
semantic:
  - tools_installed: openspec установлен в указанной версии
  - repos_skipped: вывод содержит "repos: empty, skipping sdd:sync" или эквивалент
  - manifest_unchanged: git diff manifest.yaml после прогона пуст

## Case: positive-corner-deps-already-installed
stub: fresh-repo
# Pre-condition: openspec уже установлен в нужной версии
contains:
  - "already up to date"
semantic:
  - idempotent: повторный вызов не переустанавливает уже корректные tools
  - no_writes: manifest.yaml не модифицирован

## Case: negative-missing-input-deps-no-manifest
stub: fresh-repo
# Pre-condition: manifest.yaml отсутствует в текущей директории
contains:
  - "manifest.yaml not found"
semantic:
  - early_exit: скилл останавливается до попытки чтения tools/repos

## Case: negative-invalid-input-deps-bad-schema
stub: fresh-repo
# Pre-condition: manifest.yaml присутствует но без ключа tools (или version, или repos)
contains:
  - "missing required keys"
semantic:
  - schema_error: явное упоминание какого ключа не хватает
  - no_install_attempted: скилл не пытается ничего установить при невалидной схеме
