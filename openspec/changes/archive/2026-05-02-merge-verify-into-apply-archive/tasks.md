## 1. Scripts foundation

- [x] 1.1 Создать `skills/sdd/scripts/state.py` с командами `read`, `update <field> <value>`, `transition <new-stage>`, `delete`. Поддержать at-first-touch создание со `stage: unknown`. Использовать `yaml.safe_load`/`yaml.safe_dump`.
- [x] 1.2 Создать `skills/sdd/scripts/identity.py`: вызывает `claude auth status --json`, парсит `email` при `loggedIn: true`; fallback на `git config user.email`; exit ≠ 0 при недоступности обоих.
- [x] 1.3 Добавить `**/.sdd-state.yaml` в корневой `.gitignore`.
- [x] 1.4 Расширить `skills/sdd/scripts/_sdd_yaml.py` (был только library helper) CLI-командами `read`, `move-capability <change-dir> <name> <from-field> <to-field>`, `set-owner <change-dir> <email>` для безопасной правки `.sdd.yaml`.

## 2. Modify sdd:propose

- [x] 2.1 В `skills/sdd/propose/skill.md` добавить шаг получения identity через `${CLAUDE_SKILL_DIR}/../scripts/identity.py`.
- [x] 2.2 В `skills/sdd/propose/skill.md` добавить шаг создания `.sdd-state.yaml` через `state.py update owner` + `state.py transition proposed`.
- [x] 2.3 В `skills/sdd/propose/skill.md` добавить инициализацию `owner:` в `.sdd.yaml` через `_sdd_yaml.py set-owner`.
- [x] 2.4 В `skills/sdd/propose/skill.md` добавить шаг merge-dialog: после генерации `.sdd.yaml` сравнить `creates:` с `openspec/specs/index.yaml`, для каждого пересечения вызвать AskUserQuestion с двумя опциями (creates/merges-into). При выборе merges-into — `_sdd_yaml.py move-capability`.

## 3. Modify sdd:contradiction

- [x] 3.1 В `skills/sdd/contradiction/skill.md` добавить identity-check в начало: вызвать `identity.py`, сравнить с `owner:` из `.sdd.yaml`, при несовпадении — warning + opt-in перезапись через `_sdd_yaml.py set-owner`.
- [x] 3.2 В `skills/sdd/contradiction/skill.md` добавить state-update в конце: при отсутствии hard issues — `transition contradiction-ok`; при наличии — `transition contradiction-failed`.

## 4. Merge change-verify into sdd:apply

- [x] 4.1 В `skills/sdd/apply/skill.md` добавить identity-check в начало (как в contradiction.md, шаг 3.1).
- [x] 4.2 В `skills/sdd/apply/skill.md` добавить state-transition `applying` перед вызовом `openspec-apply-change`.
- [x] 4.3 В `skills/sdd/apply/skill.md` инлайн-скопировать секции L1/L2/L3 verifier из `skills/sdd/change-verify/skill.md` (Task verification loop, L2 stub detection, L3 wiring heuristics, group aggregation, absence check, coverage smoke review). Источник списка задач — `tasks.md` текущего change'а.
- [x] 4.4 В `skills/sdd/apply/skill.md` добавить state-transition `verifying` перед запуском verify, и `verify-ok | verify-failed` после.
- [x] 4.5 В `skills/sdd/apply/skill.md` обернуть существующий шаг update `openspec/specs/index.yaml` в условие `stage == verify-ok` — при `verify-failed` пропустить и остановить workflow.
- [x] 4.6 Добавить marker-комментарий `<!-- KEEP IN SYNC: skills/sdd/archive/skill.md verify section -->` в начало verify-секции `apply/skill.md`.
- [x] 4.7 Удалить директорию `skills/sdd/change-verify/` целиком (skill.md, cases/).
- [x] 4.8 Удалить `commands/sdd/change-verify.md`.

## 5. Merge spec-verify into sdd:archive

