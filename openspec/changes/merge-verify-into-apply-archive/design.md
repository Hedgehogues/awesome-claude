## Context

В текущем pipeline `propose → contradiction → apply → change-verify → archive → spec-verify` шаги слабо связаны: каждый — отдельная пользовательская команда, ручная последовательность, отсутствует машинный source of truth по статусу change'а. При обрыве сессии следующий запуск выводит положение дел из косвенных признаков (чекбоксы tasks.md, git status), что хрупко. Авторство не зафиксировано — невозможно предупредить, что зашёл в чужой change.

См. `proposal.md` для мотивации и `.sdd.yaml` для capability declarations.

## Goals / Non-Goals

**Goals:**
- Один пользовательский вызов = один логический шаг workflow. Verify становится частью apply/archive, не отдельной командой.
- Явный машинный source of truth по статусу change'а: `.sdd-state.yaml` в директории change.
- Resume любого шага после обрыва сессии — следующий sdd-скилл читает state и продолжает с нужного места.
- Авторство change'а с identity из Claude Code (не git), warning при несовпадении.
- Автоматическая подсказка при propose: если capability существует — предложить `merges-into` вместо новой.

**Non-Goals:**
- Автоматический rollback specs после неудачного archive — оставляем ручным (`git restore`).
- Multi-owner / co-authoring — `owner:` единственный, перезапись с warning.
- Хранение owners в live-spec'ах (`openspec/specs/`) — owner живёт только в change-уровне.
- Unification verify в общий sub-skill — намеренное дублирование L1/L2/L3 в apply и archive (см. D2).
- Backward-compat шим для старых команд `/sdd:change-verify`, `/sdd:spec-verify` — удаляются полностью.

## Technical Approach

Вся логика верификации (L1 Exists → L2 Substantive → L3 Wired) переносится текстом в `apply.md` и `archive.md` без изменения семантики проверок. Различия:

- **в apply** verify читает `tasks.md` (как делал `change-verify`);
- **в archive** verify читает live `spec.md` после merge (как делал `spec-verify`), включая REMOVED-инверсию.

State-файл `.sdd-state.yaml` пишется через Python-скрипт `skills/sdd/scripts/state.py` (claude-way: структурированные данные через скрипт, не нативно). Скрипт поддерживает: `read`, `update <field> <value>`, `transition <stage>`, `delete`.

Identity-resolver `skills/sdd/scripts/identity.py` парсит `claude auth status` (JSON-выхлоп c полем `email`); при `loggedIn: false` или ошибке CLI — возвращает `git config user.email`; при отсутствии git — выходит с явной ошибкой.

Merge-dialog в propose: после генерации `.sdd.yaml` сравнивает `creates:` с capabilities из `openspec/specs/index.yaml` и для каждого пересечения вызывает AskUserQuestion (через Skill-tool harness) с двумя вариантами: «оставить в creates» / «переключить в merges-into».

## Architecture Decisions

### D1 — State хранится в файле, а не в TodoWrite

`.sdd-state.yaml` SHALL лежать в `openspec/changes/<id>/.sdd-state.yaml` (рядом с `proposal.md`, `tasks.md`, `.sdd.yaml`). Файл MUST быть `gitignored` через паттерн `**/.sdd-state.yaml` в корневом `.gitignore`.

**Why:** TodoWrite/TaskCreate эфемерны — теряются при обрыве сессии. По claude-way state — это `persistent` артефакт со схемой → файл, не in-memory.

