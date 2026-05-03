## Context

SDD workflow: `propose → contradiction → apply → archive`. Центральный артефакт — `.sdd.yaml` с двумя полями:
- `creates`: новые capabilities, вводимые change'ом
- `merges-into`: существующие capabilities, модифицируемые change'ом

`sdd:archive` вызывает `openspec-archive-change` (шаг 6) для физического переноса `specs/<cap>/spec.md` → `openspec/specs/<cap>/spec.md`. После этого шаг 7 запускает inline L1/L2/L3 верификацию. Текущая реализация шага 7 читает только `creates` — `merges-into` не обрабатывается, несмотря на явное требование в спеке `sdd-propose-merge-dialog`.

`contradiction.py` — helper-скрипт `sdd:contradiction`: загружает все specs из `openspec/specs/index.yaml` и выдаёт Claude пакет для анализа. Скрипт читает `.sdd.yaml`, но переменная `relevant_names` вычислена и не использована. Capabilities из `creates`, не имеющие записи в `index.yaml` (draft, ещё не прошедшие apply), в пакет не попадают.

## Goals / Non-Goals

**Goals:**
- `sdd:archive` верифицирует `merges-into` capabilities (L1/L2/L3) и обновляет их описание в `index.yaml` — закрывает задокументированный пробел
- `contradiction.py` включает draft-спеки для `creates`-capabilities из директории change
- Убрать dead code `relevant_names` из `contradiction.py`

**Non-Goals:**
- Не меняем поведение `sdd:propose`, `sdd:apply`, `sdd:contradiction` skill.md (только скрипт)
- Не вводим новые поля в `.sdd.yaml`
- Не меняем формат L1/L2/L3 вердиктов

## Decisions

**D1: archive обрабатывает `merges-into` симметрично `creates`**

В шаге 7 `archive/skill.md` читаем `merges-into` наравне с `creates`. Для каждой capability из `merges-into` — тот же L1/L2/L3 pipeline. Разница с `creates`: для modified capability spec.md уже существует в `openspec/specs/` (merged на шаге 6 через `openspec-archive-change`), нужно только обновить описание в `index.yaml`. Verify-fail для `merges-into` — та же остановка с red-banner.

**D2: contradiction.py добавляет draft-спеки отдельным проходом**

После основного цикла по `all_specs` — второй проход по `creates`. Для каждой capability из `creates`, которой нет в `discovered_names`: искать `openspec/changes/<name>/specs/<cap>/spec.md`. Если файл найден — добавлять в `loaded` с флагом `draft: true` и пометкой `(draft)` в выводе. Не менять формат основного цикла.

**D3: `relevant_names` — удалить без замены**

После D2 переменная не нужна: фильтрация не требуется (основной цикл — full scan), draft-спеки обрабатываются отдельным проходом по `creates`. Удаление упрощает код и устраняет путаницу.

## Risks / Trade-offs

- **L1/L2/L3 для `merges-into`**: верификация читает live spec (уже merged). Если `openspec-archive-change` внёс некорректные изменения в spec.md — L1/L2/L3 это обнаружит. Это корректное поведение.
- **Draft-спеки в contradiction**: добавляем контент, не прошедший `apply`. Возможны противоречия между draft и live — это ожидаемо и полезно, именно для обнаружения таких расхождений contradiction и запускается.
- **Boundary**: если capability есть и в `creates`, и уже в `index.yaml` — основной цикл загрузит live spec, второй проход её пропускает. Пересечение не создаёт дубля.