- [x] 5.1 В `skills/sdd/archive/skill.md` добавить identity-check в начало.
- [x] 5.2 В `skills/sdd/archive/skill.md` добавить state-transition `archiving` перед вызовом `openspec-archive-change`.
- [x] 5.3 В `skills/sdd/archive/skill.md` инлайн-скопировать секции L1/L2/L3 verifier из `skills/sdd/spec-verify/skill.md` после шага merge specs. Источник Requirements — live `openspec/specs/<cap>/spec.md`. Включить REMOVED-инверсию (L1 pass = файл не существует).
- [x] 5.4 В `skills/sdd/archive/skill.md` добавить логику red-banner при verify-fail после merge: вывести точный текст banner, transition state на `archive-failed`, остановиться без авто-rollback.
- [x] 5.5 В `skills/sdd/archive/skill.md` добавить финальный шаг `state.py delete` после успешной архивации (только при stage=archived). Учитывать, что test-plan.md теперь НЕ копируется в openspec/specs/ (новая логика после restructure).
- [x] 5.6 Добавить marker-комментарий `<!-- KEEP IN SYNC: skills/sdd/apply/skill.md verify section -->` в начало verify-секции `archive/skill.md`.
- [x] 5.7 Удалить директорию `skills/sdd/spec-verify/` целиком (skill.md, cases/).
- [x] 5.8 Удалить `commands/sdd/spec-verify.md`.

## 6. Update help and documentation

- [x] 6.1 В `skills/sdd/help/skill.md` обновить хардкодированный pipeline: убрать `/sdd:change-verify` и `/sdd:spec-verify`, перенумеровать оставшиеся шаги.
- [x] 6.2 В `skills/sdd/help/skill.md` обновить алгоритм сборки pipeline (workflow_step индексы): теперь `apply=6`, `archive=7`, `audit=[8]`. Изменить также frontmatter `workflow_step` в `apply/skill.md` (был 6) и `archive/skill.md` (был 8 → 7).
- [x] 6.3 В `README.md` обновить mermaid-диаграмму workflow: убрать узлы CV (`/sdd:change-verify`) и SV (`/sdd:spec-verify`), оставить прямые рёбра `apply → archive`.
- [x] 6.4 В `README.md` обновить таблицу команд: убрать строки `/sdd:change-verify` и `/sdd:spec-verify`. Добавить пометку «verify теперь часть apply/archive» в описаниях `/sdd:apply` и `/sdd:archive`.

## 7. Test cases для новых поведений

- [x] 7.1 Расширить `skills/sdd/apply/cases/apply.md`: добавить `identity-mismatch-warning` (стаб `change-other-owner`), `resume-from-verifying` (стаб `change-verifying-state`), `verify-failed-no-index-update` (стаб `change-verify-failed`), `keep-in-sync-marker-present` (semantic — verify section содержит маркер `KEEP IN SYNC` со ссылкой на archive)
- [x] 7.2 Расширить `skills/sdd/archive/cases/archive.md`: добавить `removed-req-file-gone-pass` (стаб `change-with-removed-req-no-file`), `removed-req-file-remains-fail` (стаб `change-with-removed-req-file-present`), `verify-fail-red-banner` (стаб с заведомо проваленным Requirement), `state-deleted-on-success`, `state-preserved-on-archive-fail`
- [x] 7.3 Расширить `skills/sdd/propose/cases/propose.md`: добавить `state-file-created-proposed` (semantic — после propose в директории есть `.sdd-state.yaml stage=proposed`), `owner-initialized-from-identity`, `merge-dialog-collision` (стаб `creates-collision` с пересечением `creates:` и `index.yaml`), `index-yaml-not-modified` (semantic — `git diff openspec/specs/index.yaml` после propose возвращает 0)
- [x] 7.4 Расширить `skills/sdd/contradiction/cases/contradiction.md`: добавить `state-transition-on-no-issues` (semantic — stage=contradiction-ok после прогона без hard issues), `state-transition-on-hard-issues` (semantic — stage=contradiction-failed), `identity-warn-other-owner` (стаб `change-other-owner`)
- [x] 7.5 Расширить `skills/sdd/help/cases/help.md`: добавить `no-change-verify-in-pipeline` (semantic — вывод не упоминает `/sdd:change-verify`), `no-spec-verify-in-pipeline`, `workflow-step-indices-updated` (semantic — apply=6, archive=7 в выводе)

## 8. Stubs для новых тест-кейсов

