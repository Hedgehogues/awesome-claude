---
name: sdd:change-verify
workflow_step: 7
description: >
  Верифицирует реализацию OpenSpec change'а против задач из tasks.md.
  Активируй после /opsx:apply — когда нужно убедиться, что артефакты существуют,
  содержательны и подключены. Вызывай явно: /sdd:change-verify PATH=<change-dir|tasks.md>.
---

# Implementation verifier (sdd:change-verify)

Никакого внешнего кода, Python-модуля или bash-скриптов нет. Всё делаешь ты, модель, в одном прогоне.

## Input handling

Пользователь передаёт `PATH`. Определи режим:

1. **Change-директория** (содержит `tasks.md`) → читай `tasks.md` из неё.
2. **Явный путь к `tasks.md`** → читай указанный файл напрямую.

Если `tasks.md` не найден — выведи `ERROR: tasks.md not found at <PATH>` и остановись.

**Парсинг задач.** Из `tasks.md` извлекай все строки `- [x]` и `- [ ]` — как выполненные, так и невыполненные. Верифицируй все. Для каждой задачи извлеки:
- описание артефакта (файл, команда, секция документа, конфигурация);
- тип артефакта (skill, command, document, config, spec);
- путь к файлу если упоминается явно, иначе выводи из контекста.

Если артефакт не поддаётся идентификации — вердикт `human_needed` с пометкой «could not identify artifact».

**Парсинг групп.** Фиксируй `## N.` заголовки как границы групп. Каждая задача принадлежит ближайшему предшествующему заголовку.

## Task verification loop

Для каждой задачи:

1. Извлеки артефакт из текста задачи.
2. Прогони три уровня: **L1 Exists → L2 Substantive → L3 Wired**.
3. Вынеси вердикт: `done | partial | missing | human_needed`.

**Правила остановки:**
- L1 fail → вердикт `missing`, L2/L3 пропускаются.
- L2 fail → вердикт `partial` (file exists but stub/empty), L3 всё равно запускается.
- L3 fail → вердикт `partial` (exists and substantive, but not wired).
- L1 + L2 + L3 pass → вердикт `done`.
- L3 неприменим → помечай `N/A`, вердикт по L1+L2.

## L2 stub detection

Файл считается **заглушкой** (L2 fail) если содержит:

- `<!-- TODO -->`, `<!-- ... -->`, `<!-- placeholder -->` или аналогичные HTML-комментарии-заглушки;
- пустые секции: заголовок (`##`, `###`) с пустым телом или телом только из одного placeholder'а;
- нетронутые шаблонные заголовки без содержания (например, `## Context\n\n_TODO_`);
- файл состоит исключительно из frontmatter без тела.

Файл считается **содержательным** если:
- содержит специфичный для задачи текст или конфигурацию;
- нельзя получить механически без выполнения задачи (не дефолтный вывод генератора).

## L3 wiring heuristics

Для разных типов артефактов разные места проверки wiring:

| Тип | Где искать wiring |
|---|---|
| **skill** (`.claude/skills/sdd/*.md`) | упоминание в `CLAUDE.md` (Правила `sdd:*` скиллов) + в `README.md` (раздел скилла) |
| **command** (`.claude/commands/sdd/*.md`) | тело команды ссылается на соответствующий скилл (`sdd/<name>`) |
| **document** (`README.md`, `CLAUDE.md`, etc.) | cross-ref из связанных файлов или из самого workflow-описания |
| **config** (`.json`, `.yaml`, hooks) | упоминание пути в документации или в других конфигах которые его вызывают |
| **spec** (`specs/**/spec.md`) | упоминание в `design.md` → Testable contract pointer |

Если wiring для типа артефакта не применим или нет ожидаемого места для ref — помечай L3 как `N/A` и обоснуй.

Поиск wiring: ищи по имени файла (basename) и по полному пути в связанных файлах.

## Human-needed detection

Помечай задачу `human_needed` если:

- задача требует **live-запуска** скилла или команды (проверить что вывод корректен);
- задача требует **визуальной проверки** (UI, отображение в редакторе);
- задача требует **интеграции с внешним сервисом** (API, CI-pipeline);
- артефакт **не удалось идентифицировать** из текста задачи.

Для каждой `human_needed` задачи формулируй **конкретный шаг**:
- «requires live run: `/sdd:change-verify PATH=<конкретная-директория>`»
- «requires visual check: открыть `<файл>` и убедиться что `<что именно>`»
- «could not identify artifact from task description — уточни путь вручную»

## Group-level aggregation

После task-by-task прохода агрегируй результаты по группам (`## N.` разделам `tasks.md`):

- `complete` — все задачи группы `done` или `human_needed` (нет `partial`/`missing`)
- `incomplete` — есть хотя бы одна `partial` или `missing`
- `pending` — в группе нет задач с идентифицируемыми артефактами

Запись в отчёт: каждая группа → одна строка в секции `--- Group summary ---`.

## Cross-task convergence

Запускай **только если** есть хотя бы одна задача со статусом `partial` или `missing`.

Однопроходный скрининг на готовых результатах:

1. **Подозрительные узлы** — задачи `partial`/`missing`, чьи артефакты упоминаются в текстах других задач (имя файла или путь встречается в описании другой задачи).
2. **Каскад** — для каждого подозрительного узла: перечисли задачи Y и Z, которые зависят от его артефакта. Помечай их `cascade risk` — их L1 мог пройти, но если базовый артефакт missing, wiring ненадёжен.
3. **Межгрупповая связность** — если одна группа `complete`, а другая `incomplete` и между ними явная зависимость (например, skill создан → command должна ссылаться на него) — флагуй как межгрупповой разрыв.
4. **Consolidated вывод** с приоритизацией: сначала `BLOCKER` (missing + cascade), потом `partial`-задачи, потом `human_needed`.

