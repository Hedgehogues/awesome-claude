## ADDED Requirements

### Requirement: state_manager.py как единая точка входа

`skills/scripts/state_manager.py` SHALL принимать аргументы `--ns <namespace> --skill <skill-name> --step <step-name> --state-file <path>`, находить `skills/<ns>/<skill>/state.yaml`, валидировать допустимость шага из текущего state и записывать новый stage через `state.py update`.

#### Scenario: Валидный шаг из допустимого состояния

- **GIVEN** `skills/sdd/apply/state.yaml` содержит step `verify-passed` с `allowed_from: [verifying]`
- **GIVEN** `pending_transitions` = `"applying,verifying"` (предыдущие шаги уже дописаны)
- **WHEN** state_manager.py вызван с `--ns sdd --skill apply --step verify-passed --state-file <path>`
- **THEN** current_stage = `"verifying"` (последнее значение в pending_transitions)
- **THEN** state_manager.py дописывает `"verify-ok"`: `pending_transitions = "applying,verifying,verify-ok"` и exit 0

#### Scenario: Невалидный шаг — exit 2

- **WHEN** state_manager.py вызван с `--step unknown-step` которого нет в state.yaml
- **THEN** state_manager.py выводит ошибку в stderr и exit 2

#### Scenario: Переход из недопустимого состояния — exit 2

- **GIVEN** step `verify-passed` имеет `allowed_from: [verifying]`
- **WHEN** current_stage = proposed (не в allowed_from)
- **THEN** state_manager.py выводит ошибку в stderr и exit 2

#### Scenario: Отсутствующий state.yaml для скилла

- **WHEN** `skills/<ns>/<skill>/state.yaml` не существует
- **THEN** state_manager.py выводит понятную ошибку (не KeyError) и exit 2

### Requirement: Скиллы вызывают state_manager.py вместо state.py update

`skills/sdd/apply/skill.md`, `archive/skill.md`, `propose/skill.md`, `contradiction/skill.md` SHALL заменить прямые вызовы `state.py update <path> pending_transitions <X>` на `state_manager.py --ns sdd --skill <skill> --step <X> --state-file <path>`.

#### Scenario: apply вызывает state_manager.py на каждом шаге

- **WHEN** разработчик читает `skills/sdd/apply/skill.md`
- **THEN** скилл содержит вызовы `state_manager.py --ns sdd --skill apply --step <X>` на ключевых шагах
- **THEN** скилл НЕ содержит прямых `state.py update pending_transitions`
