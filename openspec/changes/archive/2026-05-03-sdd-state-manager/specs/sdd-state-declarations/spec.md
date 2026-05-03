## ADDED Requirements

### Requirement: per-skill state.yaml с декларативными правилами

`skills/<ns>/<skill>/state.yaml` SHALL существовать для каждого sdd-скилла (apply, archive, propose, contradiction) и содержать:
- `steps:` — словарь шагов, каждый с `sets_stage` и `allowed_from`

Формат:
```yaml
steps:
  <step-name>:
    sets_stage: <target-stage>
    allowed_from:
      - <allowed-current-stage>
```

#### Scenario: apply/state.yaml содержит все шаги

- **WHEN** читается `skills/sdd/apply/state.yaml`
- **THEN** содержит шаги: `start`, `verify-start`, `verify-passed`, `verify-failed`
- **THEN** каждый шаг имеет `sets_stage` и `allowed_from`
- **THEN** цепочка покрывает полный путь: `proposed → applying → verifying → verify-ok`

#### Scenario: archive/state.yaml содержит все шаги

- **WHEN** читается `skills/sdd/archive/state.yaml`
- **THEN** содержит шаги: `start` (verify-ok → archiving), `archived` (archiving → archived), `archive-failed` (archiving → archive-failed)

### Requirement: namespace-level state.yaml содержит общие поля

`skills/sdd/state.yaml` SHALL содержать namespace-defaults: список общих полей state (owner, started_at) и их схему.

#### Scenario: namespace state.yaml задаёт общие поля

- **WHEN** state_manager.py инициализирует новый state-file
- **THEN** читает `skills/sdd/state.yaml` для namespace-defaults
- **THEN** включает поля `owner` и `started_at` в начальный state
