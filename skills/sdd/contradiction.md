---
name: sdd:contradiction
workflow_step: 5
description: >
  Проверяет текстовые артефакты (OpenSpec change-директории, отдельные файлы, произвольные каталоги)
  на внутренние противоречия, избыточность и broken cross-doc pointers.
  Активируй, когда пользователь просит проверить consistency директории/файла, после серии правок
  в change-артефактах, перед коммитом, после каждого перехода между соседними узлами графа
  proposal ↔ design ↔ spec ↔ tasks, или явно через `/sdd:contradiction PATH=<file|dir>`.
---

# Contradiction checker (sdd:contradiction)

Никакого внешнего кода, Python-модуля, curated-словаря или fixture-тестов нет. Всё делаешь ты, модель, в одном прогоне.

## Input handling

Пользователь передаёт `PATH` — один или несколько пробел-разделённых путей (файлов или директорий). Каждый путь раскрывается в список файлов; наборы объединяются в единый scope проверки.

Если путь не существует — выведи `ERROR: path not found: <PATH>` для каждого несуществующего пути и продолжи анализ по оставшимся (не останавливайся полностью). Если ни одного валидного пути нет — остановись.

После раскрытия всех путей определи режим по составу набора:

1. **Файл** (один файл, нет `proposal.md`) → читай только его, применяй in-file детекторы (`numeric`, `reference`, `deontic`, `semantic`, `redundancy`).
2. **Change-директория** (набор содержит `proposal.md`) → change-directory-режим: читай все четыре артефакта (`proposal.md`, `design.md`, `tasks.md`, `specs/**/spec.md`), ограничивая scope переданными файлами. Если в change-директории присутствует `domain.md` — включай его в scope наравне с opsx-артефактами; все двенадцать детекторов применяются к нему без исключений. Применяй все двенадцать детекторов.
3. **Произвольная директория** (без `proposal.md` в корне) → прочитай все текстовые файлы рекурсивно: `*.md`, `*.sh`, `*.py`, `*.yaml`, `*.yml`, `*.json`, `*.txt`, `*.toml`, `*.ini`, `Makefile`, `Dockerfile`.
4. **Корень проекта** (`.` или `openspec/`) → whole-project scan с поиском cross-change coupling; читай только файлы внутри PATH.

Детекторы, требующие конкретных артефактов (`coverage`, `placement`, `spec-count`, `semantic-completeness`, `derivability`, `what-changes-coverage`, `decisions-coverage`), запускаются только если соответствующие артефакты присутствуют в наборе; иначе — пропускаются с пометкой `[detector: N/A — required artifacts not in scope]` в Summary.

**Граница анализа.** Во всех режимах PATH — жёсткая граница. Ссылки на файлы вне PATH проверяй только на существование (`reference`-детектор); referenced файлы не читай и не включай в анализ.

## Phase 1 — EXPAND (conditional)

Выполняй только если `PATH` — ранняя change-директория: `proposal.md` почти пустой (< ~500 символов в Why+What), иллюстративный-list классов/случаев отсутствует или содержит ≤ 3 пункта. В этом случае выведи в отчёт секцию:

```
--- EXPAND note ---
Scope may be under-specified. Consider listing illustrative classes/edge cases in proposal.md
before fixing v1 scope in design. This prevents narrow-scope commitment that misses dimensions.
```

Если change зрелый — фаза проходит молча, ничего в отчёт не добавляется.

## Phase 2 — COMPRESS

До запуска детекторов пройдись по блокам (абзац, table-row, list-item длиной ≥ 120 символов или ≥ 15 слов, Requirement-секция) и выяви дубликаты в 2+ файлах. Для каждой группы дубликатов сформируй кандидат на SSOT-консолидацию по эвристике приоритета:

```
specs/**/spec.md > design.md > proposal.md > tasks.md
```

Эвристика рекомендательная. Override по делу: если дубликат — Why-статистика или motivational narrative, SSOT может остаться в `proposal.md`. Пометь предложение как `heuristic`.

**Для каждой группы подготовь конкретный pointer-rewrite:**

- какой текст оставить в SSOT-файле дословно;
- какой короткий pointer подставить в остальные места: «см. `<ssot-file>` → <section-anchor>».

Эти предложения будут представлены как `[warning] redundancy` в фазе VALIDATE, а сами предложенные новые pointer'ы пройдут через детектор `reference` там же — чтобы каскадные broken-pointers были видны сразу.