## Heuristic optimization

Скилл вправе применять эвристики для снижения стоимости. Вердикт при этом остаётся честным.

**Правила:**
- **L1 fail → skip L2/L3**: нет смысла искать wiring несуществующего файла. Пропускай без отметки в отчёте.
- **Дедупликация чтений**: если несколько задач ссылаются на один файл — читай его один раз, переиспользуй результат для L2.
- **Skip convergence**: если нет ни одной `partial` или `missing` задачи — convergence пропускается полностью.
- **Batch L3** (при >20 задачах): объединяй L3 checks одного типа — все скиллы → один grep по `CLAUDE.md`; все команды → один grep по телам команд. Добавляй пометку `[optimized: batched L3 for <type>]` в отчёт.

Применение batch-оптимизации отмечается в отчёте. Остальные оптимизации — молча.

## Absence check

Выполняй **после task-by-task прохода**, до вывода финального отчёта.

**Алгоритм:**
1. Получи список изменённых файлов: `git diff --name-only HEAD` (или относительно базовой ветки если доступно).
2. Для каждого изменённого файла проверь: упоминается ли он (basename или полный путь) в тексте хотя бы одной задачи из `tasks.md`.
3. Несопоставленные файлы → секция `--- Out-of-scope changes ---` с пометкой «not referenced in any task».

Absence check **не влияет на task-вердикты** — это независимая проверка.

**Fallback:**
- git недоступен или PATH не является git-репозиторием → пропусти с пометкой `[absence check: N/A — git not available]` в Summary.
- Секция `--- Out-of-scope changes ---` присутствует только если есть несопоставленные файлы.

## Coverage smoke review

Выполняй если PATH — change-директория (рядом есть `proposal.md` и `specs/`).

**Алгоритм:**
1. Прочитай `proposal.md` — секции `What Changes` и `### New Capabilities`.
2. Прочитай все `specs/**/spec.md` — собери все блоки `### Requirement:`.
3. Для каждого Requirement — проверь: есть ли в `tasks.md` задача, которая его реализует. Совпадение по имени Requirement или ключевым словам артефакта.
4. Для каждого capability из `### New Capabilities` — проверь: есть ли задача, которая его создаёт.

Непокрытый Requirement или capability → секция `--- Coverage gaps ---`.

**Fallback:**
- `proposal.md` или `specs/` не найдены → пропусти с пометкой `[coverage review: N/A — no change artifacts]` в Summary.
- Секция `--- Coverage gaps ---` присутствует только если есть непокрытые элементы.

## Report format

Выводи отчёт строго в этой структуре:

```
=== Verification report: <PATH> ===

--- Task results ---
[1] <task-description-short>
    verdict: <done|partial|missing|human_needed>
    L1 exists:      <pass|fail|n/a>
    L2 substantive: <pass|fail|n/a>
    L3 wired:       <pass|fail|n/a>
    note: <объяснение если не done>

[2] ...

--- Group summary ---
Group 1. <group-name>: <complete|incomplete|pending>
Group 2. <group-name>: <complete|incomplete|pending>
...

--- Cross-task convergence ---     (только если есть partial/missing)
- BLOCKER Task N: <cascade reason>
- RISK Task M: <межгрупповой разрыв>
...

--- Gaps ---                       (только если есть partial/missing)
- Task N: <reason>
...

--- Human verification needed ---  (только если есть human_needed)
- Task M: <конкретный шаг>
...

--- Out-of-scope changes ---       (только если есть несопоставленные файлы)
- <filepath>: not referenced in any task
...

--- Coverage gaps ---              (только если есть непокрытые requirements/capabilities)
- Requirement «<name>»: no task found for this requirement
- Capability «<name>»: no task found for this capability
...

--- Summary ---
- done:         <N>
- partial:      <P>
- missing:      <M>
- human_needed: <H>
- total:        <T>
- verdict: <passed | gaps_found | human_needed>
```

**Правила итогового вердикта:**
- `passed` — все задачи `done` (нет `missing`, `partial` и `human_needed`)
- `gaps_found` — есть хотя бы одна `missing` или `partial`
- `human_needed` — нет `gaps_found`, но есть хотя бы одна задача `human_needed` (остальные `done`)

**Секции:**
- `--- Group summary ---` — присутствует всегда
- `--- Cross-task convergence ---` — только если есть `partial` или `missing`
- `--- Gaps ---` — только если есть `partial` или `missing`
- `--- Human verification needed ---` — только если есть `human_needed`
- `--- Out-of-scope changes ---` — только если есть несопоставленные файлы
- `--- Coverage gaps ---` — только если есть непокрытые Requirements или capabilities

## Fallback

- `PATH` не существует → `ERROR: tasks.md not found at <PATH>`, остановись.
- Файл не удалось прочитать → сообщи явно, не угадывай содержимое.
- Артефакт не удалось идентифицировать из описания задачи → вердикт `human_needed`, note: «could not identify artifact from task description».
- Контекст переполнен (слишком большой tasks.md или слишком много файлов) → сообщи явно: «Context budget exceeded. Verified N/M tasks. Re-run with PATH pointing to a smaller tasks.md or specific group.»
