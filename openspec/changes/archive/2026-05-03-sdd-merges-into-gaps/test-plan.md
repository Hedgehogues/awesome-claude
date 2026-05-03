---
approach: |
  Верификация через чтение изменённых файлов и анализ кода.
  archive/skill.md — проверить наличие merges-into блока в шаге 7.
  contradiction.py — проверить отсутствие relevant_names и наличие второго прохода по creates.
acceptance_criteria:
  - archive/skill.md шаг 7 содержит чтение .sdd.yaml.merges-into и L1/L2/L3 для каждой capability
  - archive/skill.md обновляет index.yaml description для merges-into при verify-ok
  - contradiction.py не содержит переменную relevant_names
  - contradiction.py содержит второй проход по creates с загрузкой из openspec/changes/<name>/specs/
  - draft-спеки помечены [DRAFT] в выводе скрипта
  - summary в выводе contradiction.py содержит поле draft_specs_loaded
---

## Scenarios

**archive-merges-into-support:**

Запустить `sdd:archive` на тестовом change с `merges-into: [existing-cap]`. Проверить, что верификация L1/L2/L3 запускается для `existing-cap`, и `index.yaml` обновляет описание capability.

Запустить `sdd:archive` с `merges-into: []`. Проверить, что шаг выполняется без ошибок.

**contradiction-draft-specs:**

Запустить `contradiction.py` на change-директории, где `creates` содержит capability, отсутствующую в `index.yaml`, но имеющую `specs/<cap>/spec.md`. Проверить, что capability попадает в пакет с пометкой `[DRAFT]`.

Проверить, что `relevant_names` не фигурирует в коде.