**Исключения из redundancy-детекции:**

- fenced-code-blocks с shebang-строкой (`#!/bin/bash`, `#!/usr/bin/env python`);
- YAML frontmatter (`---\n...\n---`);
- Markdown-разделители (`---`, `***`, `___`);
- чисто-пунктуационные строки;
- короткие cross-ref-подписи («см. D5», «Req X»).

## Phase 3 — VALIDATE

Применяй **двенадцать детекторов** в фиксированном порядке: `numeric` → `reference` → `deontic` → `semantic` → `redundancy` → `coverage` → `placement` → `spec-count` → `semantic-completeness` → `derivability` → `what-changes-coverage` → `decisions-coverage`. Результаты пусть копятся отдельно по детекторам — формат отчёта ниже требует сгруппированного вывода.

### 3.1 — numeric (hard, severity=error)

Находи утверждения с числами и устойчивым subject'ом:

- счётчики (количество однотипных сущностей: «N records», «K fields», «M items per group»);
- пороги, лимиты, таймауты, TTL («30 дней», «5 retries», `MAX_RETRIES=3`);
- номера портов, версии, коэффициенты.

Группируй по subject'у (нормализация контекста: «N items of type A» и «N items of type B» — разные subject'ы даже при одном числе, не смешивай). Если для одного subject'а в разных местах встречаются разные числа — флаг.

Формат issue: `<file>:<line>: [error] numeric: '<subject>' = <A> here vs <B> (at <other-file>:<line>)`.

### 3.2 — reference (hard, severity=error, 3 подстратегии)

Подстратегии — один класс `reference` с полем `sub_kind`:

1. **file** — упоминания файлов (`scripts/*.sh`, `manifest/*.md`, `.claude/*`, относительные пути). Проверяй существование на диске.
2. **make-target** — упоминания `make <target>`. Если в корне проекта есть `Makefile`, проверяй наличие цели. Если `Makefile` нет — пропусти с warning в stderr, не флагай.
3. **pointer** — cross-doc ссылки вида «см. `<file>` → <section-id|Requirement-name|§N|D<N>>», «`<file>.md:<anchor>`». Резолви целевой файл и секцию. Проверяй, что секция / Requirement / параграф с таким именем есть в целевом файле.

**Exception — plan-artefacts.** Если файл явно упоминается в `tasks.md` текущего change как создаваемый этим change'ем (формулировки «создать», «добавить», «ввести файл X», «новый файл»), НЕ флагай его как missing, даже если физически отсутствует. Эвристика: присутствие пути в tasks.md + глагол-индикатор создания.

Формат issue: `<file>:<line>: [error] reference: '<path-or-pointer>' — <reason> [sub_kind=<file|make-target|pointer>]`.

### 3.3 — deontic (hard, severity=error)

Для каждой **сущности** собирай все модальные утверждения:

- **positive markers**: `SHALL`, `MUST`, «обязан», «SHOULD», «MAY», «активно используется», «required», «SHALL вызывать», «SHALL содержать»;
- **negative markers**: `SHALL NOT`, `MUST NOT`, `SHOULD NOT`, «не вводится», «не регистрируется», «не должен», «запрещено», `deprecated`, «отклонено», «отказ», «not introduced», `~~Requirement~~` (strikethrough в заголовке Requirement).

Извлекай **subject** — имя сущности: quoted identifier (`` `scripts/foo.sh` ``, `"foo"`), Requirement-name, имя параметра/эндпоинта/таблицы/политики. Нормализуй: whitespace-collapse, lowercase ASCII, strip кавычек.

Группируй по canonical subject. Флаг, если в группе есть и positive, и negative.

**Exceptions:**

- **Scope-restrictor в одном предложении** («SHALL X только если Y», «SHALL NOT X без Y», «SHALL ... кроме Z») — это уточнение scope, не конфликт.
- **Scenario-уровень модалок** (`#### Scenario:` → `WHEN ... THEN ...`) парсится отдельно от Requirement-уровня. У Scenario свой WHEN-scope, модалки внутри не смешивай с Requirement-модалками.
- **Разные subject'ы** — `scripts/foo.sh SHALL ...` и `scripts/bar.sh SHALL NOT ...` — не конфликт.

