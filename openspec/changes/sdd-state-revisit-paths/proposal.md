## Why

State-машина в `sdd-state` (введена в `merge-verify-into-apply-archive`) сейчас однонаправленная: достигнув `verify-ok`, нельзя вернуться в `verifying` или `applying` для re-execute. Аналогично `contradiction-ok` теряет путь обратно в `contradiction-failed` (хотя formal путь существует через `→ proposed → contradiction-ok` костылём).

Реальный сценарий: после `verify-ok` пользователь обнаружил drift между реализацией и tasks.md (например, поправил файлы вручную после verify), хочет re-verify. Сейчас `state.py transition verify-ok verifying` отвергает с `not allowed`. Workarounds — удалить `.sdd-state.yaml` (теряем историю) или принять inconsistent state и идти в archive (рискованно).

См. `.sdd.yaml` для capability declarations.

## What Changes

- Добавить переходы `verify-ok → verifying` и `verify-ok → applying` для re-execute после изменений.
- Добавить переход `contradiction-ok → applying` уже существует, но также добавить `contradiction-ok → proposed` для случая «вернулся править проprosal/design после прохода contradiction».
- Добавить переход `archive-failed → verify-ok` для случая когда archive упал из-за внешних причин (specs драйфт), но verify исходно прошёл — пользователь хочет повторить archive без re-verify.
- НЕ трогать `archived` — он остаётся terminal.

## Capabilities

### New Capabilities

(нет новых capabilities)

### Modified Capabilities

- `sdd-state`: расширить таблицу разрешённых transitions — добавить revisit-пути от `*-ok` стадий обратно в их предшественники для re-execute. Уточнить в schema, что `*-ok` стадии не являются terminal'ами.

## Impact

**Скрипты:**
- `skills/sdd/scripts/state.py` — расширить `ALLOWED_TRANSITIONS` тремя новыми ребрами:
  - `verify-ok` → `{archiving, verifying, applying}`
  - `contradiction-ok` → `{applying, contradiction-failed, proposed}`
  - `archive-failed` → `{archiving, archived, verify-ok}`

**Документация:**
- Live spec `sdd-state` MODIFIED: обновить Stage transition rules — добавить новые рёбра и описать use-case (re-execute после правок).

**Совместимость:**
- Полностью backward-compatible: новые рёбра только расширяют whitelist, не удаляют существующие.
- Существующие state-files не нуждаются в миграции — текущие stages остаются валидными.

**Внешние зависимости:** нет.
