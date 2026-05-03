---
approach: |
  Запускать skill:post-release в изолированном git-репо с manifest.yaml.
  Проверять результат: наличие новой ветки, содержимое manifest.yaml, наличие коммита.
acceptance_criteria:
  - skill:post-release создаёт ветку release-<new-version>
  - manifest.yaml обновляется до новой версии
  - скилл останавливается с ошибкой при грязном working tree
  - скилл останавливается с ошибкой при отсутствии manifest.yaml
---

## Scenarios

**Happy path:** чистое дерево, manifest.yaml с version: "0.7.0", пользователь выбирает minor → создаётся ветка `release-0.8.0`, manifest.yaml обновляется до `0.8.0`, коммит `chore: bump version to 0.8.0`.

**Corner:** пользователь выбирает major bump из `0.7.0` → ветка `release-1.0.0`, minor и patch обнуляются.

**Missing input:** manifest.yaml отсутствует → скилл выходит с ошибкой до создания ветки.

**Invalid input (dirty tree):** uncommitted changes в working tree → скилл выходит с ошибкой, ветка не создаётся.
