## Context

см. `proposal.md` → ## Why (мотивация и проблемы).

Затронуты все скиллы `sdd/` неймспейса: `sdd:explore`, `sdd:propose`, `sdd:contradiction`, `sdd:apply`, `sdd:archive`. Обновляется `docs/SKILL_DESIGN.md`. Новые поля добавляются в frontmatter, тело скиллов не изменяется.

## Goals / Non-Goals

**Goals:**
- Стандартный расширенный формат frontmatter: `triggers`, `preconditions`, `inputs`, `outputs`, `next_skill`
- Поле `namespace_sequence` — полная цепочка скиллов неймспейса в правильном порядке
- Обновление всех sdd/-скиллов согласно новому формату
- Документирование нового формата в `docs/SKILL_DESIGN.md`

**Non-Goals:**
- Не добавлять runtime-валидацию frontmatter инструментом
- Не трогать скиллы за пределами sdd/ неймспейса (изменение необязательно для других)
- Не менять тело (шаги) скиллов

## Decisions

### D1: Расширенный формат frontmatter

```yaml
---
name: sdd:propose
workflow_step: 4
description: >
  <однопараграфное summary — что делает скилл>
triggers:
  - <условие при котором пользователь вызывает этот скилл>
  - <ещё условие>
preconditions:
  - <что должно существовать до вызова>
inputs:
  - name: <ARGUMENTS или артефакт>
    description: <что ожидается>
outputs:
  - <что создаётся или изменяется>
next_skill: <ns:skill | null>
namespace_sequence:
  - step: 1
    skill: sdd:explore
    description: Исследование идеи, уточнение требований (опционально)
  - step: 4
    skill: sdd:propose
    description: Создание change — proposal, design, tasks, .sdd.yaml
  - step: 5
    skill: sdd:contradiction
    description: Проверка consistency перед реализацией
  - step: 6
    skill: sdd:apply
    description: Реализация задач из tasks.md
  - step: 7
    skill: sdd:archive
    description: Архивирование завершённого change
---
```

`workflow_step` сохраняется как числовой ключ для обратной совместимости. `namespace_sequence` дублирует ту же информацию в читаемом виде с описаниями.

### D2: `next_skill` — явная рекомендация следующего шага

В конце выполнения каждого скилла Claude ДОЛЖЕН вывести:
> «Следующий шаг в namespace: `/sdd:<next_skill>`»

Это правило фиксируется в `namespace_sequence`-секции `docs/SKILL_DESIGN.md`.

### D3: Порядок обновления файлов

Каждый скилл хранится в двух местах: `skills/sdd/<name>/skill.md` (источник) и `.claude/skills/sdd/<name>/skill.md` (зеркало). При обновлении оба файла изменяются синхронно.

### D4: `namespace_sequence` — в каждом скилле неймспейса

Одинаковый список `namespace_sequence` присутствует во frontmatter каждого скилла неймспейса. Это избыточность по данным, но исключает необходимость чтения всего каталога: Claude видит полную цепочку из одного файла.

### D5: `triggers` описывают намерение пользователя, а не команду

`triggers` — список фраз или ситуаций, при которых пользователь должен вызвать этот скилл. Отличие от `description`: `description` — что делает скилл, `triggers` — когда его вызывать.

## Risks / Trade-offs

[Frontmatter раздувается] → Новые поля добавляют ~15–20 строк на скилл. Оправдано: Claude загружает весь файл скилла, издержки минимальны при явной пользе от structured triggers/preconditions.

[namespace_sequence может рассинхронизироваться между скиллами неймспейса] → При добавлении нового скилла нужно обновить `namespace_sequence` во всех скиллах неймспейса. Это ручная дисциплина; автоматизации нет в scope этого change'а.

[next_skill — жёсткая связь между скиллами] → `next_skill: null` для финального скилла (`sdd:archive`). Для `sdd:explore` указывается `sdd:propose` как дефолт, хотя explore применим на любом этапе.