Формат: `<file>:<line>: [error] deontic: '<subject>' <positive-polarity> here vs <negative-polarity> (at <other-file>:<line>)`.

### 3.4 — semantic (hard, severity=error)

Сам выцепляй **темы** из текста (не из внешнего словаря):

- пути файлов и директорий;
- политики (например, «triger — manual-only», «все репы — субмодули»);
- правила (формат записи, schema);
- идентификаторы (имена репозиториев, ветки, commit-ref);
- конфигурационные значения.

Для каждой темы собери все claim'ы из разных мест и сравни по смыслу (не по буквам). Нормализация:

- whitespace / case / trailing `/` / singular-plural — не флагай;
- форматирование (backticks, quotes) — не флагай;
- разные буквальные значения («manifest/repos.md» vs «manifest/submodules.yaml») — флагай.

**Polarity** определяй по контексту самой темы (вместе с деонтикой, но в semantic — про factual claim). Если одно место утверждает о теме, а другое отрицает или переопределяет — это semantic расхождение.

В отчёте обязательно перечисли выделенные темы в секции `Subjects covered by semantic detector` — для прозрачности покрытия, чтобы пользователь видел что ты проверял.

**User-provided ignore.** Если в том же обращении пользователь говорит «subject X — известный false positive» или «игнорируй <тему>» — повторно выдай отчёт без этого subject'а, не требуя перезапуска.

Формат: `<file>:<line>: [error] semantic: '<subject>' = '<claim-A>' here vs '<claim-B>' (at <other-file>:<line>)`.

### 3.5 — redundancy (soft, severity=warning)

Используй результаты фазы COMPRESS. Каждая группа дубликатов:

- выведи **все** локации (N записей для N мест),
- укажи **suggested SSOT** с пометкой `(heuristic, override as needed)`,
- добавь **pointer-rewrite suggestion**: «оставить полный текст в `<ssot>`, в остальных — `см. <ssot> → <anchor>`»,
- прогони предложенные новые pointer'ы через `reference` подстратегию `pointer`. Если какой-то из них после consolidation стал бы broken — добавь warning «after fixing this redundancy, pointer X might break at <file>:<line>».

**User override SSOT.** Если пользователь в том же обращении укажет другой SSOT («SSOT для этого блока — proposal.md, не design.md») — пересчитай pointer-rewrite относительно указанного SSOT и повторно валидируй новые pointer'ы. Без перезапуска.

Redundancy **не растит exit-код**. Это только warning.

Формат: `<file>:<line>: [warning] redundancy: '<snippet-60-chars>' duplicated in <other-file>:<line> (suggested SSOT: <file>, heuristic)`.

### 3.6 — coverage (soft, severity=warning)

**Только в режиме change-директории.** В остальных режимах пропускай с пометкой `[coverage: N/A — required artifacts not in scope]` в Summary.

Алгоритм:
1. Прочитай `proposal.md` — секцию `### New Capabilities`. Собери список capabilities.
2. Прочитай все `specs/**/spec.md` — собери все `### Requirement:` блоки.
3. Для каждого Requirement и каждого capability проверь: есть ли в `tasks.md` хотя бы одна задача, в тексте которой упоминается имя Requirement / capability или ключевые слова его тела (совпадение по смыслу, не по байтам).
4. Непокрытые элементы → `[warning] coverage:` в Soft warnings.

Severity `warning` — несопоставленный Requirement не обязательно ошибка (может быть намеренно отложен). Coverage **не растит exit-код**.

Формат: `specs/<path>/spec.md:<line>: [warning] coverage: 'Requirement: <name>' has no corresponding task in tasks.md`.
Capability: `proposal.md:<line>: [warning] coverage: 'Capability: <name>' has no corresponding task in tasks.md`.

### 3.7 — placement (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[placement: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет, что каждый тип информации находится в артефакте, соответствующем его роли в OpenSpec-графе:

- `proposal.md` — «почему»: бизнес-контекст, мотивация, capabilities-list, impact.
- `design.md` — «как»: архитектурные решения, rationale, trade-offs, alternatives.
- `spec.md` — «что»: тестируемые контракты, Requirement-блоки, Scenario-блоки.
- `tasks.md` — «реализация»: конкретные шаги, чекбоксы, файлы-к-созданию.

Флагируй следующие паттерны с severity `warning`:

1. **Requirement-блок вне spec.md** — строка `### Requirement:` или `#### Requirement:` найдена в `proposal.md`, `design.md` или `tasks.md`.
2. **Implementation-step внутри spec.md** — чекбокс `- [ ]` / `- [x]` или нумерованный список в секции с заголовком, содержащим «task», «step», «implement», «шаг», «задача», найден в `spec.md`.
3. **Rationale-блок в spec.md без WHY-заголовка** — абзац с маркерами («потому что», «because», «rationale», «trade-off», «we chose», «решили», «альтернатива», «alternative») найден в `spec.md` и не вложен в явный `### Why`, `**Why:**` или `**Why (<qualifier>):**` заголовок.

Если блок невозможно однозначно классифицировать — выдавай warning с пометкой `ambiguous`.

Формат: `<file>:<line>: [warning] placement: <description>`.

### 3.8 — spec-count (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[spec-count: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет три условия:

1. **Capability без спеки** — считать пункты в `### New Capabilities` в `proposal.md` и сравнивать с числом `specs/**/spec.md` файлов. Если capabilities > spec-файлов — флаг. Если `### New Capabilities` отсутствует или пуста — вывести `[spec-count: N/A — no structured capabilities list in proposal.md]` и пропустить п.1; п.2 и п.3 выполнять всегда.

2. **Задача без спеки** — для каждой задачи в `tasks.md` (строка с чекбоксом или нумерованным пунктом): проверить, содержит ли текст задачи имя, путь или ключевые слова хотя бы одного из `specs/**/spec.md`. Если нет — флаг.

3. **Спека-заглушка** — `specs/**/spec.md` содержит 0 `### Requirement:` блоков, либо ровно 1 Requirement и 0 `#### Scenario:` блоков. Спека с 1 Requirement и хотя бы 1 Scenario — содержательна, не флагается.

Severity `warning` для всех трёх. Spec-count **не растит exit-код**.

Формат: `<file>:<line>: [warning] spec-count: <description>`.

### 3.9 — semantic-completeness (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[semantic-completeness: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет два вида полноты:

**Проверка 1 — нераскрытый термин.** Собери термины/capability-имена из секций `### New Capabilities` и `### Glossary` (если есть) в `proposal.md`. Для каждого термина проверь наличие (или близкого семантического соответствия) в теле хотя бы одного Requirement-блока в `specs/**/spec.md`. Если нет — флаг.

**Проверка 2 — orphan Requirement.** Собери все `### Requirement:` имена из `specs/**/spec.md`. Для каждого проверь: упоминается ли его имя (или ключевые слова первых двух предложений тела) хотя бы в одном из: `design.md` (в Discussion или Decisions-секции), `tasks.md` (как задача). Если ни в одном — флаг.

Severity `warning` для обеих проверок. Semantic-completeness **не растит exit-код**.

Формат:
- `proposal.md:<line>: [warning] semantic-completeness: term '<name>' introduced in proposal but not covered in any spec`
- `specs/<path>/spec.md:<line>: [warning] semantic-completeness: Requirement '<name>' is orphaned — not referenced in design.md or tasks.md`

### 3.10 — derivability (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[derivability: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет три паттерна производного контента — утверждений, которые логически следуют из другого артефакта и явно переформулированы без добавления нового знания.

**Паттерн 1 — Rationale-drift.** Проверяй: содержит ли `specs/**/spec.md` WHY-блок (абзац с маркерами «потому что», «because», «since», «так как», «поскольку»), чьё содержание семантически совпадает (≥60% ключевых слов) с WHY-блоком в `design.md` или `proposal.md`. Такой блок выводим из design/proposal — spec не должна его переформулировать.

Исключение из Паттерна 1: явный `### Why` заголовок или `**Why:**` блок в spec.md — намеренное документирование WHY в спеке, не флагать.

**Паттерн 2 — Constraint-restatement.** Проверяй: содержит ли `tasks.md` причинно-следственный оборот («должна X, так как», «убедиться что X (Requirement: Y)», «потому что спека требует») со ссылкой на Requirement по имени или смыслу. Такое ограничение выводимо из самого Requirement — tasks достаточно checkbox без переформулировки constraint.

