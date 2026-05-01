## 1. Scripts foundation

- [ ] 1.1 Создать `skills/sdd/scripts/state.py` с командами `read`, `update <field> <value>`, `transition <new-stage>`, `delete`. Поддержать at-first-touch создание со `stage: unknown`. Использовать `yaml.safe_load`/`yaml.safe_dump`.
- [ ] 1.2 Создать `skills/sdd/scripts/identity.py`: вызывает `claude auth status --json`, парсит `email` при `loggedIn: true`; fallback на `git config user.email`; exit ≠ 0 при недоступности обоих.
- [ ] 1.3 Добавить unit-тесты для `state.py` (transition правила, at-first-touch, delete idempotent) и `identity.py` (mock subprocess.run для `claude` и `git`). Положить в `tests/scripts/` если структуры нет — создать.
- [ ] 1.4 Добавить `**/.sdd-state.yaml` в корневой `.gitignore`.

## 2. Modify sdd:propose

- [ ] 2.1 В `skills/sdd/propose.md` добавить шаг создания `.sdd-state.yaml` через `state.py` со `stage: proposed`, `owner: <email из identity.py>`, `last_step_at: <ISO timestamp>`.
- [ ] 2.2 В `skills/sdd/propose.md` добавить инициализацию `owner:` в `.sdd.yaml` (рядом с `creates:`/`merges-into:`).
- [ ] 2.3 В `skills/sdd/propose.md` добавить шаг merge-dialog: после генерации `.sdd.yaml` сравнить `creates:` с `openspec/specs/index.yaml`, для каждого пересечения вызвать AskUserQuestion с двумя опциями (creates/merges-into). При выборе merges-into — вызвать скрипт обновления YAML.
- [ ] 2.4 Создать вспомогательный скрипт `skills/sdd/scripts/sdd_yaml.py` (или расширить `state.py`) с командой `move-capability <path> <name> <from-field> <to-field>` для безопасной правки `.sdd.yaml`.

## 3. Modify sdd:contradiction

- [ ] 3.1 В `skills/sdd/contradiction.md` добавить identity-check в начало: вызвать `identity.py`, сравнить с `owner:`, при несовпадении — warning + opt-in перезапись.
- [ ] 3.2 В `skills/sdd/contradiction.md` добавить state-update в конце: при отсутствии hard issues — `transition contradiction-ok`; при наличии — `transition contradiction-failed`.

## 4. Merge change-verify into sdd:apply

- [ ] 4.1 В `skills/sdd/apply.md` добавить identity-check в начало (как в contradiction.md, шаг 3.1).
- [ ] 4.2 В `skills/sdd/apply.md` добавить state-transition `applying` перед вызовом `openspec-apply-change`.
- [ ] 4.3 В `skills/sdd/apply.md` инлайн-скопировать секции L1/L2/L3 verifier из `skills/sdd/change-verify.md` (Task verification loop, L2 stub detection, L3 wiring heuristics, group aggregation, absence check, coverage smoke review). Источник списка задач — `tasks.md` текущего change'а.
- [ ] 4.4 В `skills/sdd/apply.md` добавить state-transition `verifying` перед запуском verify, и `verify-ok | verify-failed` после.
- [ ] 4.5 В `skills/sdd/apply.md` обернуть существующий шаг update `openspec/specs/index.yaml` в условие `stage == verify-ok` — при `verify-failed` пропустить и остановить workflow.
- [ ] 4.6 Добавить marker-комментарий `<!-- KEEP IN SYNC: skills/sdd/archive.md verify section -->` в начало verify-секции `apply.md`.
- [ ] 4.7 Удалить `skills/sdd/change-verify.md`.
- [ ] 4.8 Удалить `commands/sdd/change-verify.md`.

## 5. Merge spec-verify into sdd:archive