- [x] 8.1 `skills/skill/test-skill/stubs/change-other-owner.md` — change с `.sdd.yaml owner=other@example.com`, текущий identity отличается
- [x] 8.2 `skills/skill/test-skill/stubs/change-verifying-state.md` — change с `.sdd-state.yaml stage=verifying`, частично выполненными задачами
- [x] 8.3 `skills/skill/test-skill/stubs/change-verify-failed.md` — change с `.sdd-state.yaml stage=verify-failed`, missing/partial задачами
- [x] 8.4 `skills/skill/test-skill/stubs/change-with-removed-req-no-file.md` — change с `## REMOVED Requirements` в spec.md, упоминаемого файла нет на диске (для L1 inverted pass)
- [x] 8.5 `skills/skill/test-skill/stubs/change-with-removed-req-file-present.md` — change с `## REMOVED Requirements`, но упоминаемый файл всё ещё на диске (для L1 inverted fail)
- [x] 8.6 `skills/skill/test-skill/stubs/creates-collision.md` — change с `.sdd.yaml creates: [existing-cap]` + `openspec/specs/index.yaml` содержащий `existing-cap` (для merge-dialog test)
- [x] 8.7 Использовать существующий `change-with-sdd-yaml` стаб для legacy-change тест-кейсов (он не содержит `.sdd-state.yaml` — подходит для at-first-touch проверки)

## 9. Integration & verification (manual, post-implementation)

- [x] 9.1 Прогнать `/sdd:contradiction PATH=openspec/changes/merge-verify-into-apply-archive/` после внесения всех правок — убедиться, что hard issues = 0.
- [ ] 9.2 Прогнать вручную полный workflow на тестовом change'е: `/sdd:propose test-resume → /sdd:contradiction → /sdd:apply → /sdd:archive`. Проверить, что `.sdd-state.yaml` создаётся, обновляется на каждом шаге, удаляется в конце успешного archive.
- [ ] 9.3 Прогнать сценарий обрыва: после `/sdd:apply` (verify-failed) запустить `/sdd:apply` повторно — убедиться, что resume происходит с шага verify, не повторяет реализацию.
- [ ] 9.4 Прогнать сценарий ownership: создать change, поменять `git config user.email` (или `claude auth status` mock), запустить `/sdd:contradiction` — убедиться, что warning выводится и opt-in работает.
- [ ] 9.5 Прогнать сценарий merge-dialog: создать change с `creates:` пересекающимся с существующей capability в `openspec/specs/index.yaml`, убедиться, что AskUserQuestion вызывается и выбор «merges-into» корректно обновляет `.sdd.yaml`.
- [ ] 9.6 Прогнать сценарий archive-fail: подготовить change с заведомо невыполнимым Requirement в spec, запустить `/sdd:archive` — убедиться, что red-banner выводится, state остаётся `archive-failed`, файлы specs не откатываются автоматически.

## 10. Bump version

- [x] 10.1 Запустить `/sdd:bump-version` для namespace `sdd` (изменения breaking, мажорный либо минорный bump в зависимости от текущей версии). Обновить `skills/sdd/.manifest`.
- [x] 10.2 Обновить `CHANGELOG.md` если существует — иначе создать с записью о breaking changes (удаление `/sdd:change-verify`, `/sdd:spec-verify`).

## 11. Cross-spec cleanup (downstream of BREAKING removal)

- [x] 11.1 Создать delta-spec `specs/sdd-change-verify-cases/spec.md` с REMOVED Requirement (миграция в `sdd-apply-cases`).
- [x] 11.2 Создать delta-spec `specs/sdd-remaining-cases/spec.md` с MODIFIED Requirement (убрать `spec-verify` из списка 5 скиллов).
- [x] 11.3 Создать delta-spec `specs/sdd-apply-cases/spec.md` с ADDED 3 сценарии (passed / gaps_found / human_needed) — приехали из удалённого change-verify.
- [x] 11.4 Создать delta-spec `specs/sdd-archive-cases/spec.md` с ADDED 3 сценария (passed / REMOVED-инверсия / archive-fail) — приехали из удалённой логики spec-verify.
- [x] 11.5 Дополнить `.sdd.yaml` — `merges-into: [sdd-change-verify-cases, sdd-remaining-cases, sdd-apply-cases, sdd-archive-cases]`.
- [x] 11.6 Обновить `proposal.md` → `### Modified Capabilities` с описанием 4 затронутых live-spec'ов.
