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

**Шаг 3**: Вставь в пайплайн хардкодированные `opsx:*` якоря на фиксированных позициях:
- Позиция 4: `/opsx:propose` — предложить change, сгенерировать все артефакты за один шаг
- Позиция 6: `/opsx:apply` — реализовать задачи из tasks.md
- Позиция 8: `/opsx:archive` — архивировать завершённый change, синкнуть delta specs

Результирующий пайплайн при текущих скиллах (help=1, sync=2, repo=3, contradiction=5, change-verify=7, spec-verify=9, audit=[10]):

```
 1. /sdd:help          — точка входа, состояние репы + пайплайн
 2. /sdd:sync          — синхронизация субмодулей
 3. /sdd:repo          — управление репами в инвентаре
 4. /opsx:propose      — предложить change, сгенерировать все артефакты за один шаг
 5. /sdd:contradiction — вычитка артефактов на противоречия
 6. /opsx:apply        — реализовать задачи из tasks.md
 7. /sdd:change-verify — post-apply приёмка
 8. /opsx:archive      — архивировать завершённый change, синкнуть delta specs
 9. /sdd:spec-verify   — верификация по live-спеке
10. /sdd:audit         — аудит инвентаря (финальная проверка)
```

Для каждого шага выводи: номер, команду, однострочное описание из `description` скилла (или хардкодированное для opsx).

**Если найден новый `sdd:*` скилл с `workflow_step`**, вставь его в нужную позицию без изменений в этом файле.

Формат блока:

```
=== SDD Workflow ===

 1. /sdd:help          — <описание>
 2. /sdd:sync          — <описание из frontmatter>
 3. /sdd:repo          — <описание из frontmatter>
 4. /opsx:propose      — <описание>
 5. /sdd:contradiction — <описание из frontmatter>
 6. /opsx:apply        — <описание>
 7. /sdd:change-verify — <описание из frontmatter>
 8. /opsx:archive      — <описание>
 9. /sdd:spec-verify   — <описание из frontmatter>
10. /sdd:audit         — <описание из frontmatter>

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
