---
approach: |
  Проверка archive/skill.md на наличие merges-into блока в шаге 7 и шага 9 с обновлением index.yaml.
acceptance_criteria:
  - ac-01: archive/skill.md шаг 7 читает .sdd.yaml через _sdd_yaml.py и итерирует merges-into
  - ac-02: archive/skill.md шаг 7 запускает L1/L2/L3 для capabilities из merges-into
  - ac-03: archive/skill.md содержит шаг 9 с обновлением index.yaml для merges-into
  - ac-04: verify-fail для merges-into приводит к red-banner и остановке (шаги 10+ не выполняются)
---

## Scenarios

Прочитать `skills/sdd/archive/skill.md` и проверить:
- шаг 7 содержит явное упоминание `merges-into` рядом с `creates`
- шаг 9 содержит логику обновления `description` в `index.yaml` для `merges-into`
- stop-guard в шаге 8 перечисляет диапазон 9–12 (не 9–11)
