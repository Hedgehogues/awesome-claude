## 1. Capability `test-flow`: spec и ownership

- [ ] 1.1 Создать `specs/test-flow/spec.md` с Requirements: владение `test-plan-to-cases.py`, layout cases (behavioral vs acceptance), правила материализации, правила резолва пути по capability
- [ ] 1.2 Описать в spec разделение behavioral (`<skill>.md`) vs acceptance (`ac-*.md`) с критериями: расположение, runner, формат имени
- [ ] 1.3 Описать алгоритм резолва пути материализации: поиск `skills/*/<cap>/skill.md`; если найден — `skills/<ns>/<cap>/cases/`; иначе — `openspec/specs/<cap>/cases/`

## 2. Переписать `test-plan-to-cases.py`

- [ ] 2.1 Удалить функцию `infer_namespace()` целиком из `skills/sdd/apply/scripts/test-plan-to-cases.py`
- [ ] 2.2 Реализовать функцию `find_skill_for_capability(project_root, cap)` — возвращает namespace или `None` через `glob skills/*/<cap>/skill.md`
- [ ] 2.3 Реализовать функцию `resolve_cases_dir(project_root, cap)` — если `find_skill_for_capability` вернул namespace, возвращает `skills/<ns>/<cap>/cases/`; иначе `openspec/specs/<cap>/cases/`
- [ ] 2.4 Заменить хардкод `cases_root = skills/skill/cases` на вызов `resolve_cases_dir` для каждой capability
- [ ] 2.5 Сохранить idempotent-семантику (не перезаписывать существующие файлы) и формат имени `ac-{NN:02d}-{slug}.md`
- [ ] 2.6 Удалить hardcoded import `os.makedirs(os.path.join(cases_root, ns, cap), exist_ok=True)` — заменить на makedirs `resolve_cases_dir(...)`

## 3. Расширить `skill:test-skill`

- [ ] 3.1 В `skills/skill/test-skill/skill.md` обновить шаг чтения cases: помимо `skills/$NS/$SKILL/cases/$SKILL.md` подхватывать все `skills/$NS/$SKILL/cases/ac-*.md` (по glob)
- [ ] 3.2 В выводе test-skill маркировать каждый кейс как `[behavioral]` или `[acceptance]` по имени файла (префикс `ac-` → acceptance)
- [ ] 3.3 Обновить `skills/skill/test-skill/cases/test-skill.md`: добавить кейсы `picks-up-acceptance-cases` (стаб со скиллом и `cases/ac-01-foo.md`) и `marks-acceptance-vs-behavioral`

## 4. Создать `skill:test-acceptance`

- [ ] 4.1 Создать `skills/skill/test-acceptance/skill.md` — принимает имя capability, резолвит путь cases (через ту же логику `resolve_cases_dir`), прогоняет каждый `ac-*.md` через eval-framework
- [ ] 4.2 Создать `commands/skill/test-acceptance.md` — slash-command обёртка
- [ ] 4.3 Создать `skills/skill/test-acceptance/cases/test-acceptance.md` с 4 категориями (positive-happy, positive-corner, negative-missing-input, negative-invalid-input)
- [ ] 4.4 Описать в `skill:test-acceptance` интеграцию с общим `test-results/<timestamp>.md` — append результатов в тот же файл что `skill:test-skill`

## 5. Capability `acceptance-runner`: spec

- [ ] 5.1 Создать `specs/acceptance-runner/spec.md` с Requirements про `skill:test-acceptance`: вход (capability-имя), резолв пути cases, прогон кейсов через единый eval-framework, формат отчёта
- [ ] 5.2 Описать сценарии: capability-скилл (cases в `skills/<ns>/<cap>/cases/`), capability-не-скилл (cases в `openspec/specs/<cap>/cases/`), capability без cases (no-op + статус)

## 6. Синхронизация `rules/skill-tdd-coverage.md`

- [ ] 6.1 Заменить путь в rule с `skills/skill/cases/<ns>/<skill>.md` на `skills/<ns>/<skill>/cases/<skill>.md` (вложенный, behavioral)
- [ ] 6.2 Добавить раздел про acceptance cases: путь рядом со скиллом (`skills/<ns>/<cap>/cases/ac-*.md`) или в openspec (`openspec/specs/<cap>/cases/ac-*.md`); ответственность за создание — `test-flow` capability
- [ ] 6.3 Указать, что behavioral coverage SHALL содержать минимум 4 категории; acceptance coverage = 1 кейс на каждый `acceptance_criterion`

## 7. Modified spec: skill-eval-framework

- [ ] 7.1 Создать `specs/skill-eval-framework/spec.md` с `## MODIFIED Requirements` или `## ADDED Requirements`: добавить разделение behavioral vs acceptance (если capability уже зармирована из install-modes)
- [ ] 7.2 Описать что `skill:test-skill` SHALL подхватывать acceptance cases рядом со скиллом

## 8. Modified spec: test-plan-link

- [ ] 8.1 Создать `specs/test-plan-link/spec.md` с `## MODIFIED Requirements`: уточнить что `test-plan.md` — контракт acceptance criteria; материализация в файлы регулируется capability `test-flow`, не `test-plan-link`

## 9. Снятие компромиссного флага из install-modes

- [ ] 9.1 Если `openspec/changes/install-modes/test-plan.md` содержит `generate_cases: false` — удалить эту строку (после archive install-modes corresponding scenario не нужен)
- [ ] 9.2 Если `install-modes` ещё не applied — обновить его `tasks.md` чтобы убрать упоминания флага

## 10. Live verification

- [ ] 10.1 На стабе с `.sdd.yaml.creates: [my-skill, my-config]` (где `my-skill` имеет `skills/dev/my-skill/skill.md`, `my-config` — нет) прогнать обновлённый `test-plan-to-cases.py`; проверить что cases для `my-skill` ушли в `skills/dev/my-skill/cases/`, для `my-config` — в `openspec/specs/my-config/cases/`
- [ ] 10.2 Прогнать `skill:test-skill dev:my-skill` и убедиться, что behavioral + acceptance кейсы оба запускаются
- [ ] 10.3 Прогнать `skill:test-acceptance my-config` и убедиться, что cases из `openspec/specs/my-config/cases/` запускаются
