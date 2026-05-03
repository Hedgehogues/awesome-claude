## 1. sdd:propose — удалить скилл-логику

- [ ] 1.1 Удалить шаг 7 (`test-plan.md` stub) из `skills/sdd/propose/skill.md`
- [ ] 1.2 Удалить шаг 11 (stub-кейсы для скиллов) из `skills/sdd/propose/skill.md`
- [ ] 1.3 Обновить frontmatter description в `skills/sdd/propose/skill.md` — убрать упоминание test-plan.md стабов

## 2. sdd:propose cases — обновить тест-кейсы

- [ ] 2.1 Убрать из кейса `full-structure` в `skills/sdd/propose/cases/propose.md` проверку наличия `test-plan.md`
- [ ] 2.2 Убрать из кейса `missing-sdd-yaml` проверку `test-plan.md`, если есть
- [ ] 2.3 Добавить негативный кейс: `test-plan.md` не создаётся при non-skill change

## 3. sdd:apply — добавить skill-detection и scaffold

- [ ] 3.1 В `skills/sdd/apply/skill.md` добавить шаг: определить skill-change по proposal.md (ищет `skills/<ns>/<skill>/skill.md` в `## What Changes` / `## New Capabilities`)
- [ ] 3.2 Если skill-change — создать `test-plan.md` stub в директории change (до первого таска)
- [ ] 3.3 Если skill-change — создать stub-кейсы `skills/<ns>/<skill>/cases/<skill>.md` для каждого нового скилла

## 4. Spec — обновить test-plan-link

- [ ] 4.1 При archive `sdd-propose-no-skill-coupling` merge spec-дельта в `openspec/specs/test-plan-link/spec.md`
