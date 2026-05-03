## Summary

`proposal.md` не содержит обязательных секций для контекста и верификации, из-за чего при каждом новом вызове скилла пользователю приходится объяснять «что это и как проверить» заново.

## Why

Два повторяющихся неудобства при работе с ченджами:

**Контекст теряется.** `proposal.md` начинается с технических деталей (`## Why`, `## What Changes`) без короткого человекочитаемого введения. При открытии нового диалога Claude не может ответить на вопрос «что это такое» без повторного объяснения от пользователя.

**Верификация не декларирована.** В `proposal.md` нет секции «как проверить, что чендж применён корректно». Критерии готовности скрыты в `test-plan.md` (если вообще заполнен), а `sdd:apply` не знает, что считать финальной валидацией.

## What Changes

- Добавить в `design-formatter` spec требование: `proposal.md` SHALL содержать секцию `## Summary` — 1–2 предложения на русском, что меняется и зачем, без технических идентификаторов и терминов
- Добавить в `design-formatter` spec требование: `proposal.md` SHALL содержать секцию `## Verification` — список acceptance criteria в человекочитаемом виде (ожидаемое поведение, не shell-команды)
- Создать `check-proposal.py`: валидировать наличие `## Summary` и `## Verification` в `proposal.md`; вызывать из `sdd:propose` после генерации `proposal.md`
- Обновить `docs/SKILL_DESIGN.md`: задокументировать обязательные секции `proposal.md`

## Capabilities

### Modified Capabilities

- `design-formatter`: добавить требования к структуре `proposal.md` (`## Summary`, `## Verification`)

## Impact

- `openspec/specs/design-formatter/spec.md` — два новых Requirement'а
- `skills/sdd/propose/scripts/check-proposal.py` — новый скрипт
- `skills/sdd/propose/skill.md` — вызов `check-proposal.py` после генерации `proposal.md`
- `.claude/skills/sdd/propose/skill.md` — зеркало
- `docs/SKILL_DESIGN.md` — документация обязательных секций `proposal.md`

## Verification

- `sdd:propose` блокирует создание ченджа, если в `proposal.md` нет `## Summary` или `## Verification`
- `proposal.md` любого нового ченджа содержит обе секции после прохождения `sdd:propose`
- Существующие ченджи не затронуты (check-proposal.py запускается только в `sdd:propose`)

See `.sdd.yaml` for capability declarations.
