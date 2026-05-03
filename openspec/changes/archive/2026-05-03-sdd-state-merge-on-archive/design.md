## Context

В SDD workflow каждый change имеет два файла:

- `.sdd.yaml` — статическое определение: `creates`, `merges-into`, `owner`. Создаётся при propose, остаётся навсегда в архивной директории.
- `.sdd-state.yaml` — динамическое состояние: `stage`, `last_step_at`, `owner`. Мутирует на каждом шаге, удаляется при успешном archive.

Сейчас при удалении `.sdd-state.yaml` теряются `stage: archived` и `last_step_at` — единственные артефакты, фиксирующие момент завершения change'а.

## Goals / Non-Goals

**Goals:**
- Сохранять `stage` и `last_step_at` в `.sdd.yaml` при архивировании
- Убрать `.sdd-state.yaml` после мёрджа (lifecycle не меняется — файл всё равно удаляется)
- Не копировать `owner` из state (он первичен в `.sdd.yaml`)

**Non-Goals:**
- Менять поведение `.sdd-state.yaml` в активном workflow
- Объединять файлы в один в течение жизни change'а
- Добавлять в `.sdd.yaml` другие поля из state (кроме `stage`, `last_step_at`)

## Decisions

### D1: owner не копируется из state
`owner` существует в обоих файлах. `.sdd.yaml` — первичный источник; `owner` в `.sdd-state.yaml` мог расходиться (например, при смене owner через `set-owner`). Копирование state-owner в .sdd.yaml создало бы коллизию. Решение: `merge-state` копирует только `stage` и `last_step_at`.

### D2: merge-state как новая команда _sdd_yaml.py
`_sdd_yaml.py` управляет `.sdd.yaml`, `state.py` — `.sdd-state.yaml`. Мёрдж-операция читает из `.sdd-state.yaml` и пишет в `.sdd.yaml` — это ответственность `_sdd_yaml.py`. Альтернатива (добавить `merge-into-sdd` в `state.py`) отклонена: нарушает разделение — state.py не должен знать о структуре `.sdd.yaml`.

### D3: merge-state выполняется до delete, не после
Порядок в шаге 11: сначала `merge-state`, потом `delete`. Если `merge-state` упадёт — `.sdd-state.yaml` остаётся на месте, ничего не потеряно. Если сначала удалить — при падении `merge-state` данные будут потеряны безвозвратно.

## Risks / Trade-offs

[Что если `.sdd-state.yaml` отсутствует при вызове merge-state] → скрипт возвращает exit 0, `.sdd.yaml` не трогается. Идемпотентность.

[Поля stage/last_step_at в .sdd.yaml могут удивить читателя] → они появляются только в архивных копиях, где `.sdd-state.yaml` уже отсутствует — контекст очевиден.
