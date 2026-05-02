## Why

Test-flow в репе фрагментирован: `test-plan-to-cases.py` (apply шаг 10) использует ложную презумпцию «capability = скилл» и слабую эвристику `infer_namespace()` по подстроке имени, кладёт acceptance-cases в плоский путь `skills/skill/cases/<ns>/<cap>/`, не имеет capability-владельца. Сосуществуют две структуры test-cases без формальной границы: `skills/<ns>/<skill>/cases/<skill>.md` (behavioral, читает `skill:test-skill`) и `skills/skill/cases/<ns>/<cap>/ac-NN.md` (acceptance, генерирует apply). Rule `rules/skill-tdd-coverage.md` пишет плоский путь — противоречит коду `skill:test-skill`, который ожидает вложенный. Acceptance cases для non-skill capabilities негде запускать — `skill:test-skill` принимает только `<ns>:<skill>`.

Архитектурный долг был обнаружен при `/sdd:contradiction install-modes` — install-modes описывает behavioral cases во вложенной структуре, но apply сгенерил бы файлы в плоской с неправильными namespace. В install-modes временно оставлен компромиссный флаг `generate_cases: false`; этот change закрывает корневую причину.

## What Changes

- Ввести capability `test-flow` — единый владелец test-generation скрипта, layout cases, runner'а acceptance (см. `design.md` → D1)
- Формально разделить behavioral vs acceptance cases по роли и пути (см. `design.md` → D2)
- Переписать `skills/sdd/apply/scripts/test-plan-to-cases.py`: убрать `infer_namespace()`; материализация по правилу — capability имеет соответствующий `skills/<ns>/<cap>/skill.md` → класть в `skills/<ns>/<cap>/cases/ac-NN.md`; иначе → в `openspec/specs/<cap>/cases/ac-NN.md` (см. `design.md` → D3)
- Расширить `skill:test-skill` чтобы он подхватывал не только `cases/<skill>.md`, но и все `cases/ac-*.md` рядом со скиллом (см. `design.md` → D4)
- Ввести `skill:test-acceptance` для запуска acceptance-cases по non-skill capabilities из `openspec/specs/<cap>/cases/` (см. `design.md` → D5)
- Привести `rules/skill-tdd-coverage.md` к вложенной структуре + добавить раздел про acceptance cases (см. `design.md` → D6)
- Снять компромиссный флаг `generate_cases: false` из `install-modes/test-plan.md` после archive этого change

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `test-flow`: единый владелец test-generation pipeline — скрипт материализации acceptance criteria, layout cases (behavioral vs acceptance), runner'ы. Формализует ownership и контракты, которые сейчас implicit в коде.
- `acceptance-runner`: `/skill:test-acceptance` — запускает acceptance cases (`cases/ac-*.md`) для capability независимо от того, скилл она или нет; читает `openspec/specs/<cap>/cases/` и `skills/<ns>/<cap>/cases/ac-*.md`.

### Modified Capabilities

- `skill-eval-framework` — добавить разделение behavioral vs acceptance cases (после archive install-modes этот capability будет в index)
- `test-plan-link` — уточнить, что `test-plan.md` — контракт, материализация регулируется `test-flow`

## Impact

- `skills/sdd/apply/scripts/test-plan-to-cases.py` — переписать под новую логику без `infer_namespace()`
- `skills/skill/test-skill/skill.md` — расширить чтение cases (включить `ac-*.md` рядом со `<skill>.md`)
- `skills/skill/test-acceptance/skill.md` + `cases/test-acceptance.md` — новый скилл-runner
- `commands/skill/test-acceptance.md` — новая команда
- `rules/skill-tdd-coverage.md` — обновить путь и добавить раздел acceptance
- `openspec/changes/install-modes/test-plan.md` — снять флаг `generate_cases: false` (если был добавлен)
