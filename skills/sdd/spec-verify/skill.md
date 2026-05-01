---
name: sdd:spec-verify
workflow_step: 9
description: >
  Верифицирует текущую реализацию против контракта в spec.md — проверяет, что каждый
  Requirement из spec.md реализован в существующих артефактах (скиллы, команды, CLAUDE.md,
  README.md, конфиги). Активируй после архивирования change'а, когда tasks.md недоступен
  но нужно убедиться что реализация соответствует живой спеке. Вызывай явно:
  /sdd:spec-verify PATH=<spec.md|dir-with-spec.md>.
---

# Spec verifier (sdd:spec-verify)

Никакого внешнего кода, Python-модуля или bash-скриптов нет. Всё делаешь ты, модель, в одном прогоне.

## Input handling

Пользователь передаёт `PATH`. Определи источник spec в следующем порядке:

1. **Явный путь к `spec.md`** → читай указанный файл напрямую.
2. **Директория, содержащая `spec.md`** → читай `spec.md` из неё.
3. Иначе → выведи `ERROR: spec.md not found at <PATH>` и остановись.

## Requirement parsing

Из `spec.md` извлекай все `### Requirement:` блоки.

**Если spec содержит секции-операции** (`## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`):
- Обрабатывай блоки из `## ADDED Requirements` — стандартная верификация (L1/L2/L3).
- Блоки из `## REMOVED Requirements` — **инвертированная L1**: артефакт **должен отсутствовать**. L1 pass = файл НЕ существует; L1 fail = файл существует (удаление не выполнено). L2/L3 для REMOVED не применяются (N/A).
- Блоки из `## MODIFIED Requirements` → вердикт `human_needed`, note: «MODIFIED delta blocks not supported in v1».

**Парсинг групп.** Заголовки секций-операций (`## ADDED Requirements` и т.д.) служат границами групп. Если секций-операций нет — все Requirements в одной группе «All requirements».

## Requirement → артефакт

Для каждого Requirement модель самостоятельно выводит реализующий артефакт из текста:

| Признак в тексте Requirement | Тип | Путь |
|---|---|---|
| Путь в backticks (`` `.claude/skills/sdd/foo.md` ``) | skill / file | указан явно |
| Упоминание скилла (`/sdd:foo`, `sdd/foo`) | skill + command | `.claude/skills/sdd/foo.md` + `.claude/commands/sdd/foo.md` |
| Секция документа (`CLAUDE.md → <section>`, `README.md → <section>`) | document | проверить секцию в файле |
| Конфиг (`.claude/settings.json`, `.mcp.json`) | config | указан явно |

Если артефакт не идентифицирован → вердикт `human_needed`, note: «could not identify artifact from Requirement text».

Если Requirement описывает **runtime-поведение** без конкретного файла → вердикт `human_needed`, note: «requires live run».

## Task verification loop

Для каждого Requirement:

1. Извлеки артефакт по таблице выше.
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

| Тип | Где искать wiring |
|---|---|
| **skill** (`.claude/skills/sdd/*.md`) | упоминание в `CLAUDE.md` + в `README.md` (раздел скилла) |
| **command** (`.claude/commands/sdd/*.md`) | тело команды ссылается на соответствующий скилл (`sdd/<name>`) |
| **document** (`README.md`, `CLAUDE.md`, etc.) | cross-ref из связанных файлов или из самого workflow-описания |
| **config** (`.json`, `.yaml`) | упоминание пути в документации или в других конфигах которые его вызывают |

Если wiring для типа артефакта не применим — помечай L3 как `N/A` и обоснуй.

Поиск wiring: ищи по имени файла (basename) и по полному пути в связанных файлах.

## Human-needed detection

Помечай Requirement `human_needed` если:

- требует **live-запуска** скилла или команды;
- требует **визуальной проверки**;
- артефакт **не удалось идентифицировать** из текста Requirement.

Для каждого `human_needed` формулируй **конкретный шаг**:
- «requires live run: `/sdd:spec-verify PATH=<конкретный-spec.md>`»
- «could not identify artifact from Requirement text — уточни путь вручную»

## Group-level aggregation

После прохода по всем Requirements агрегируй результаты по группам (секции-операции `## ADDED Requirements` и т.д.; при их отсутствии — одна группа «All requirements»):

- `complete` — все Requirements группы `done` или `human_needed`
- `incomplete` — есть хотя бы один `partial` или `missing`
- `pending` — нет Requirements с идентифицируемыми артефактами

## Coverage smoke review

В spec-mode tasks.md нет — coverage review всегда пропускается с пометкой `[coverage review: N/A — spec-mode, no tasks.md]` в Summary.

## Absence check

Выполняй **после прохода по Requirements**, до вывода финального отчёта.

**Алгоритм:**
1. Получи список изменённых файлов: `git diff --name-only HEAD`.
2. Для каждого изменённого файла проверь: упоминается ли он (basename или полный путь) в тексте хотя бы одного Requirement из spec.md.
3. Несопоставленные файлы → секция `--- Out-of-scope changes ---`.

**Fallback:** git недоступен → пропусти с пометкой `[absence check: N/A — git not available]` в Summary.

## Report format

Выводи отчёт строго в этой структуре:

```
=== Verification report: <PATH> ===

--- Task results ---
[1] <requirement-name-short>
    verdict: <done|partial|missing|human_needed>
    L1 exists:      <pass|fail|n/a>
    L2 substantive: <pass|fail|n/a>
    L3 wired:       <pass|fail|n/a>
    note: <объяснение если не done>

[2] ...

--- Group summary ---
Group ADDED Requirements: <complete|incomplete|pending>
...

--- Gaps ---                       (только если есть partial/missing)
- Requirement N: <reason>
...

--- Human verification needed ---  (только если есть human_needed)
- Requirement M: <конкретный шаг>
...

--- Out-of-scope changes ---       (только если есть несопоставленные файлы)
- <filepath>: not referenced in any requirement
...

--- Summary ---
- done:         <N>
- partial:      <P>
- missing:      <M>
- human_needed: <H>
- total:        <T>
- [coverage review: N/A — spec-mode, no tasks.md]
- verdict: <passed | gaps_found | human_needed>
```

**Правила итогового вердикта:**
- `passed` — все Requirements `done`
- `gaps_found` — есть хотя бы один `missing` или `partial`
- `human_needed` — нет `gaps_found`, но есть хотя бы один `human_needed`

## Fallback

- `PATH` не существует → `ERROR: spec.md not found at <PATH>`, остановись.
- Файл не удалось прочитать → сообщи явно, не угадывай содержимое.
- Артефакт не идентифицирован → вердикт `human_needed`, note: «could not identify artifact from Requirement text».
- Контекст переполнен → сообщи явно: «Context budget exceeded. Verified N/M requirements. Re-run with PATH pointing to a specific spec.md.»