**Alternatives considered:**
- Хранение в `.sdd.yaml`: смешивает декларацию (commit'ится) и runtime-state (нет). Отвергнуто.
- Глобальный реестр в `~/.claude/sdd-states/`: разрывает связь со change-директорией, усложняет cleanup. Отвергнуто.

### D2 — Verify дублируется инлайн в apply и archive

L1/L2/L3 ядро SHALL быть скопировано текстом в оба скилла без вынесения в общий sub-skill. apply вызывает verify над `tasks.md`, archive — над live `spec.md`.

**Why:** Каждый скилл должен оставаться самодостаточным и в пределах ≤3 шагов по claude-way. Вызов sub-skill — это +1 шаг + дополнительная зависимость. Дублирование ~12KB текста осознанное; правки придётся вносить в двух местах, но за это получаем простой контракт «один файл — один скилл».

**Alternatives considered:**
- Общий `sdd:verify` с `MODE=tasks|spec`: убирает дублирование, но добавляет sub-call и параметр-режим. Отвергнуто пользователем.

### D3 — State удаляется только при полном успехе archive

`.sdd-state.yaml` SHALL удаляться **последним шагом** `sdd:archive`, после успешного merge specs, copy `test-plan.md` и spec-verify. При любом fail на промежуточном шаге файл MUST оставаться с обновлённой стадией (`archive-failed`, `verify-failed` etc.).

**Why:** Корректная семантика «нет файла = workflow завершён». Если archive упал — пользователь видит точно, на каком шаге, и может починить руками.

### D4 — Identity primary-источник: `claude auth status`, fallback git

Identity-resolver SHALL вызвать `claude auth status` (CLI subcommand) и распарсить JSON-поле `email`. Если CLI недоступен или `loggedIn: false` — fallback на `git config user.email`. Если оба недоступны — exit с сообщением «не удалось определить identity, залогинься через `claude auth login` или настрой `git config`».

**Why:** Claude Code identity более точно отражает «кто работает с change», чем локальный git config (который у каждого может быть настроен иначе или не быть настроен в этом репо). Git — стабильный fallback.

**Alternatives considered:**
- Только git: проще, но не использует существующую Claude-аутентификацию.
- Только Claude: ломается у пользователей через ANTHROPIC_API_KEY (там нет email).

### D5 — Owner единичный, перезапись с warning

Поле `owner:` в `.sdd.yaml` SHALL быть строкой (один email), не массивом. При попытке другого автора зайти в чужой change MUST выводиться warning «это change `<old-owner>`, перезаписать на тебя?» — перезапись только по явному согласию.

**Why:** Простая модель ownership без co-authoring сложности. Если несколько людей работают над одним change'ем — это редкий случай, обходится явной передачей.

### D6 — Propose merge-dialog interactive, не silent

При обнаружении пересечения `creates:` с существующей capability в `index.yaml` `/sdd:propose` SHALL спросить пользователя через AskUserQuestion с двумя опциями: оставить как `creates` (новая capability с тем же именем — конфликт) или переключить в `merges-into` (расширение существующей). Скилл MUST NOT принимать решение молча.

**Why:** Семантика разная: создание дубля vs расширение существующего spec'а. Ошибка стоит дорого (некорректный merge при archive).

### D7 — Rollback после fail в archive — manual, не автомат

При неудачной верификации внутри `/sdd:archive` (specs уже merged в `openspec/specs/`, но проверка fail) скилл SHALL вывести выделенный red-banner с двумя опциями: `git restore openspec/specs/` или новый change через `/sdd:propose`. MUST NOT пытаться автоматически откатить файлы.

**Why:** Автоматический rollback — destructive операция; решение должен принимать человек, тем более что между merge и verify пользователь мог уже что-то закоммитить.

## Data Flow

```
[propose]
  ├─ openspec new change <name>
  ├─ generate proposal/design/specs/tasks via openspec-propose
  ├─ identity.py → email
  ├─ state.py write .sdd-state.yaml: stage=proposed, owner=<email>, ts
  ├─ создаёт .sdd.yaml: creates, merges-into, owner
  └─ merge-dialog по пересечениям creates ∩ index.yaml.specs

[contradiction]
  ├─ identity.py → email (warn если != owner)
  ├─ run 12-detector pass
  └─ state.py update: stage=contradiction-ok | contradiction-failed

[apply]
  ├─ identity.py → email (warn если != owner)
  ├─ state.py update: stage=applying
  ├─ openspec-apply-change → реализация
  ├─ state.py update: stage=verifying
  ├─ inline L1/L2/L3 verify по tasks.md
  ├─ state.py update: stage=verify-ok | verify-failed
  └─ при verify-ok: обновить openspec/specs/index.yaml для creates

[archive]
  ├─ identity.py → email (warn если != owner)
  ├─ state.py update: stage=archiving
  ├─ check test-plan.md exists & not stub
  ├─ openspec-archive-change → merge specs в openspec/specs/
  ├─ inline L1/L2/L3 verify по live spec.md (с REMOVED-инверсией)
  ├─ при fail: state.py update: stage=archive-failed; print red-banner; STOP
  ├─ copy test-plan.md → openspec/specs/<cap>/test-plan.md
  ├─ state.py update: stage=archived
  └─ state.py delete .sdd-state.yaml
```

## File Changes

**Modified skills (`skills/sdd/`):**
- `apply.md` — крупная ревизия: добавляются шаги state-update, inline tasks-verify (L1/L2/L3), index.yaml update.
- `archive.md` — крупная ревизия: state-update, inline spec-verify, error-handling с red-banner, финальное удаление state-file.
- `propose.md` — добавляются: создание `.sdd-state.yaml`, инициализация `owner:` в `.sdd.yaml`, merge-dialog для пересечений с `index.yaml`.
- `contradiction.md` — добавляется обновление state-file (stage transition).
- `help.md` — убираются упоминания `change-verify`/`spec-verify` из pipeline; обновляются номера шагов.

**Deleted skills/commands:**
- `skills/sdd/change-verify.md`
- `skills/sdd/spec-verify.md`
- `commands/sdd/change-verify.md`
- `commands/sdd/spec-verify.md`

**New scripts (`skills/sdd/scripts/`):**
- `state.py` — `read`, `update <field> <value>`, `transition <stage>`, `delete` для `.sdd-state.yaml`.
- `identity.py` — резолв email через `claude auth status` с fallback `git config user.email`.

**Configuration:**
- `.gitignore` — добавляется `**/.sdd-state.yaml`.

**Documentation:**
- `README.md` — диаграмма pipeline без отдельных verify-узлов; таблица команд без `change-verify`/`spec-verify`.

## Risks / Trade-offs

- [**Дублирование verify-логики разбежится**] → При правке L1/L2/L3 в одном скилле — забыть обновить во втором. **Mitigation:** комментарий-маркер `<!-- KEEP IN SYNC: archive.md/apply.md verify section -->` в обоих файлах + проверка в contradiction-skill через семантическое сравнение секций.
- [**`claude auth status` может изменить формат вывода**] → Сломается identity.py. **Mitigation:** `identity.py` парсит JSON через `--json` флаг (стабильнее, чем регулярки по plain-text); fallback на git делает скрипт устойчивым.
- [**State-file конфликтует с старыми changes без него**] → Существующие changes без `.sdd-state.yaml` не сломаются, но при первом проходе через любой sdd-скилл файл создастся «из воздуха». **Mitigation:** скрипт `state.py` поддерживает at-first-touch создание со stage='unknown'.
- [**Удаление verify-команд ломает чьи-то закладки/привычки**] → BREAKING. **Mitigation:** в `help.md` явно указываем «verify теперь часть apply/archive»; за один релиз 0.6.0 уведомляем в README.
- [**`claude` CLI может отсутствовать в CI/automation**] → identity-resolver упадёт на primary-источнике. **Mitigation:** fallback на git config обязателен; в CI обычно настроен `git config user.email`.

## Migration Plan

1. Реализуем все capabilities в одном change'е (этот change).
2. Удаляем `change-verify`/`spec-verify` файлы.
3. Релиз 0.6.0 включает breaking changes — упоминаем в CHANGELOG.
4. Существующие активные changes (без `.sdd-state.yaml`) при следующем sdd-вызове получат файл создаётся at-first-touch — без потери данных.

Rollback: revert change через git, восстановит старые `change-verify`/`spec-verify` файлы. State-файлы могут остаться у пользователей — gitignored, удаляются вручную или игнорируются.

## Open Questions

(нет открытых вопросов — все развилки закрыты в Decisions)
