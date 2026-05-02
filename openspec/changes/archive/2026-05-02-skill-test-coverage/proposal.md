## Why

В проекте 27 скиллов (12 sdd + 10 dev + 3 report + 2 research). Тест-кейсы есть только для 3 sdd-скиллов (`propose`, `contradiction`, `help`) — покрытие ~11%. Стабы `change-missing-test-plan`, `change-with-sdd-yaml`, `specs-with-index` созданы но не используются ни одним кейсом. Скиллы `apply`, `archive`, `change-verify`, все non-sdd пространства имён и все четыре `bump-version` (по одному в каждом namespace) вообще не тестируются, хотя несут критическую логику (блокировка архивирования, обновление index.yaml, верификация задач, dependency resolution).

См. `.sdd.yaml` для machine-readable списка capabilities (creates / merges-into).

## What Changes

- Добавить кейсы для непокрытых sdd-скиллов: `apply`, `archive`, `change-verify`, `audit`, `explore`, `repo`, `spec-verify`, `sync`
- Добавить кейсы для non-sdd пространств имён: `dev`, `report`, `research` — по одному стартовому кейсу на каждый скилл
- Подключить существующие «осиротевшие» стабы (`change-missing-test-plan`, `change-with-sdd-yaml`, `specs-with-index`) к конкретным кейсам
- Переместить `contradiction.py` в `skills/sdd/scripts/` для консистентности с другими неймспейсами
- В `sdd:propose` автоматически заполнять `creates:` в `.sdd.yaml` из `### New Capabilities` proposal.md вместо пустого stub'а
- test-plan.md больше не копируется в `specs/`; вместо этого генерируются semantic test cases в `skills/skill/cases/<namespace>/<capability>/` через скрипт `test-plan-to-cases.py` (см. design.md → D10)
- `design-formatter` приводится к реальной openspec-структуре (Context / Goals / Decisions / Risks); прежний кастом из sdd-layer-artifacts D5 отменяется (см. design.md → D11)
- Переименовать `__dev` → `skill` во всех трёх локациях (`skills/`, `commands/`, `.claude/skills/`)
- Удалить `scripts/install.sh` целиком (см. design.md → D9 для rationale); установка/обновление выполняется только через Claude Code в соответствии с `rules/claude-way.md`
- Добавить кейсы для четырёх `bump-version` скиллов (по одному в каждом namespace: sdd, dev, report, research) (см. design.md → D12)
- Расширить формат stubs: добавить `files:`, `mock_commands:`, `env:` для тестирования сложных сценариев (deploy, build, docker) на моковых данных в изолированной среде (см. design.md → D13)
- Ввести TDD coverage policy: для каждого скилла обязательны 4 категории кейсов (positive-happy, positive-corner, negative-missing-input, negative-invalid-input); проверяется при создании/правке скилла (см. design.md → D14)
- Test execution lifecycle: единый RUN_ROOT через `mktemp -d` + `trap EXIT` (паттерн `bump-namespace.sh`); status.json внутри RUN_ROOT; авто-cleanup устраняет накопление tmp-мусора (см. design.md → D15)
- Документация переструктурирована: `README.md` минималистичный (что это, как установить, список скиллов), старый детальный README → `docs/README_DETAILED.md`, новый `CLAUDE_INSTALL.md` с явной инструкцией для Claude как устанавливать awesome-claude (см. design.md → D16)
- Структура скиллов переорганизована: каждый скилл в отдельной папке `skills/<ns>/<skill>/skill.md` вместо `skills/<ns>/<skill>.md`; скрипты в `<skill>/scripts/`, кейсы в `<skill>/cases/`; касается всех неймспейсов (dev, sdd, report, research) (см. design.md → D17)

## Capabilities

### New Capabilities

