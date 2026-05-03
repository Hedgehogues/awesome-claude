# Tasks: archive-merges-into-impl

## 1. _sdd_yaml.py — команда update-index-description

- [ ] 1.1 Добавить функцию `cmd_update_index_description(index_path, capability, description)` в `skills/sdd/scripts/_sdd_yaml.py`: читать YAML, найти запись по `capability`, обновить `description`, записать обратно; exit 2 если не найдено
- [ ] 1.2 Зарегистрировать команду в `main()`: `update-index-description <index-path> <cap> <description>`
- [ ] 1.3 Обновить docstring (`CLI:` секцию) в `_sdd_yaml.py`
- [ ] 1.4 Скопировать изменения в `.claude/skills/sdd/scripts/_sdd_yaml.py`

## 2. skill.md — шаг 7 (верификация merges-into)

- [ ] 2.1 В `skills/sdd/archive/skill.md` шаг 7: в строке «Источник Requirements» добавить чтение `.sdd.yaml.merges-into` и указать, что capabilities из обоих полей верифицируются симметрично
- [ ] 2.2 Скопировать изменение в `.claude/skills/sdd/archive/skill.md`

## 3. skill.md — шаг 9 (обновление index.yaml для merges-into)

- [ ] 3.1 В `skills/sdd/archive/skill.md` шаг 9: добавить блок — перед записью `pending_transitions` обновлять `index.yaml` для каждой capability из `merges-into` через `_sdd_yaml.py update-index-description`
- [ ] 3.2 Скопировать изменение в `.claude/skills/sdd/archive/skill.md`

## 4. Smoke-тест

- [ ] 4.1 Вручную убедиться, что `_sdd_yaml.py update-index-description` работает на реальном `index.yaml`
- [ ] 4.2 Убедиться, что `skills/sdd/archive/skill.md` шаг 7 содержит упоминание `merges-into`
- [ ] 4.3 Убедиться, что `.claude/` копии совпадают с `skills/` копиями
