## Why

`design.md` в openspec имеет рекомендуемую структуру (Technical Approach, Architecture Decisions, Data Flow, File Changes), но без обязательных секций для диаграмм и ссылки на тест-план. `.openspec.yaml` не содержит явного объявления создаваемых и затрагиваемых capabilities. `sdd:contradiction` проверяет только текущий change, а не всю базу спек — противоречия между разными capabilities остаются незамеченными. Нет машиночитаемого индекса спек, поэтому полный обход требует парсинга произвольного markdown.

## What Changes

- Ввести обязательный файл `test-plan.md` в директории change; формат: YAML front matter (approach, acceptance_criteria) + markdown body (scenarios); `sdd:propose` создаёт stub, `sdd:apply` читает как контекст, `sdd:archive` копирует в `openspec/specs/<cap>/`
- Ввести файл `.sdd.yaml` в директории change с полями `creates` (новые capabilities) и `merges-into` (существующие capabilities, в которые мёрджится change); `proposal.md` содержит ссылку на `.sdd.yaml`
- Ввести единый `openspec/specs/index.yaml` — реестр всех финальных спек со ссылками и описаниями
- `sdd:apply` и `sdd:archive` обновляют `openspec/specs/index.yaml` при добавлении новой capability
- `sdd:contradiction` делегирует сбор спек Python-скрипту `contradiction.py`; Claude получает готовый пакет и анализирует на противоречия — см. `specs/contradiction-full-scan/spec.md`
- `sdd:propose` проверяет структуру `design.md` (форматтер) и наличие ссылки на `.sdd.yaml` в `proposal.md`
- Создать `.sdd.yaml` и `test-plan.md` для самого этого change'а (bootstrap-соответствие: change вводит требование и сам его выполняет); заполнить начальный `openspec/specs/index.yaml` пятью capabilities

## Capabilities

### New Capabilities

- `test-plan-link`: обязательный `test-plan.md` в change-директории; YAML front matter (approach, acceptance_criteria) + markdown body (scenarios); создаётся в `sdd:propose`, читается в `sdd:apply`, копируется в `sdd:archive`
- `design-formatter`: форматтер структуры `design.md`
- `proposal-merge-deps`: файл `.sdd.yaml` с полями `creates` и `merges-into`; `proposal.md` ссылается на `.sdd.yaml`
- `spec-index-yaml`: единый `openspec/specs/index.yaml` — реестр всех спек со ссылками и описаниями
- `contradiction-full-scan`: Python-скрипт рядом со скиллом собирает пакет спек по индексу и `.sdd.yaml`; Claude анализирует пакет

### Modified Capabilities

<!-- specs/ пуст, нет существующих спек для модификации -->

## Impact

**`openspec/changes/<name>/test-plan.md`** — `sdd:propose` создаёт stub, `sdd:apply` читает как контекст, `sdd:archive` копирует в `openspec/specs/<capability>/`.
Зачем: явное сохранение подхода к тестированию и acceptance criteria рядом со спекой; после архива служит эталоном при `sdd:spec-verify`.

**`openspec/changes/<name>/.sdd.yaml`** — `sdd:propose` создаёт stub, `sdd:contradiction` читает для определения scope анализа.
Зачем: машиночитаемое объявление того, что создаёт или модифицирует change; позволяет `contradiction.py` точечно загружать нужные спеки.

**`openspec/specs/index.yaml`** — `sdd:apply` добавляет записи, `sdd:archive` синхронизирует, `contradiction.py` читает для сборки пакета.
Зачем: единая точка входа по всем финальным спекам без парсинга произвольного markdown.

**Изменяемые скиллы:** `sdd:propose`, `sdd:apply`, `sdd:archive`, `sdd:contradiction` (+ зеркала в `.claude/skills/sdd/`). Детали — см. `design.md` → Механизм изменения скиллов.

**Новый файл:** `skills/sdd/contradiction.py` — Python-скрипт рядом со скиллом, собирает пакет спек для анализа.

**Документация:** `docs/SKILL_DESIGN.md` — новые артефакты, формат `.sdd.yaml`, `index.yaml`, обязательные секции `design.md`.

**Bootstrap `openspec/changes/sdd-layer-artifacts/.sdd.yaml` и `test-plan.md`** — этот change создаёт собственные `.sdd.yaml` и `test-plan.md` как первый образец нового процесса; одновременно seeds `openspec/specs/index.yaml` пятью capabilities из `creates`.
Зачем: `sdd:archive` блокируется при отсутствии `test-plan.md`; `contradiction.py` требует `index.yaml` для cross-spec анализа будущих changes.
