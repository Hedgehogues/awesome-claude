# Test cases: state_manager.py

## Case: positive-happy-valid-step-from-allowed-stage
stub: fresh-repo
category: positive-happy
semantic:
  - acceptance: state_manager.py с валидным --step и current_stage ∈ allowed_from дописывает sets_stage в pending_transitions и завершается exit 0

## Case: positive-corner-step-from-edge-of-allowed-from
stub: fresh-repo
category: positive-corner
semantic:
  - acceptance: state_manager.py корректно принимает шаг, когда current_stage = последнее значение из многоэлементного pending_transitions (накопительная модель — последний элемент = текущий)

## Case: negative-missing-input-no-state-yaml
stub: fresh-repo
category: negative-missing-input
semantic:
  - acceptance: state_manager.py выводит понятное сообщение об ошибке (не KeyError) и завершается exit 2, когда skills/<ns>/<skill>/state.yaml не существует

## Case: negative-invalid-input-unknown-step-name
stub: fresh-repo
category: negative-invalid-input
semantic:
  - acceptance: state_manager.py выводит имя неизвестного шага в stderr и завершается exit 2, когда --step не найден в state.yaml; state-file не изменяется
