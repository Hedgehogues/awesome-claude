## Why

`sdd:propose` содержит логику, специфичную для скиллов: создание `test-plan.md` (шаг 7) и stub-кейсов (шаг 11). Это нарушает разделение ответственностей — SDD-неймспейс не должен знать о структуре скиллов. При создании non-skill change эти артефакты создаются впустую и вводят в заблуждение.

## What Changes

- Удалить из `sdd:propose` шаг 7 (безусловное создание `test-plan.md`)
- Удалить из `sdd:propose` шаг 11 (создание stub-кейсов для новых скиллов)
- Перенести генерацию `test-plan.md` и stub-кейсов в `sdd:apply`: при реализации change, создающего новый скилл, `sdd:apply` создаёт необходимую тест-инфраструктуру
- Обновить spec `test-plan-link`: `test-plan.md` создаётся на этапе apply для skill-change, а не на этапе propose для всех change

## Capabilities

### New Capabilities

### Modified Capabilities

- `test-plan-link`: test-plan.md создаётся в `sdd:apply` только при наличии нового скилла, а не в `sdd:propose` для всех change

## Impact

- `skills/sdd/propose/skill.md` — удалить шаги 7 и 11
- `skills/sdd/propose/cases/propose.md` — убрать требование наличия `test-plan.md` в тест-кейсах
- `skills/sdd/apply/skill.md` — добавить создание `test-plan.md` и stub-кейсов при skill-change
- `openspec/specs/test-plan-link/spec.md` — сузить требование: только skill-change, только при apply

See `.sdd.yaml` for capability declarations.
