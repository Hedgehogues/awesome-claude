---
name: sdd:help
workflow_step: 1
description: >
  Единая точка входа в SDD workflow. Активируй в начале каждой новой рабочей сессии
  (первое сообщение пользователя) — выводи сводку до ответа на запрос. Активируй также
  при явном вызове /sdd:help или когда пользователь спрашивает «какие инструменты есть»,
  «с чего начать», «как работает workflow».
---

# SDD Help

Никакого внешнего кода нет. Всё делаешь ты, модель, в одном прогоне.

## Что вывести

Выведи три блока по порядку:

1. **Состояние репы**
2. **Workflow pipeline**
3. **Explore (нелинейный инструмент)**

---

## Блок 1 — Состояние репы

Выполни и выведи:

```bash
git branch --show-current
git log --oneline -5
git status --short
```

Затем выведи:
- **Активные changes**: содержимое директорий в `openspec/changes/` исключая `archive/` — список имён.
- **Live specs**: содержимое `openspec/specs/` если директория существует — список файлов.

Формат блока:

```
=== Repo state ===
Branch: <branch>

Recent commits:
<git log output>

Uncommitted changes:
<git status --short output, или "none" если чисто>

Active changes:
- <change-name>
- ...
(none — если пусто)

Live specs:
- <spec-path>
- ...
(none — если пусто или директория не существует)
```

---

## Блок 2 — Workflow pipeline

Пайплайн строится динамически:

**Шаг 1**: Прочитай все файлы в `.claude/skills/sdd/`. Из каждого извлеки frontmatter-поля `name`, `description` (первые две строки), `workflow_step` и `display_positions`.

**Шаг 2**: Собери таблицу:
- Скиллы с `workflow_step` — в пронумерованный пайплайн, отсортированный по возрастанию значения.
- Скиллы с `display_positions` (например `[10]`) — вставляй в пайплайн на каждую из указанных позиций.
- Скиллы без `workflow_step` и без `display_positions` — в секцию «Дополнительно».

**Шаг 3**: Вставь в пайплайн хардкодированные `opsx:*` якоря как алиасы соответствующих sdd-команд:
- `/opsx:propose` — алиас для `/sdd:propose` (предложить change)
- `/opsx:apply` — алиас для `/sdd:apply` (реализовать задачи из tasks.md, со встроенным verify)
- `/opsx:archive` — алиас для `/sdd:archive` (архивировать со встроенной spec-верификацией)

Результирующий пайплайн при текущих скиллах (help=1, sync=2, repo=3, propose=4, contradiction=5, apply=6, archive=7, audit=[8]):

```
 1. /sdd:help          — точка входа, состояние репы + пайплайн
 2. /sdd:sync          — синхронизация субмодулей
 3. /sdd:repo          — управление репами в инвентаре
 4. /sdd:propose       — предложить change, сгенерировать все артефакты за один шаг
 5. /sdd:contradiction — вычитка артефактов на противоречия
 6. /sdd:apply         — реализовать задачи из tasks.md (verify встроен)
 7. /sdd:archive       — архивировать change, синкнуть delta specs (spec-verify встроен)
 8. /sdd:audit         — аудит инвентаря (финальная проверка)
```

**Verify теперь часть apply/archive** — отдельных команд `/sdd:change-verify` и `/sdd:spec-verify` больше нет.

Для каждого шага выводи: номер, команду, однострочное описание из `description` скилла.

**Если найден новый `sdd:*` скилл с `workflow_step`**, вставь его в нужную позицию без изменений в этом файле.

Формат блока:

```
=== SDD Workflow ===

 1. /sdd:help          — <описание>
 2. /sdd:sync          — <описание из frontmatter>
 3. /sdd:repo          — <описание из frontmatter>
 4. /sdd:propose       — <описание из frontmatter>
 5. /sdd:contradiction — <описание из frontmatter>
 6. /sdd:apply         — <описание из frontmatter>
 7. /sdd:archive       — <описание из frontmatter>
 8. /sdd:audit         — <описание из frontmatter>

--- Дополнительно ---
/sdd:<name>  — <описание>   ← скиллы без workflow_step и display_positions
```

---

## Блок 3 — Explore

Хардкодированная константа, всегда выводится отдельно от пайплайна:

```
=== Explore (нелинейный) ===

/opsx:explore  — войти в режим исследования идей, проблем, требований. Применим на любой фазе.
```

---

## Fallback

- Директория `.claude/skills/sdd/` не найдена → вывести `ERROR: .claude/skills/sdd/ not found`.
- Файл скилла не удалось прочитать → пропустить с пометкой `[skip: unreadable]`.
- `git` недоступен → пропустить Repo state с пометкой `[git: N/A]`.
- `openspec/changes/` не существует → вывести `(none)` для Active changes.
