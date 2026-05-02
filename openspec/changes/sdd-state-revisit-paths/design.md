## Context

State-машина введена в change `merge-verify-into-apply-archive` (capability `sdd-state`) с однонаправленным потоком: `proposed → contradiction-* → applying → verifying → verify-* → archiving → archived`. Идея: workflow линейный, каждый шаг увеличивает «зрелость» change'а.

На практике пользователи часто возвращаются к предыдущему шагу:
- После `verify-ok` обнаруживают, что одна задача забыта → правят, хотят re-verify без archive.
- После `contradiction-ok` хотят добавить новый Decision в design.md → нужно re-run contradiction.
- После `archive-failed` (например, упало из-за внешней причины — git conflict в openspec/specs/) пользователь чинит окружение и хочет повторить archive без полного re-run apply.

Сейчас все эти сценарии либо невозможны (state.py отвергает), либо требуют удаления `.sdd-state.yaml` целиком (теряется owner, верифай-история).

См. `proposal.md` для What Changes и `.sdd.yaml` для capability declarations.

## Goals / Non-Goals

**Goals:**
- Разрешить re-execute от `*-ok` стадий обратно в их предшественники без потери state-файла.
- Сохранить семантику `archived` как terminal (single-direction после успешной архивации).
- Backward-compat: новые рёбра только расширяют whitelist.

**Non-Goals:**
- Тотальный пересмотр state-машины (например, переход в любую стадию из любой).
- Auto-rollback state на основе изменений в файлах (это про другой механизм).
- Удаление существующих рёбер.

## Technical Approach

Изменение в `state.py` — расширение `ALLOWED_TRANSITIONS` dict тремя новыми вершинами:

```python
ALLOWED_TRANSITIONS = {
    ...
    "contradiction-ok": {"applying", "contradiction-failed", "proposed"},  # +proposed
    ...
    "verify-ok": {"archiving", "verifying", "applying"},  # +verifying, +applying
    ...
    "archive-failed": {"archiving", "archived", "verify-ok"},  # +verify-ok
}
```

Никаких других изменений в коде. Live spec `sdd-state` MODIFIED — таблица переходов обновляется.

## Decisions

### D1 — verify-ok разрешает обратно в verifying и applying

`ALLOWED_TRANSITIONS["verify-ok"]` SHALL включать `verifying` (re-verify без re-apply) и `applying` (re-implement, например после code drift).

**Why:** Самый частый use-case — мелкая правка кода после verify-ok, и желание перепроверить без полного apply.

**Alternatives considered:**
- Только `verifying`: не покрывает кейс «забыл создать файл, надо вернуться в applying».
- Универсальный `*-ok → previous`: слишком широко, размывает контракт.

### D2 — contradiction-ok разрешает в proposed

`ALLOWED_TRANSITIONS["contradiction-ok"]` SHALL включать `proposed` (вернуться к правкам proposal/design после успешного contradiction).

**Why:** Бывает, что после contradiction понимаешь, что нужен дополнительный Decision в design.md. Сейчас приходится ходить через `contradiction-failed → proposed → contradiction-ok` — лишний шаг.

### D3 — archive-failed разрешает в verify-ok

`ALLOWED_TRANSITIONS["archive-failed"]` SHALL включать `verify-ok` (вернуться к pre-archive стадии после внешнего разрешения проблемы).

**Why:** Если archive упал не из-за verify (а из-за git conflict / FS error), не имеет смысла re-verify. Прямой путь обратно в verify-ok позволяет повторить archive.

### D4 — archived остаётся terminal

`ALLOWED_TRANSITIONS["archived"]` SHALL оставаться `set()` (пустой). После успешной архивации workflow завершён, state-file удаляется.

**Why:** Сохраняем инвариант «archived = done». Если нужны изменения уже архивированной capability — заводится новый change.

### D5 — Только дополнения, никаких удалений

Изменение SHALL только расширять whitelist (добавлять рёбра). Existing transitions не удаляются и не переименовываются.

**Why:** Backward-compat. Существующие `.sdd-state.yaml` файлы продолжают работать без миграции.

## Data Flow

```
[Сценарий 1: re-verify после правок]
state.stage = verify-ok
└─ user правит файлы
└─ user re-runs /sdd:apply (или вручную state.py transition verify-ok verifying)
   ├─ state.py разрешает (НОВОЕ)
   └─ state.stage = verifying

[Сценарий 2: добавить Decision в design.md после contradiction-ok]
state.stage = contradiction-ok
└─ user правит design.md
└─ user transitions verify-ok → proposed (НОВОЕ)
└─ user re-runs /sdd:contradiction
   └─ state.stage = contradiction-ok (snapshot)

[Сценарий 3: archive-failed из-за git conflict, не verify]
state.stage = archive-failed
└─ user fixes external issue (git restore openspec/specs/)
└─ user transitions archive-failed → verify-ok (НОВОЕ)
└─ user re-runs /sdd:archive
   └─ state.stage = archiving → archived
```

## File Changes

**Изменяемые:**
- `skills/sdd/scripts/state.py` — `ALLOWED_TRANSITIONS` dict: добавить рёбра в трёх ключах (verify-ok, contradiction-ok, archive-failed).

**Документация (live spec):**
- `openspec/specs/sdd-state/spec.md` MODIFIED — обновить Stage transition rules таблицу с новыми рёбрами и use-case описанием.

## Risks / Trade-offs

- [**Расширение whitelist может маскировать инконсистентный state**] → пользователь возвращается из verify-ok в applying, забывает что верификация пройдёт против уже устаревшего baseline. **Mitigation:** документировать в spec, что переход в `verifying` сбрасывает `verify_status` на `n/a` (если хук-flow из sdd-state-skill-hooks реализован).
- [**Множественные re-verify создают шум в last_step_at**] → state.py перезаписывает timestamp каждый раз. **Mitigation:** считаем acceptable — `last_step_at` отражает последнюю активность, а не первую.
- [**archived → archive-failed → archived петля**] → теоретически возможна. **Mitigation:** `archived` остаётся terminal (D4). Архивация — финал.

## Migration Plan

1. Обновить `state.py` (3 строки изменений).
2. Обновить live spec `sdd-state` через MODIFIED Requirement.
3. Релиз 0.7.1 (patch — только расширение, без breaking).
4. Существующие state-файлы: миграция не требуется, новые рёбра доступны сразу.

Rollback: revert change через git, существующие пути остаются работать.

## Open Questions

1. Сбрасывать ли `verify_status` на `n/a` при переходе `verify-ok → verifying`? Вынес в Risks как mitigation (зависит от `sdd-state-skill-hooks` которая ещё не реализована — можно сейчас не решать, дождаться её implementation).