**Паттерн 3 — Decision-echo.** Проверяй: содержит ли `proposal.md` блок с маркерами принятых решений («мы выбрали», «решено использовать», «принято решение», «we chose», «decided to»), семантически совпадающий (≥60% ключевых слов) с Decisions-секцией `design.md`. Proposal должен содержать WHY-мотивацию; HOW-решения принадлежат design.md.

**Общие исключения (все паттерны):**
- Короткие cross-ref подписи («см. D5», «Req X», ≤ 15 слов) — намеренные указатели.
- `#### Scenario:` блоки — описывают тестируемое поведение, не дублируют rationale.
- fenced-code-blocks — код не является производным от prose.

Для каждого флага детектор SHALL предлагать конкретный **pointer-rewrite**: что оставить, что заменить ссылкой вида «см. `<ssot-file>` → <anchor>».

Severity `warning`. Derivability **не растит exit-код**.

Формат: `<file>:<line>: [warning] derivability: <description> (pattern: <rationale-drift|constraint-restatement|decision-echo>)`.

### 3.11 — what-changes-coverage (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[what-changes-coverage: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет, что каждый пункт секции `## What Changes` в `proposal.md` адресован хотя бы одним Decision (`### D<N>`) в `design.md`.

**Алгоритм.** Для каждого пункта `## What Changes`:
1. Извлечь предметные термины: существительные, технические идентификаторы, имена детекторов/файлов/параметров (не служебные слова).
2. Проверить, встречаются ли ≥2 таких термина в теле любого `### D<N>` блока в `design.md`.
3. Если ни один Decision не покрывает пункт — выдать `[warning] what-changes-coverage`.

**Исключения:**
- Пункты без предметных терминов (только глагол + служебное слово, например «Обновить строку Summary», «Добавить счётчик») — пропускать.
- Если `design.md` не содержит `## Decisions` секции → `[what-changes-coverage: N/A — no Decisions section in design.md]` в Summary; детектор пропускается.

Severity `warning`. What-changes-coverage **не растит exit-код**.

Формат: `proposal.md:<line>: [warning] what-changes-coverage: What Changes item has no corresponding Decision in design.md`.

### 3.12 — decisions-coverage (soft, severity=warning)

**Только в режиме change-директории.** В других режимах пропускай с пометкой `[decisions-coverage: N/A — required artifacts not in scope]` в Summary.

Детектор проверяет, что каждое prescriptive Decision в `design.md` отражено хотя бы в одном Requirement в `specs/**/spec.md`.

**Алгоритм.** Для каждого `### D<N>` блока в `design.md`:
1. Проверить наличие prescriptive маркеров: SHALL, MUST, «должен», «обязан», «требует», «необходимо».
2. Если маркеры есть — извлечь предметные термины из заголовка и первого предложения Decision.
3. Проверить, встречаются ли ≥2 таких термина в имени или теле хотя бы одного `### Requirement:` в `specs/**/spec.md`.
4. Если ни один Requirement не покрывает Decision — выдать `[warning] decisions-coverage`.

**Исключения:**
- Decisions в секции `## Risks / Trade-offs` — не флагать.
- Decisions без prescriptive language → пропускать.
- Decisions с явной пометкой Non-Goal или «не входит в scope» → пропускать.

Severity `warning`. Decisions-coverage **не растит exit-код**.

Формат: `design.md:<line>: [warning] decisions-coverage: Decision '<D-name>' has no corresponding Requirement in spec`.

## Phase 4 — CONVERGE

Выполняй после Phase 3 (VALIDATE) и до Phase 5 (CROSS-CUT).

### Алгоритм — максимум 3 итерации

**Шаг 1 — SSOT-иерархия: каноническое значение**

Для каждого hard issue (numeric или semantic) определи SSOT-источник по приоритету:

`specs/**/spec.md` > `design.md` > `proposal.md` > `tasks.md`

Значение из файла с наивысшим приоритетом является каноническим. Все остальные вхождения subject'а приводятся к нему (BFS по exhaustive touch-list).

- Если два файла **одного приоритетного уровня** содержат конфликтующие значения → немедленно перейти к шагу 4 (decision gate).
- Если однозначный SSOT найден → продолжить шаг 2.

**Шаг 2 — Exhaustive touch-list**

Для каждого subject'а найди **все** вхождения по scope — не только конфликтующую пару. Расширяй секцию Cascade predictions формулировкой:

`To fully resolve '<subject>': <file1>:<line> (value: X), <file2>:<line> (value: Y), ...`

