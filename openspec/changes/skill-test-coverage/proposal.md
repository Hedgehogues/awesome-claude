## Why

В проекте 27 скиллов (12 sdd + 10 dev + 3 report + 2 research). Тест-кейсы есть только для 3 sdd-скиллов (`propose`, `contradiction`, `help`) — покрытие ~11%. Стабы `change-missing-test-plan`, `change-with-sdd-yaml`, `specs-with-index` созданы но не используются ни одним кейсом. Скиллы `apply`, `archive`, `change-verify`, все non-sdd пространства имён и все четыре `bump-version` (по одному в каждом namespace) вообще не тестируются, хотя несут критическую логику (блокировка архивирования, обновление index.yaml, верификация задач, dependency resolution).

См. `.sdd.yaml` для machine-readable списка capabilities (creates / merges-into).

## What Changes

- Добавить кейсы для непокрытых sdd-скиллов: `apply`, `archive`, `change-verify`, `audit`, `explore`, `repo`, `spec-verify`, `sync`
- Добавить кейсы для non-sdd пространств имён: `dev`, `report`, `research` — по одному стартовому кейсу на каждый скилл
- Подключить существующие «осиротевшие» стабы (`change-missing-test-plan`, `change-with-sdd-yaml`, `specs-with-index`) к конкретным кейсам
- Переместить `contradiction.py` в `skills/sdd/scripts/` для консистентности с другими неймспейсами
- В `sdd:propose` автоматически заполнять `creates:` в `.sdd.yaml` из `### New Capabilities` proposal.md вместо пустого stub'а
- **Spec expansion (§11):** test-plan.md больше не копируется в `specs/`; вместо этого генерируются semantic test cases в `skills/skill/cases/<namespace>/<capability>/` через скрипт `test-plan-to-cases.py`. test-plan.md остаётся в архивной директории change'а
- **Spec correction (§12):** `design-formatter` приводится к реальной openspec-структуре (Context / Goals / Decisions / Risks); прежний кастом из sdd-layer-artifacts D5 (Technical Approach / Architecture Decisions / Data Flow / File Changes) отменяется как не из openspec CLI
- Переименовать `__dev` → `skill` во всех трёх локациях (`skills/`, `commands/`, `.claude/skills/`)
- **Scope expansion (§10):** удалить `scripts/install.sh` целиком — обнаружено в §9.7, что shell-скрипт установки противоречит правилу `claude-way.md` (единственный интерфейс — Claude Code). Откат §9.7 (обновление константы в install.sh) + удаление файла
- **Scope expansion (§13):** добавить кейсы для четырёх `bump-version` скиллов (по одному в каждом namespace: sdd, dev, report, research) — обнаружено в ходе coverage-аудита, что namespace-level bump (commit 1dafd1b) не имел тестового покрытия

## Capabilities

### New Capabilities

- `sdd-apply-cases`: кейсы для `sdd:apply` — чтение test-plan.md как контекста, обновление index.yaml
- `sdd-archive-cases`: кейсы для `sdd:archive` — блокировка при отсутствии test-plan.md, копирование test-plan.md в specs/
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
