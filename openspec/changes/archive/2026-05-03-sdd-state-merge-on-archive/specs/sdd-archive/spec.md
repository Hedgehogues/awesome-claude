## ADDED Requirements

### Requirement: archive step 11 merges state before delete

Шаг 9 `skills/sdd/archive/skill.md` SHALL выполнять операции в следующем порядке:
1. `python3 _sdd_yaml.py merge-state <change-dir>` — мёрджит `stage` и `last_step_at` в `.sdd.yaml`
2. hook удаляет `.sdd-state.yaml` (через pending_transitions → archived)

Порядок строго фиксирован: merge-state MUST выполняться до удаления state-файла.

#### Scenario: успешный archive — state-поля попадают в .sdd.yaml

- **WHEN** пользователь вызывает `/sdd:archive <name>` и verify прошёл
- **THEN** шаг 9 сначала вызывает `merge-state`; в архивном `.sdd.yaml` присутствуют поля `stage: archived` и `last_step_at`; `.sdd-state.yaml` удалён

#### Scenario: merge-state падает — .sdd-state.yaml остаётся

- **WHEN** `merge-state` завершается с ненулевым кодом
- **THEN** hook не срабатывает; `.sdd-state.yaml` остаётся на месте; данные не потеряны