**Шаг 3 — Симуляция фиксов; прогон numeric + semantic**

Мысленно применяй канонические значения ко всем вхождениям touch-list. Прогони `numeric` и `semantic` детекторы на гипотетическом состоянии:

- **Нет новых issues** → конвергенция достигнута; в pass log: `Re-run numeric+semantic... found: none → stable`; перейти к финальному отчёту.
- **Есть новые issues** → это second-order issues; записать; повторить шаг 1 (следующая итерация).
- **3 итерации исчерпаны** → вывести `convergence not reached after 3 passes — re-run after applying fixes`; завершить Phase 4 с последним известным состоянием.

**Шаг 4 — Decision gate**

Срабатывает только при конфликте на одном SSOT-уровне. Скилл SHALL:

1. Немедленно прервать итерацию.
2. Вывести `--- Decision gate ---` с описанием развилки и вариантами + их каскадными следствиями.
3. Завершить Phase 4 — дальнейшие итерации не выполняются.

SHALL NOT угадывать направление развилки молча.

### Pass log — формат

Каждая итерация Phase 4 фиксируется блоком в отчёте (размещается после Cascade predictions, до Post-fix second-order issues):

```
--- CONVERGE pass <N> ---
<file>:<line> '<subject>' <old_value>→<new_value> (src: <ssot-file>:<line>)
...
Re-run numeric+semantic... found: <N issues | none → stable>
```

---

## Phase 5 — CROSS-CUT (conditional, whole-project scan)

Выполняй только если `PATH` = корень проекта / `openspec/` / `openspec/changes/`, т.е. видно больше одного change'а.

Для каждого subject'а (выделенного в semantic-детекторе) и для каждого pointer-а (из reference), затрагивающих больше одного change'а:

- сравни claim'ы между change'ами;
- флагай cross-change расхождения с той же severity, как в in-change детекторах;
- явно указывай, **между какими changes** найдено расхождение.

Если контекст переполнен и сканировать все changes за один проход нельзя — явно сообщи:

```
--- Context overflow ---
Context budget exceeded. Prioritized files: <A/B/C...>.
Re-run with PATH=<subdir> for coverage of: <remaining change-names>.
```

## Multi-pass convergence

Ты видишь все файлы сразу. Не запускай себя рекурсивно через внешний tool call — итерации выполняются внутри одного прогона в Phase 4. Вместо этого:

1. просканируй контекст;
2. выдели подозрительные узлы (файлы с частыми cross-refs, высокой связностью, пересечениями subjects) — объясни выбор в отчёте;
3. прогоняй детекторы (Phase 3);
4. для каждого hard issue выполняй Phase 4 (CONVERGE) — до 3 внутренних итераций, пока не стабилизируется или не сработает decision gate;
5. для каждого предложенного фикса **предскажи каскад**: «если пофиксить X, возникнет потенциальный broken-pointer Y», «если консолидировать в SSOT Z, три pointer'а в W нужно обновить».

Выдавай **consolidated отчёт** — один раз, с приоритизацией фиксов. Пользователь может внести правки и вызвать тебя снова для верификации.

## Residual risk

После завершения анализа оцени `residual_risk` — качественную оценку вероятности необнаруженных issues. Выводи последней строкой Summary. Значение: `low`, `medium` или `high`, за которым следует однострочное обоснование. Процентные значения не используются — они создают ложную точность.

- **low**: все файлы в PATH прочитаны полностью, context не переполнен, ambiguous-случаев не осталось, cross-ref граф линейный (≤ 1 узла с высокой связностью).
- **medium**: остались нерешённые ambiguous-случаи, или ≥ 2 узла с высокой связностью, или часть файлов пропущена из-за приоритизации без явного overflow.
- **high**: был явный context overflow (файлы не читались), или PATH содержит > 10 файлов и охват заведомо неполный.

## Report format

Выводи отчёт строго в этой структуре:

