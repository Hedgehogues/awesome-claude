## 1. sdd:apply и sdd:archive

- [x] 1.1 Создать `skills/skill/cases/sdd/apply.md` — 2 кейса: happy path (stub `change-with-sdd-yaml`, test-plan читается, index.yaml обновляется) + no-.sdd.yaml (stub `fresh-repo`, шаг index пропускается)
- [x] 1.2 Создать `skills/skill/cases/sdd/archive.md` — 3 кейса: blocking при отсутствии test-plan.md (stub `change-missing-test-plan`), happy path с копированием test-plan.md в specs/ (stub `change-with-sdd-yaml`), обновление index.yaml (stub `change-with-sdd-yaml`)
- [x] 1.3 Зеркалить в `.claude/skills/skill/cases/sdd/`

## 2. sdd:change-verify

- [x] 2.1 Создать `skills/skill/cases/sdd/change-verify.md` — 3 кейса: все задачи done → passed, missing artifact → gaps_found, human_needed задача
- [x] 2.2 Добавить/расширить стаб для change-verify если необходимо (существующих хватило)
- [x] 2.3 Зеркалить в `.claude/skills/skill/cases/sdd/`

## 3. Оставшиеся sdd-скиллы

- [x] 3.1 Создать `skills/skill/cases/sdd/audit.md` — 2 кейса
- [x] 3.2 Создать `skills/skill/cases/sdd/explore.md` — 2 кейса
- [x] 3.3 Создать `skills/skill/cases/sdd/repo.md` — 2 кейса
- [x] 3.4 Создать `skills/skill/cases/sdd/spec-verify.md` — 2 кейса
- [x] 3.5 Создать `skills/skill/cases/sdd/sync.md` — 2 кейса
- [x] 3.6 Зеркалить в `.claude/skills/skill/cases/sdd/`

## 4. dev namespace

- [x] 4.1 Создать директорию `skills/skill/cases/dev/`
- [x] 4.2 Создать `commit.md`, `dead-features.md`, `deploy.md`, `fix-bug.md`, `fix-tests.md` — по 2 кейса каждый
- [x] 4.3 Создать `init-repo.md`, `tdd.md`, `test-all.md`, `tracing.md` — по 2 кейса каждый
- [x] 4.4 Зеркалить в `.claude/skills/skill/cases/dev/`

## 5. report и research namespaces

- [x] 5.1 Создать директорию `skills/skill/cases/report/`
- [x] 5.2 Создать `describe.md`, `session-report.md` — по 2 кейса
- [x] 5.3 Создать директорию `skills/skill/cases/research/`
- [x] 5.4 Создать `triz.md` — 2 кейса
- [x] 5.5 Зеркалить в `.claude/skills/skill/cases/report/` и `research/`

## 6. Подключение осиротевших стабов

- [x] 6.1 Убедиться что `change-missing-test-plan` используется в `archive.md` (задача 1.2) ✓
- [x] 6.2 Убедиться что `change-with-sdd-yaml` используется в `apply.md` и `archive.md` ✓
- [x] 6.3 Добавить кейс в `contradiction.md` или `apply.md` со stub `specs-with-index`
- [x] 6.4 Зеркалить обновлённые файлы в `.claude/skills/skill/`

## 7. Переместить contradiction.py в scripts/ (spec: contradiction-script-location)

- [x] 7.1 Переместить `skills/sdd/contradiction.py` → `skills/sdd/scripts/contradiction.py`
- [x] 7.2 Переместить `.claude/skills/sdd/contradiction.py` → `.claude/skills/sdd/scripts/contradiction.py`
- [x] 7.3 Обновить путь в `skills/sdd/contradiction.md` и зеркале: `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`
- [ ] 7.4 Обновить путь в `design.md` D6 change'а `sdd-layer-artifacts` (архив) — не обязательно, файл в архиве
- [x] 7.5 Обновить `openspec/specs/contradiction-full-scan/spec.md:4` — заменить «(located next to the skill)» на «(at `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`)»

## 8. Автозаполнение creates: в sdd:propose

- [x] 8.1 В `skills/sdd/propose.md`: после генерации `proposal.md` читать `### New Capabilities` и заполнять `creates:` в `.sdd.yaml` именами capabilities (вместо пустого `creates: []`)
- [x] 8.2 Зеркалить в `.claude/skills/sdd/propose.md`

## 9. Переименование __dev → skill

- [x] 9.1 Переименовать `skills/__dev/` → `skills/skill/`
- [x] 9.2 Переименовать `commands/__dev/` → `commands/skill/`
- [x] 9.3 Переименовать `.claude/skills/__dev/` → `.claude/skills/skill/`
- [x] 9.4 Обновить `name:` в `skills/skill/test-skill.md` и `test-all.md`: `__dev:test-skill` → `skill:test-skill`, `__dev:test-all` → `skill:test-all`
- [x] 9.5 Обновить `name:` в зеркалах `.claude/skills/skill/`
- [x] 9.6 Обновить все ссылки на `__dev:` в `skills/__dev/cases/` (упоминания в кейсах)
- [x] 9.7 В `scripts/install.sh`: `DEV_COMPONENTS="__dev"` → `DEV_COMPONENTS="skill"` ⚠️ superseded by §10 (install.sh удаляется целиком)
- [x] 9.8 Обновить пути в `specs/orphan-stubs-wired/spec.md` этого change'а: `skills/__dev/` → `skills/skill/` (уже сделано в рамках contradiction-check)

