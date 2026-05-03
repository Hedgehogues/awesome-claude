# Design: sdd declared deps — контекст зависимостей в contradiction и apply

## Context

`sdd:contradiction` и `sdd:apply` — два скилла, которые работают с одним и тем же `.sdd.yaml`, но по-разному используют его поля.

**`contradiction.py`** (вызывается из `sdd:contradiction`) после `sdd-merges-into-gaps` делает:
1. Full scan из `index.yaml` — все live specs
2. Draft scan для `creates` не в index — draft specs

**`sdd:apply`** при реализации задач:
1. Читает `tasks.md` — что делать
2. Читает `test-plan.md` — контекст тестов
3. Читает `creates` из `.sdd.yaml` — только для обновления `index.yaml` после verify

Оба игнорируют `merges-into` как источник контекста.

## Goals / Non-Goals

**Goals:**
- `contradiction.py`: валидация merges-into против index, PRIMARY-маркировка, ADJACENT-scan
- `sdd:apply`: загрузка спек `merges-into` как read-only контекст перед реализацией

**Non-Goals:**
- Не менять логику Claude-анализа в contradiction (12 детекторов остаются как есть)
- Не добавлять ML-matching для ADJACENT (только keyword matching)
- Не трогать `sdd:archive`

## Decisions

### D1 — Валидация merges-into: проверка в index.yaml, не загрузка спека напрямую

`contradiction.py` SHALL проверять, что каждая capability из `.sdd.yaml.merges-into` присутствует в `index.yaml`. Если присутствует — помечать `[PRIMARY/merges-into]`; если нет — добавлять в `warnings` с текстом `merges-into capability '<name>' not found in index.yaml`.

**Why:** `merges-into` означает «этот change модифицирует существующую capability». Если capability не в index.yaml — это либо опечатка, либо capability ещё не архивирована, что является полезной диагностикой до запуска full contradiction.

**Alternatives considered:**
- Загружать spec из `openspec/changes/*/specs/` если не в index — слишком широкий поиск, создаёт неопределённость

### D2 — Маркировка PRIMARY через префикс в выводе скрипта

Live-спеки capabilities из `creates` ∪ `merges-into`, успешно загруженные, SHALL помечаться суффиксом `[PRIMARY/creates]` или `[PRIMARY/merges-into]` в строке-разделителе: `--- Capability: <name> (<path>) [PRIMARY/creates] ---`.

Draft-спеки уже имеют `[DRAFT]` — заменяем на `[PRIMARY/creates DRAFT]`.

**Why:** Claude видит один текстовый поток. Явная метка меняет приоритет внимания без изменения логики детекторов.

### D3 — ADJACENT: keyword matching по именам capabilities

Для каждой capability из index.yaml, не входящей в `creates ∪ merges-into`, вычислять пересечение токенов (split по `-`, `_`, пробелам, lowercase) с токенами `creates ∪ merges-into`. Если ≥ 2 shared non-trivial токена (длина > 3, не стоп-слова) — capability ADJACENT.

Формат вывода: см. `specs/contradiction-index-awareness/spec.md` → adjacent-detection. ADJACENT capabilities не включаются в основной анализ — только listing.

**Why:** Keyword matching достаточен для «напоминалки» без риска ложного включения в scope анализа.

**Alternatives considered:**
- Включать ADJACENT в full analysis scope — риск context overflow; противоречит принципу «жёсткая граница PATH»
- Семантическое сравнение через embeddings — overengineering для скрипта без ML-зависимостей

### D4 — Summary обновляется тремя новыми полями

В финальный Summary-блок добавить:
```
primary_capabilities: <N>
merges_into_missing: <M>  (0 если все в index)
adjacent_capabilities: <K>
```

**Why:** Структурированные поля позволят skill.md и Claude обрабатывать их программно (при необходимости) без парсинга prose.

### D5 — sdd:apply загружает merges-into спеки как read-only контекст

`sdd:apply` SHALL после чтения `test-plan.md` (шаг 3) выполнить дополнительный шаг: прочитать поле `merges-into` из `.sdd.yaml`, для каждой capability найти её `path` в `index.yaml`, загрузить соответствующий `spec.md` и передать Claude как «Existing capability contracts (read-only context)».

Спеки `merges-into` используются только как контекст — Claude учитывает их при реализации задач, чтобы не нарушить существующие контракты. Они не добавляются в `index.yaml` и не влияют на verify-verdict.

Если capability из `merges-into` не найдена в `index.yaml` — вывести warning и продолжить (не блокировать).

**Why:** При реализации tasks.md без знания существующих спек можно случайно изменить поведение, которое уже задокументировано. Загрузка спек `merges-into` даёт Claude явный контракт для сверки.

**Alternatives considered:**
- Блокировать apply при missing merges-into в index — слишком жёстко, бывают легитимные случаи когда capability ещё в процессе архивации
- Загружать все спеки из index (как contradiction) — избыточно, apply нужен только прямой контекст

## Risks / Trade-offs

- **Keyword false positives в ADJACENT**: если `creates` включает generic-токены типа `sdd`, `skill`, `spec` — почти все capabilities будут ADJACENT. Митигация: стоп-лист generic-токенов + порог ≥ 2 non-trivial.
- **Context size в apply**: загрузка спек merges-into увеличивает контекст. Митигация: только merges-into спеки (не весь index), только при наличии поля.
- **Backwards compat contradiction**: skill.md читает stdout contradiction.py. Новые поля в Summary и новая секция ADJACENT не ломают существующий парсинг — Claude читает prose-вывод, не структурированный JSON.