- [ ] 5.1 В `skills/sdd/archive.md` добавить identity-check в начало.
- [ ] 5.2 В `skills/sdd/archive.md` добавить state-transition `archiving` перед вызовом `openspec-archive-change`.
- [ ] 5.3 В `skills/sdd/archive.md` инлайн-скопировать секции L1/L2/L3 verifier из `skills/sdd/spec-verify.md` после шага merge specs. Источник Requirements — live `openspec/specs/<cap>/spec.md`. Включить REMOVED-инверсию (L1 pass = файл не существует).
- [ ] 5.4 В `skills/sdd/archive.md` добавить логику red-banner при verify-fail после merge: вывести точный текст banner, transition state на `archive-failed`, остановиться без авто-rollback.
- [ ] 5.5 В `skills/sdd/archive.md` добавить финальный шаг `state.py delete` после успешного copy `test-plan.md` (только при stage=archived).
- [ ] 5.6 Добавить marker-комментарий `<!-- KEEP IN SYNC: skills/sdd/apply.md verify section -->` в начало verify-секции `archive.md`.
- [ ] 5.7 Удалить `skills/sdd/spec-verify.md`.
- [ ] 5.8 Удалить `commands/sdd/spec-verify.md`.

## 6. Update help and documentation

- [ ] 6.1 В `skills/sdd/help.md` обновить хардкодированный pipeline: убрать `/sdd:change-verify` и `/sdd:spec-verify`, перенумеровать оставшиеся шаги.
- [ ] 6.2 В `skills/sdd/help.md` обновить алгоритм сборки pipeline (workflow_step индексы): теперь `apply=6`, `archive=7`, `audit=[8]`. Изменить также frontmatter `workflow_step` в `apply.md` (был 6) и `archive.md` (был 8 → 7).
- [ ] 6.3 В `README.md` обновить mermaid-диаграмму workflow: убрать узлы CV (`/sdd:change-verify`) и SV (`/sdd:spec-verify`), оставить прямые рёбра `apply → archive`.
- [ ] 6.4 В `README.md` обновить таблицу команд: убрать строки `/sdd:change-verify` и `/sdd:spec-verify`. Добавить пометку «verify теперь часть apply/archive» в описаниях `/sdd:apply` и `/sdd:archive`.

## 7. Integration & verification

- [ ] 7.1 Прогнать `/sdd:contradiction PATH=openspec/changes/merge-verify-into-apply-archive/` после внесения всех правок — убедиться, что hard issues = 0.
- [ ] 7.2 Прогнать вручную полный workflow на тестовом change'е: `/sdd:propose test-resume → /sdd:contradiction → /sdd:apply → /sdd:archive`. Проверить, что `.sdd-state.yaml` создаётся, обновляется на каждом шаге, удаляется в конце успешного archive.
- [ ] 7.3 Прогнать сценарий обрыва: после `/sdd:apply` (verify-failed) запустить `/sdd:apply` повторно — убедиться, что resume происходит с шага verify, не повторяет реализацию.
- [ ] 7.4 Прогнать сценарий ownership: создать change, поменять `git config user.email` (или `claude auth status` mock), запустить `/sdd:contradiction` — убедиться, что warning выводится и opt-in работает.
- [ ] 7.5 Прогнать сценарий merge-dialog: создать change с `creates:` пересекающимся с существующей capability в `openspec/specs/index.yaml`, убедиться, что AskUserQuestion вызывается и выбор «merges-into» корректно обновляет `.sdd.yaml`.
- [ ] 7.6 Прогнать сценарий archive-fail: подготовить change с заведомо невыполнимым Requirement в spec, запустить `/sdd:archive` — убедиться, что red-banner выводится, state остаётся `archive-failed`, файлы specs не откатываются автоматически.

## 8. Bump version

- [ ] 8.1 Запустить `/sdd:bump-version` для namespace `sdd` (изменения breaking, мажорный либо минорный bump в зависимости от текущей версии 0.6.0). Обновить `skills/sdd/.manifest`.
- [ ] 8.2 Обновить `CHANGELOG.md` если существует — иначе создать с записью о breaking changes (удаление `/sdd:change-verify`, `/sdd:spec-verify`).
