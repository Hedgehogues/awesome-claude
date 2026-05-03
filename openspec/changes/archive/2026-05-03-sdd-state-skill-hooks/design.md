## Context

После реализации change `merge-verify-into-apply-archive` workflow `.sdd-state.yaml` существует, но обновляется только моделью через bash-команды в `skill.md`. На практике это даёт два провала:

1. **Skill не запущен** — workflow выполнялся вручную (как в нашей собственной meta-сессии при реализации change'а): state-файл появился только когда я явно дёрнул `state.py update` руками.
2. **Skill пропустил шаг** — модель прошла дальше по skill.md, не вызвав state-transition (легко случается при длинном flow).

В обоих случаях `.sdd-state.yaml` либо отсутствует, либо рассинхронизирован — теряется resume-семантика и явный source of truth по статусу change'а.

Claude Code поддерживает `PostToolUse` hooks с матчером `Skill` (видно в `~/.claude/settings.json` примерах). Когда модель вызывает Skill tool, hook получает JSON с именем скилла и аргументами — этого достаточно, чтобы автоматически дёрнуть `state.py transition` без участия модели.

См. `proposal.md` для What Changes и `.sdd.yaml` для capability declarations.

## Goals / Non-Goals

**Goals:**
- State транзиции происходят **автоматически** при завершении `/sdd:propose|contradiction|apply|archive` — без зависимости от того, что модель вызвала bash-команду.
- Hook не требует знания контекста change'а от модели — резолвит current change по cwd, аргументу скилла или fallback.
- Verify-результат (`ok|failed`) передаётся через side-channel в `.sdd-state.yaml`, чтобы hook знал, какую транзицию выбрать (`verify-ok` vs `verify-failed`).
- Backward-compat: если хук не настроен — workflow не ломается, просто state остаётся неавтоматизированным.

**Non-Goals:**
- Замена ручного выполнения скиллов (модель всё ещё читает skill.md и исполняет инструкции — хук только про state).
- Автоматизация других side-effects скилла (создание файлов, обновление index.yaml — это всё остаётся в skill.md).
- Хуки на не-sdd скиллы (только sdd:propose|contradiction|apply|archive).
- Глобальный реестр state'ов нескольких change'ей одновременно — резолв current change ограничен одним за раз.

## Technical Approach

`.claude/settings.json` получает новый hook entry:

```json
"PostToolUse": [
  {
    "matcher": "Skill",
    "hooks": [
      {
        "type": "command",
        "command": "python3 ${CLAUDE_PROJECT_DIR}/skills/sdd/scripts/state_hook.py"
      }
    ]
  }
]
```

Harness передаёт hook'у JSON на stdin: `{tool_name, tool_input: {skill, args}, tool_response: {success, ...}}`.

`state_hook.py`:
1. Парсит stdin JSON.
2. Извлекает имя скилла из `tool_input.skill`. Если не `sdd:*` — выходит молча.
3. Резолвит change-name:
   - первое: парсит `tool_input.args` на `<change-name>` argument (если скилл вызван с явным change'ем);
   - fallback: ищет `openspec/changes/<X>/.sdd-state.yaml` с самой свежей `last_step_at` (current active change);
   - если не резолвит — выходит с warning в stderr (но exit 0, чтобы не блокировать harness).
4. Маппит skill→target stage:
   - `sdd:propose` → `proposed`
   - `sdd:contradiction` → читает `verify_status` из state-file: `ok` → `contradiction-ok`, `failed` → `contradiction-failed`
   - `sdd:apply` → читает `verify_status`: `ok` → `verify-ok`, `failed` → `verify-failed`, иначе → `applying` (если apply прервался до verify)
   - `sdd:archive` → читает `verify_status`: `ok` → `archived`, `failed` → `archive-failed`, иначе → `archiving`
5. Вызывает `state.py transition <path> <target-stage>`.
6. Если transition отвергнут (state-machine не разрешает) — пишет в stderr, exit 0 (не валит harness).

`skill.md` файлы (apply/archive/propose/contradiction):
- Убираются явные `state.py transition` bash-блоки.
- Добавляются `state.py update verify_status <ok|failed>` ПЕРЕД завершением скилла (чтобы hook прочитал значение при PostToolUse).

## Decisions

### D1 — Hook на PostToolUse(Skill), не на Bash

Hook SHALL быть привязан к `PostToolUse` с matcher = `Skill`. Hook MUST NOT срабатывать на Bash, Edit, Write — там нет контекста скилла.

**Why:** `Skill` — единственный tool с известной семантикой «логический workflow-step завершился». Bash-event срабатывает на каждую строку, не различает skill-context.

### D2 — Side-channel verify_status в .sdd-state.yaml

Скилл MUST записать поле `verify_status` (`ok | failed | n/a`) в `.sdd-state.yaml` ПЕРЕД своим завершением, если verify-этап применим (apply, archive). Hook читает это поле при transition.

**Why:** Hook не имеет доступа к содержимому работы скилла — только к факту вызова. Нужен side-channel. Поле в том же state-file удобно (один источник).

**Alternatives considered:**
- Отдельный файл `.sdd-verify.yaml` — лишний артефакт, надо отдельно gitignore.
- Stdout / exit-code — не передаётся через Skill→PostToolUse цепочку.

### D3 — Резолв current change через args + fallback на freshest state-file

Hook SHALL пытаться извлечь change-name из аргументов скилла (`tool_input.args`). Если аргументов нет — fallback на поиск `openspec/changes/<X>/.sdd-state.yaml` с самой свежей `last_step_at`. Если не находит — exit 0 без ошибки.

**Why:** Аргумент явный и однозначный, когда есть. Freshest fallback покрывает случаи без явного аргумента (модель работает с одним активным change'ем). Silent fail при отсутствии гарантирует, что hook не сломает harness в edge cases.

### D4 — skill.md остаётся source of truth для verify_status, но НЕ для transition

`skill.md` SHALL продолжать содержать инструкцию `state.py update verify_status <ok|failed>` после inline verify (apply, archive). `skill.md` MUST NOT содержать `state.py transition` команды — это работа hook'а.

**Why:** Verify-результат знает только модель (она прогоняет L1/L2/L3). Hook не может его вычислить сам — нужен side-channel из skill. Transition же тривиальный mapping skill→stage, доступен hook'у без контекста.

### D5 — Hook fail soft

`state_hook.py` SHALL exit 0 во всех случаях (включая невалидный transition, отсутствие state-file, нерезолвенный change). Ошибки идут в stderr, но не валят harness.

**Why:** Hook — observability + automation, но не gating. Если он сломается — workflow продолжается, просто state не обновится. Это лучше, чем блокировать пользователя на каждом скилле из-за hook-bug'а.

### D6 — Backward-compat без удаления существующего поведения

Существующие `state.py transition` команды в skill.md из предыдущего change'а **удаляются**, а не оставляются как fallback. Если hook не настроен (CI без settings.json) — state-машина не работает, но workflow остаётся функциональным (state-file либо отсутствует, либо устарел — оба варианта не блокируют).

**Why:** Двойной запуск transition (hook + bash) приведёт к ошибкам state-машины (нельзя дважды transition в один stage). Чище удалить bash-вызовы и положиться на hook. CI/headless mode — out of scope: там и так нет интерактивных скиллов.

## Data Flow

```
[Пользователь]: /sdd:apply my-change
  ├─ Claude harness: вызывает Skill tool
  ├─ Skill tool: возвращает "Launching skill: sdd:apply"
  ├─ Модель: читает skills/sdd/apply/skill.md, выполняет инструкции
  │   ├─ identity check
  │   ├─ state.py update verify_status n/a (reset)
  │   ├─ openspec-apply-change (реализация)
  │   ├─ inline L1/L2/L3 verify против tasks.md
  │   └─ state.py update verify_status <ok|failed>     ← запись в side-channel
  ├─ Skill tool завершается
  └─ Harness: вызывает hook PostToolUse(Skill)
      ├─ state_hook.py: читает stdin JSON
      ├─ Парсит skill="sdd:apply", args="my-change"
      ├─ Резолвит change_dir = openspec/changes/my-change/
      ├─ Читает .sdd-state.yaml: verify_status = ok
      ├─ Маппит: apply + ok → verify-ok
      └─ state.py transition <path> verify-ok
[State обновлён]
```

## File Changes

**Configuration:**
- `.claude/settings.json` — добавить `PostToolUse` hook с matcher `Skill`, вызывающий `state_hook.py`.

**Новые файлы:**
- `skills/sdd/scripts/state_hook.py` — harness-обёртка: парсит stdin JSON, резолвит change-name, маппит skill→stage, вызывает state.py.

**Модифицированные:**
- `skills/sdd/apply/skill.md` — удалить `state.py transition applying|verifying|verify-ok|verify-failed`; добавить `state.py update verify_status <ok|failed>` ПЕРЕД завершением.
- `skills/sdd/archive/skill.md` — удалить `state.py transition archiving|archived|archive-failed`; добавить `state.py update verify_status` ПЕРЕД завершением.
- `skills/sdd/propose/skill.md` — удалить `state.py transition proposed`. Hook сделает сам.
- `skills/sdd/contradiction/skill.md` — удалить `state.py transition contradiction-ok|contradiction-failed`; добавить `state.py update verify_status` ПЕРЕД завершением.
- `skills/sdd/scripts/state.py` — расширить `update` для `verify_status` поля (валидация значений `ok|failed|n/a`).

**Documentation:**
- `README.md` или `docs/SKILL_DESIGN.md` — упомянуть hook-based state automation в разделе про SDD workflow.

## Risks / Trade-offs

- [**Hook не вызвался (harness баг / settings.json не загружен)**] → state не обновится. **Mitigation:** D5 fail-soft — workflow не сломается, просто state будет stale. Пользователь сможет дёрнуть `state.py transition` руками.
- [**Двойная запись verify_status (модель + hook повторного skill-вызова)**] → race condition. **Mitigation:** `state.py update` атомарен через write-temp-then-rename; verify_status сбрасывается на `n/a` в начале каждого скилла.
- [**Hook не знает, какой change активен (cwd != change-dir, args нет)**] → silent fail. **Mitigation:** D3 fallback на freshest `.sdd-state.yaml`. Edge case (несколько active changes одновременно) → не покрыт, но редок.
- [**Удаление bash-вызовов из skill.md ломает воспроизводимость без hook**] → CI без settings.json. **Mitigation:** не критично, CI обычно не запускает интерактивные skills end-to-end. Фиксируем как known limitation.
- [**Изменение `.claude/settings.json` через update-config skill требует подтверждения пользователя**] → не блокер, но ручной шаг при первой установке. **Mitigation:** документировать в Migration Plan.

## Migration Plan

1. Реализовать `state_hook.py`.
2. Обновить `state.py` — поддержка `verify_status` поля.
3. Обновить 4 skill.md (apply, archive, propose, contradiction).
4. Добавить hook в `.claude/settings.json` через update-config (требует пользовательского подтверждения).
5. На уже активных change'ах: первый запуск `/sdd:propose|contradiction|apply|archive` нового скилла под hook-ом запишет state-file, дальше всё по новой схеме.

Rollback: revert change через git восстановит bash-вызовы в skill.md; удалить hook из settings.json вручную.

## Open Questions

(нет открытых вопросов на v1; multi-change resolve в hook — known limitation, не блокер)