- `sdd-apply-cases`: кейсы для `sdd:apply` — чтение test-plan.md как контекста, обновление index.yaml
- `sdd-archive-cases`: кейсы для `sdd:archive` — блокировка при отсутствии test-plan.md, архивирование без копирования test-plan.md в specs/ (per Modified `test-plan-link`), обновление index.yaml
- `sdd-change-verify-cases`: кейсы для `sdd:change-verify` — L1/L2/L3 проверки, human_needed
- `sdd-remaining-cases`: кейсы для `audit`, `explore`, `repo`, `spec-verify`, `sync`
- `dev-namespace-cases`: кейсы для всех `dev:*` скиллов
- `report-namespace-cases`: кейсы для `report:*` скиллов
- `research-namespace-cases`: кейсы для `research:*` скиллов
- `orphan-stubs-wired`: существующие стабы подключены к кейсам
- `skill-namespace-rename`: `__dev` → `skill` во всех трёх локациях (`skills/`, `commands/`, `.claude/skills/`); скиллы переименованы в `skill:test-skill` и `skill:test-all`
- `auto-fill-creates`: `sdd:propose` автоматически заполняет `creates:` в `.sdd.yaml` из `### New Capabilities` proposal.md
- `contradiction-script-location`: `contradiction.py` перемещён в `skills/sdd/scripts/` в соответствии с конвенцией расположения скриптов
- `test-plan-to-semantic-cases`: скрипт `test-plan-to-cases.py` генерирует semantic test cases в `skills/skill/cases/<ns>/<cap>/` из acceptance_criteria в test-plan.md; вызывается в `sdd:apply` после обновления index.yaml
- `claude-way-install-removed`: `scripts/install.sh` удалён; установка/обновление выполняется только через Claude Code в соответствии с `claude-way.md`
- `bump-version-cases`: тест-кейсы для четырёх `bump-version` скиллов (по 2 кейса каждый) в `skills/skill/cases/{sdd,dev,report,research}/bump-version.md`
- `mock-stubs-extended`: расширение формата stubs полями `files:`, `mock_commands:`, `env:`. `skill:test-skill` материализует файлы в `$TMP`, создаёт shim-скрипты в `$TMP/.mocks/` (добавляются в PATH), экспортирует переменные. Позволяет тестировать deploy, build, docker-сценарии на моковых данных
- `skill-tdd-coverage-policy`: обязательная матрица из 4 категорий кейсов на каждый скилл (positive-happy, positive-corner, negative-missing-input, negative-invalid-input); правило `rules/skill-tdd-coverage.md`; `skill:test-all` флагает скиллы с покрытием < 4 категорий; `sdd:propose` (при создании нового скилла) автогенерирует stub-кейсы по 4 категориям
- `test-execution-lifecycle`: единый `RUN_ROOT=$(mktemp -d -t skill-test-XXXXXX)` на весь прогон + `trap "rm -rf $RUN_ROOT" EXIT` для авто-cleanup (паттерн из `bump-namespace.sh`); `$RUN_ROOT/status.json` для отчётности; флаг `--keep-tmp=none|failed-only|all` для отладки
- `docs-refactor-installation`: `README.md` переписан супер-минималистично (70 строк); старый README архивирован в `docs/README_DETAILED.md`; новый `CLAUDE_INSTALL.md` содержит явную инструкцию для Claude как устанавливать awesome-claude из GitHub
- `skills-folder-reorganization`: каждый скилл в отдельной папке; `skills/<ns>/<skill>/skill.md` вместо `skills/<ns>/<skill>.md`; скрипты и кейсы локализованы в папке скилла; касается всех 16 скиллов и всех 4 неймспейсов

### Modified Capabilities

- `test-plan-link` (из sdd-layer-artifacts): `sdd:archive` больше не копирует test-plan.md в `openspec/specs/<capability>/`. Вместо этого генерирует semantic test cases в `skills/skill/cases/<ns>/<cap>/` через `test-plan-to-cases.py` на этапе `sdd:apply`. test-plan.md архивируется (остаётся в `openspec/changes/archive/`) как историческая запись
- `design-formatter` (из sdd-layer-artifacts): обязательные секции наследуются от openspec CLI (`openspec instructions design --json` → template), не кастомные. Структура: `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs` (обязательные); `## Migration Plan`, `## Open Questions` (опциональные). Прежние секции из D5 sdd-layer-artifacts (`Technical Approach`, `Architecture Decisions`, `Data Flow`, `File Changes`) отменяются как несоответствующие реальному openspec-шаблону

## Impact

**`skills/skill/cases/sdd/`** — новые файлы: `apply.md`, `archive.md`, `change-verify.md`, `audit.md`, `explore.md`, `repo.md`, `spec-verify.md`, `sync.md`

**`skills/skill/cases/dev/`** — новая директория, файлы по одному на скилл

**`skills/skill/cases/report/`** — новая директория

**`skills/skill/cases/research/`** — новая директория

**`skills/skill/stubs/`** — существующие стабы используются в новых кейсах; при необходимости добавляются новые

**Зеркала в `.claude/skills/skill/`** обновляются для всех новых файлов
