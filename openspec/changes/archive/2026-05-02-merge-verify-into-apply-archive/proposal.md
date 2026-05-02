## Why

Текущий SDD-pipeline фрагментирован: `sdd:apply` и `sdd:change-verify` — два соседних шага, между которыми нет машинной связи; то же между `sdd:archive` и `sdd:spec-verify`. Пользователь обязан помнить порядок и явно вызывать verify руками. При обрыве сессии состояние workflow выводится из косвенных признаков (чекбоксы tasks.md, git status), что хрупко. Авторство change'ей нигде не зафиксировано — нельзя предупредить, что зашёл в чужой change.

Цель: свернуть verify-шаги внутрь apply/archive (один пользовательский вызов = один логический шаг), ввести явный `.sdd-state.yaml` для resume и source of truth по статусу, и добавить владельца change'а с identity из `claude auth status`.

См. `.sdd.yaml` для capability declarations.

## What Changes

- **BREAKING**: Удаляется `/sdd:change-verify` как отдельная команда — её L1/L2/L3 логика инлайнится в `/sdd:apply` как обязательный шаг после реализации.
- **BREAKING**: Удаляется `/sdd:spec-verify` как отдельная команда — её логика (включая REMOVED-инверсию) инлайнится в `/sdd:archive` как шаг после merge specs.
- Вводится `.sdd-state.yaml` в директории каждого change: пишется на каждом шаге workflow (propose → contradiction → apply → archive), удаляется последним шагом успешного archive. Файл gitignored.
- Вводится поле `owner:` в `.sdd.yaml` — единственный владелец change'а, идентичность берётся из `claude auth status` (поле `email`), fallback на `git config user.email`.
- При попытке другого автора зайти в чужой change — warning «это change такого-то, перезаписать на тебя?». Перезапись только по согласию.
- `/sdd:propose` дополняется merge-dialog: если capability из `creates:` пересекается с уже существующей в `openspec/specs/index.yaml` — спрашиваем «использовать как `merges-into:` вместо новой?».
- При неудачном verify внутри `/sdd:archive` (specs уже merged, но проверка fail) — скилл выводит выделенное сообщение «specs изменены, восстанови через `git restore openspec/specs/` или заведи новый change через `/sdd:propose`». Без автоматического rollback-скрипта.

## Capabilities

### New Capabilities
- `sdd-apply`: `/sdd:apply` со встроенной L1/L2/L3 верификацией по `tasks.md` и обновлением `.sdd-state.yaml` на каждом подшаге.
- `sdd-archive`: `/sdd:archive` со встроенной L1/L2/L3 верификацией по live-spec, REMOVED-инверсией, и удалением `.sdd-state.yaml` финальным шагом.
- `sdd-state`: lifecycle файла `.sdd-state.yaml` — формат, переходы стадий, gitignore-политика, удаление при success, persistence при failure.
- `sdd-ownership`: формат `owner:` в `.sdd.yaml`, identity-resolution через `claude auth status` с fallback на git, warning при несовпадении и opt-in перезапись.
- `sdd-propose-merge-dialog`: проверка пересечений `creates:` с `openspec/specs/index.yaml` в `/sdd:propose` и интерактивный выбор переключения на `merges-into:`.

### Modified Capabilities

- `sdd-change-verify-cases`: REMOVED целиком (capability теряет смысл — скилл удалён, его сценарии переезжают в `sdd-apply-cases`).
- `sdd-remaining-cases`: MODIFIED — убрать `spec-verify` из списка 5 скиллов (остаются 4: `audit, explore, repo, sync`).
- `sdd-apply-cases`: ADDED — три сценария inline-verify (passed / gaps_found / human_needed), приехали из удалённого `sdd-change-verify-cases`.
- `sdd-archive-cases`: ADDED — три сценария inline spec-verify (passed / REMOVED-инверсия / archive-fail с red-banner), приехали из удалённой логики `sdd:spec-verify`.

## Impact

**Скиллы:**
- `skills/sdd/apply.md` — крупная ревизия (+ инлайн tasks-verify, + state-file updates).
- `skills/sdd/archive.md` — крупная ревизия (+ инлайн spec-verify, + удаление state-file).
- `skills/sdd/propose.md` — добавляются: создание `.sdd-state.yaml`, инициализация `owner:`, merge-dialog.
- `skills/sdd/contradiction.md` — добавляется обновление `.sdd-state.yaml` (`stage: contradiction-ok | contradiction-failed`).
- `skills/sdd/help.md` — убираются упоминания `/sdd:change-verify` и `/sdd:spec-verify` из pipeline.

**Удаляемые файлы:**
- `skills/sdd/change-verify.md`
- `skills/sdd/spec-verify.md`
- `commands/sdd/change-verify.md`
- `commands/sdd/spec-verify.md`

**Новые файлы:**
- `skills/sdd/scripts/state.py` — read/update/delete для `.sdd-state.yaml`.
- `skills/sdd/scripts/identity.py` — `claude auth status` → email с fallback на `git config user.email`.

**Конфигурация:**
- `.gitignore` — добавляется паттерн `**/.sdd-state.yaml`.

**Документация:**
- `README.md` — обновляется диаграмма pipeline (убираются отдельные verify-узлы).

**Внешние зависимости:**
- Используется CLI `claude auth status` (subcommand `auth status` существует в Claude Code 2.1+).
- `git config user.email` — fallback, доступен в любом git-репозитории.

**Совместимость:**
- Существующие changes без `.sdd-state.yaml` продолжают работать — state-file создаётся at-first-touch следующим вызванным скиллом.
- Существующие `.sdd.yaml` без `owner:` — поле добавляется при первом проходе через любой sdd-скилл.
