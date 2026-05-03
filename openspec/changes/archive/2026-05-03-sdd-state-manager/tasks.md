## 1. state_manager.py

- [ ] 1.1 Создать `skills/scripts/state_manager.py`: принимает `--ns`, `--skill`, `--step`, `--state-file`. Находит `skills/<ns>/<skill>/state.yaml`, читает entry для step. Определяет `current_stage`: последнее значение `pending_transitions` если поле непустое, иначе — поле `stage` из state-файла. Проверяет `current_stage ∈ allowed_from`; при ошибке — exit 2. Дописывает `sets_stage` в конец `pending_transitions` через `state.py update` (накопительно: `"applying"` → `"applying,verifying"` → `"applying,verifying,verify-ok"`). Exit 0 при успехе.
- [ ] 1.2 Обработать отсутствующий `skills/<ns>/<skill>/state.yaml` — понятное сообщение (не KeyError), exit 2.
- [ ] 1.3 Обработать `--step` не найденный в state.yaml — exit 2 с именем шага в сообщении.
- [ ] 1.4 Добавить в `skills/scripts/state.py` константу `FINAL_STAGES = {"archived"}` рядом с `ALLOWED_TRANSITIONS` и субкоманду `is-final <stage>`: exit 0 если stage ∈ FINAL_STAGES, exit 1 иначе.
- [ ] 1.5 Обновить `skills/sdd/scripts/state_hook.py`: заменить хардкод `if last_applied == "archived"` на вызов `python3 state.py is-final <last_applied>` (exit 0 → удалить state-файл).

## 2. per-skill state.yaml

- [ ] 2.1 Создать `skills/sdd/apply/state.yaml` — steps: `start` (proposed/contradiction-ok → applying), `verify-start` (applying → verifying), `verify-passed` (verifying → verify-ok), `verify-failed` (verifying → verify-failed).
- [ ] 2.2 Создать `skills/sdd/archive/state.yaml` — steps: `start` (verify-ok → archiving), `archived` (archiving → archived), `archive-failed` (archiving → archive-failed).
- [ ] 2.3 Создать `skills/sdd/propose/state.yaml` — steps: `proposed` (unknown → proposed).
- [ ] 2.4 Создать `skills/sdd/contradiction/state.yaml` — steps: `ok` (proposed → contradiction-ok), `failed` (proposed → contradiction-failed).
- [ ] 2.5 Создать `skills/sdd/state.yaml` — namespace-defaults: owner, started_at.

## 3. Обновить skill.md (4 файла)

- [ ] 3.1 `skills/sdd/apply/skill.md`: заменить `state.py update <path> pending_transitions "applying,verifying,verify-ok"` на вызовы `state_manager.py --ns sdd --skill apply --step start`, `--step verify-start`, и `--step verify-passed` (или `--step verify-failed`).
- [ ] 3.2 `skills/sdd/archive/skill.md`: аналогично — заменить `state.py update pending_transitions "archiving,archived"` на `state_manager.py --step start` + `--step archived`.
- [ ] 3.3 `skills/sdd/propose/skill.md`: заменить `state.py update pending_transitions "proposed"` на `state_manager.py --ns sdd --skill propose --step proposed`.
- [ ] 3.4 `skills/sdd/contradiction/skill.md`: заменить на `state_manager.py --ns sdd --skill contradiction --step ok` / `--step failed`.

## 4. Тест-кейсы для state_manager.py

- [ ] 4.1 Создать `skills/scripts/cases/state_manager.md` — 4 категории: positive-happy (valid step), positive-corner (step from edge-of-allowed_from), negative-missing-input (no state.yaml), negative-invalid-input (unknown step name).
- [ ] 4.2 Расширить `skills/sdd/apply/cases/apply.md` — case `state-manager-called-on-each-step` (semantic: skill вызывает state_manager.py, не state.py update pending_transitions напрямую).

## 5. Документация

- [ ] 5.1 Обновить `docs/SKILL_DESIGN.md` — раздел «State automation» обновить: state_manager.py как декларативный роутер поверх pending_transitions.

## 6. Integration & verification (manual)

- [ ] 6.1 Прогнать full SDD workflow с state_manager.py вместо прямых update-вызовов — убедиться что transitions происходят корректно.
- [ ] 6.2 Проверить exit 2 на невалидном шаге — state-file не изменяется.