```
=== Contradiction report: <PATH> ===

--- Suspicious nodes (heuristic) ---
<file-1>: <reason-picked>
<file-2>: <reason-picked>
...

--- Hard issues (error) ---
<file>:<line>: [error] <class>: '<subject>' ... (at <other-file>:<line>)
...

--- Cascade predictions (if any) ---
- Fixing <issue-A> may break <pointer-B> at <file>:<line>.
- To fully resolve '<subject>': <file1>:<line> (value: X), <file2>:<line> (value: Y), ...
...

--- CONVERGE pass 1 ---                    ← опускается если Phase 4 не нашла hard issues
<file>:<line> '<subject>' <old>→<new> (src: <ssot-file>:<line>)
...
Re-run numeric+semantic... found: <N issues | none → stable>

--- CONVERGE pass 2 ---                    ← если понадобилась следующая итерация
...

--- Post-fix second-order issues ---       ← опускается при decision gate или отсутствии Phase-4 фиксов
<file>:<line>: [2nd-order] <class>: '<subject>' ...
...
(none)                                     ← если Phase 4 завершилась стабильно и новых issues нет

--- Soft warnings ---
<file>:<line>: [warning] redundancy: '<snippet>' duplicated in <other-file>:<line> (suggested SSOT: <file>, heuristic)
  → pointer-rewrite: replace with "см. <ssot-file> → <anchor>"
  → post-consolidation pointer check: <ok | broken at X>
...

--- Subjects covered by semantic detector ---
- <subject-1>
- <subject-2>
...

--- Summary ---
- hard: <N> (numeric=<a>, reference=<b>, deontic=<c>, semantic=<d>)
- warnings: <M> (redundancy=<r>, coverage=<cv>, placement=<pl>, spec-count=<sc>, semantic-completeness=<smc>, derivability=<dv>, what-changes-coverage=<wc>, decisions-coverage=<dc>)
- drift_score: <N*10 + M> (informational)
- convergence: <stable | decision-gate | max-iterations-reached | n/a — no hard issues>
- exit semantics: <clean | has-hard-issues>
- residual_risk: <low | medium | high> — <reason>
```

**Правила:**

- секции hard и soft — раздельны, hard всегда первой;
- sorting внутри секции: `(severity desc, file asc, line asc)`;
- severity-prefix обязателен (`[error]` / `[warning]`);
- `drift_score = hard × 10 + warnings × 1` — информационное число, **не строгий exit-код**. Это диалоговый инструмент, не CI-гейт;
- для `redundancy` обязательно показывать suggested SSOT и pointer-rewrite;
- N/A-детекторы фиксируются в Summary как `[<detector>: N/A — required artifacts not in scope]`;
- секции `--- CONVERGE pass N ---` и `--- Post-fix second-order issues ---` опускаются полностью если Phase 4 не запускалась (нет hard issues в Phase 3);
- `--- Post-fix second-order issues ---` также опускается при decision gate (нечего показывать — итерация прервана); при стабильной конвергенции без second-order issues выводить `(none)`;
- `convergence: n/a — no hard issues` когда Phase 4 не запускалась; иначе одно из `stable | decision-gate | max-iterations-reached`;
- `residual_risk` — последняя строка Summary; качественная оценка, не число.

## Fallback — когда что-то пошло не так

- `PATH` не существует → `ERROR: path not found: <PATH>`, остановись (при одном пути) или продолжи по остальным (при нескольких).
- Файлы не удалось прочитать → сообщи явно, не угадывай содержимое.
- Контекст переполнен → см. «Context overflow» в фазе CROSS-CUT.
- Двусмысленная формулировка (не можешь решить, один subject или разные) → выведи в отчёте с пометкой `ambiguous`, не делай выбор молча.

## Что скилл НЕ делает

- **НЕ** предлагает автоматический fix; только диагностика и предложения SSOT / pointer-rewrite.
- **НЕ** исполняет Python / bash / другой внешний код.
- **НЕ** изменяет файлы по своей инициативе.
- **НЕ** регистрирует автоматический `PostToolUse`-триггер — только ручной вызов.
- **НЕ** отождествляет `redundancy` с `derivability`: `redundancy` — буквальный или почти-буквальный дубликат блока текста в 2+ артефактах; `derivability` — явная переформулировка утверждения, логически следующего из другого артефакта, без добавления нового знания.

## When to run (рекомендации пользователю)

Если пользователь спрашивает «когда вызывать» — напомни:

- перед коммитом change-артефактов;
- после каждого перехода в графе `proposal ↔ design ↔ spec ↔ tasks`;
- после SSOT-консолидации (убрали повтор → проверить, не осталось ли упоминаний в других местах);
- при подозрении на расхождение (формулировка разъехалась между документами).
