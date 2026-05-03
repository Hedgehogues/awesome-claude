## Context

В репе есть два уровня абстракции для работы с OpenSpec:
1. `openspec` CLI-бинарь (`/opt/homebrew/bin/openspec`) — инструмент командной строки
2. `opsx:*` — зарегистрированные Claude-скиллы-обёртки над CLI (в `.claude/commands/opsx/`)

`sdd:*` скиллы должны были делегировать Claude-скиллам `openspec-*`, которые не были зарегистрированы. `opsx:*` делают то же самое и зарегистрированы корректно.

Не все операции имеют простой CLI-эквивалент:
- `openspec new change <name>` — есть
- `openspec archive <name>` — есть
- `openspec explore` — нет, это интерактивный thinking-режим Claude
- `openspec apply` — нет одной команды, это multi-step: status → instructions → impl → mark-done

## Goals / Non-Goals

**Goals:**
- Все 4 `sdd:*` скилла работают без падения на первом шаге
- Понятное сообщение об ошибке если openspec не установлен
- Где есть CLI — использовать CLI (не Skill tool)
- Где нет CLI — использовать зарегистрированный `opsx:*` скилл

**Non-Goals:**
- Встраивать логику `opsx:apply` или `opsx:explore` непосредственно в sdd-скиллы
- Менять поведение или шаги скиллов кроме точек делегирования

## Decisions

**D1: Единый preflight-паттерн для всех 4 скиллов**

Добавить в начало каждого skill.md (до шага 1) блок:
```bash
if ! which openspec > /dev/null 2>&1; then
  echo "openspec not found. Install: npm install -g @openspec/cli"
  exit 1
fi
```
Это даёт понятную ошибку вместо `Unknown skill`.

**D2: sdd:propose — CLI напрямую**

Шаг 1 был: `Skill('openspec-propose', args)` → теперь:
1. Вывести пользователю запрос имени change (если не передан в args)
2. `openspec new change "<name>"` через Bash

Остальные шаги (2–11) не меняются.

**D3: sdd:explore — переключить на opsx:explore**

`sdd:explore` целиком состоит из вызова `openspec-explore`. Нет CLI-команды `openspec explore`. Правильный fix: `Skill('opsx:explore', args)`. Семантика та же — thinking-режим без имплементации.

**D4: sdd:apply — переключить на opsx:apply**

Шаг 5: `Skill('openspec-apply-change', args)` → `Skill('opsx:apply', args)`.
`opsx:apply` внутри использует `openspec status` + `openspec instructions apply` через CLI — это и есть правильный multi-step apply.

**D5: sdd:archive — CLI напрямую**

Шаг 6: `Skill('openspec-archive-change', args)` → `openspec archive "<name>" -y` через Bash.
Флаг `-y` нужен чтобы не блокироваться на интерактивном confirmation prompt.

**D6: Frontmatter-клинап во всех 4 скиллах**

Убрать из frontmatter `description:` каждого из 4 скиллов фразу "OpenSpec CLI устанавливается автоматически по версии из `.openspec-version`". Файл `.openspec-version` не существует в репе — фраза вводит в заблуждение. Preflight в D1 заменяет это поведение явной проверкой.

## Risks / Trade-offs

- `opsx:apply` и `opsx:explore` — это Skill calls, значит зависимость от регистрации этих скиллов остаётся. Но `opsx:*` реально зарегистрированы в `.claude/commands/opsx/`, в отличие от `openspec-*`.
- При обновлении `opsx:*` скиллов поведение `sdd:apply` и `sdd:explore` изменится автоматически — это ожидаемо и правильно.
- `openspec archive -y` пропускает confirmation prompt — это допустимо, так как `sdd:archive` сам делает pre-verification перед этим шагом.