## 10. Удаление install.sh (spec: claude-way-install-removed)

**Контекст:** обнаружено в §9.7, что обновление константы в `install.sh` противоречит правилу `claude-way.md` («единственный интерфейс — Claude Code»). install.sh — публичный shell-скрипт для установки, не часть Claude-only flow. Откат §9.7 + полное удаление.

- [ ] 10.1 Удалить `scripts/install.sh`
- [ ] 10.2 Удалить упоминания `install.sh` в `README.md` и заменить на инструкции через Claude Code
- [ ] 10.3 Проверить остальные файлы (`docs/`, `.claude/`) на ссылки на `install.sh` и удалить/заменить
- [x] 10.4 Обновить `proposal.md`: добавить пункт о scope expansion с обоснованием

## 11. test-plan → semantic test cases (spec: test-plan-to-semantic-cases + Modified test-plan-link)

**Контекст:** test-plan.md содержит acceptance_criteria, которые должны стать semantic cases для `skill:test-skill`. Вместо копирования test-plan в specs/, генерируем `skills/skill/cases/<namespace>/<capability>/<ac_id>.md` из front matter test-plan'а.

- [ ] 11.1 Скрипт `skills/sdd/scripts/test-plan-to-cases.py`: парсит test-plan.md front matter (approach, acceptance_criteria), генерирует .md case-файлы
- [ ] 11.2 Формат generated case: `## Case: <ac_id>` + stub (по умолчанию `fresh-repo`), semantic assertions из acceptance criterion
- [ ] 11.3 `sdd:apply`: после обновления index.yaml вызывает test-plan-to-cases.py, генерирует cases в `skills/skill/cases/<ns>/<cap>/`
- [ ] 11.4 `sdd:archive`: **не копирует** test-plan.md в specs/, оставляет test-plan.md в архивной директории change'а как историческую запись
- [x] 11.5 Обновить proposal.md: добавить Modified Capability `test-plan-link` (меняется поведение sdd:archive)
- [ ] 11.6 Обновить кейс в `skills/skill/cases/sdd/apply.md`: проверить, что cases генерируются в skills/skill/cases/
- [ ] 11.7 Зеркалить script в `.claude/skills/sdd/scripts/`

## 12. design-formatter — наследовать секции от openspec (spec: Modified design-formatter)

**Контекст:** sdd-layer-artifacts D5 декларировал четыре секции (`Technical Approach`, `Architecture Decisions`, `Data Flow`, `File Changes`) — но это кастомные имена, не из openspec. Реальный шаблон openspec (`openspec instructions design --json`): Context, Goals/Non-Goals, Decisions, Risks/Trade-offs (обязательные) + Migration Plan, Open Questions (опциональные). Все existing change'ы в проекте используют openspec-template, а не кастомные секции D5. Привести design-formatter к реальности.

- [ ] 12.1 Скрипт `skills/sdd/scripts/check-design.py`: парсит design.md, проверяет наличие 4 обязательных секций (`## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`)
- [ ] 12.2 `sdd:propose`: после генерации design.md вызывает check-design.py; если секций нет — блокирует (как `sdd:archive` блокирует на отсутствии test-plan)
- [ ] 12.3 Обновить `skills/sdd/propose.md` (+зеркало): добавить шаг проверки структуры design.md
- [x] 12.4 Обновить proposal.md этого change'а: добавить Modified Capability `design-formatter`
- [ ] 12.5 Кейс в `skills/skill/cases/sdd/propose.md`: change с design.md без обязательных секций → блокировка
- [ ] 12.6 Зеркалить script в `.claude/skills/sdd/scripts/`

## 13. bump-version cases (spec: bump-version-cases)

**Контекст:** обнаружено в coverage-аудите, что namespace-level `bump-version` (commit 1dafd1b) не имел тестового покрытия — по одному `bump-version.md` в каждом из четырёх namespace'ов (sdd, dev, report, research) без cases.

- [ ] 13.1 Создать `skills/skill/cases/sdd/bump-version.md` — 2 кейса (happy + edge: missing .versions)
- [ ] 13.2 Создать `skills/skill/cases/dev/bump-version.md` — 2 кейса
- [ ] 13.3 Создать `skills/skill/cases/report/bump-version.md` — 2 кейса
- [ ] 13.4 Создать `skills/skill/cases/research/bump-version.md` — 2 кейса
- [ ] 13.5 Зеркалить в `.claude/skills/skill/cases/{sdd,dev,report,research}/bump-version.md`
