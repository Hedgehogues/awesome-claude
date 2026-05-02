## 1. Документирование starter kit

- [ ] 1.1 Добавить `README.md` в `skills/skill/test-skill/stubs/` с описанием роли: "Starter kit — шаблоны для копирования при создании скилла. Не source of truth. Локальные копии могут расходиться."
- [ ] 1.2 Добавить D7 в `openspec/changes/skill-test-runner-script/design.md`: зафиксировать модель local-first резолюции и принцип независимого владения стабами

## 2. Обновление логики резолюции в skill:test-skill

- [ ] 2.1 В `skills/skill/test-skill/skill.md` обновить шаг 3a: искать стаб сначала в `skills/<ns>/<skill>/stubs/<name>.md`, затем fallback на `skills/skill/test-skill/stubs/<name>.md`
- [ ] 2.2 При fallback логировать: `stub resolved: global fallback (skills/skill/test-skill/stubs/<name>.md)`
- [ ] 2.3 При отсутствии в обоих местах — вывести `ERROR: stub <name> not found. Checked: <path1>, <path2>` и прервать кейс
- [ ] 2.4 Зеркалить изменения в `.claude/skills/skill/test-skill/skill.md`

## 3. Обновление логики резолюции в run_test.py

- [ ] 3.1 В `skills/skill/test-skill/scripts/run_test.py` реализовать функцию `resolve_stub(ns, skill, name)` → возвращает путь по local-first логике
- [ ] 3.2 Логировать источник стаба при каждом запуске кейса

## 4. Миграция существующих скиллов (создание локальных стабов)

- [ ] 4.1 Для каждого dev-скилла без исходного кода (`tracing`, `fix-bug`, `tdd`, `dead-features`, `fix-tests`) — создать `skills/dev/<skill>/stubs/` с адаптированными стабами, добавив реальные файлы для анализа
- [ ] 4.2 Зеркалить все новые `stubs/` директории в `.claude/skills/`
