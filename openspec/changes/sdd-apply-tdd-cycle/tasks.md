## 1. Проверка prerequisite

- [ ] 1.1 В начале `sdd:apply` проверить наличие `skills/skill/test-skill/scripts/run_test.py`; при отсутствии — вывести `WARNING: run_test.py not found — TDD cycle skipped` и установить флаг `TDD_SKIP=true`

## 2. RED-check перед задачей

- [ ] 2.1 Перед каждой задачей (если `TDD_SKIP=false`): запустить `python3 skills/skill/test-skill/scripts/run_test.py <ns>:<skill>`
- [ ] 2.2 Если `run_test.py` вернул `SKIP:` — пропустить TDD-check для этой задачи, продолжить
- [ ] 2.3 Если все тесты PASSED — вывести `WARNING: tests already GREEN before task — RED phase unverifiable`, продолжить
- [ ] 2.4 Если есть FAILED — вывести `RED ✓ — proceeding`, продолжить с реализацией

## 3. GREEN-check после задачи

- [ ] 3.1 После выполнения задачи (если `TDD_SKIP=false` и RED-check не был SKIP): запустить `python3 skills/skill/test-skill/scripts/run_test.py <ns>:<skill>`
- [ ] 3.2 Если все тесты PASSED — пометить задачу выполненной, продолжить следующую
- [ ] 3.3 Если есть FAILED — вывести red-banner, вывести первые 20 строк вывода упавшего кейса, остановить apply

## 4. Интеграция и документация

- [ ] 4.1 Обновить `skills/sdd/apply/skill.md`: добавить описание TDD-цикла в task-loop (RED-check → реализация → GREEN-check)
- [ ] 4.2 Зеркалировать изменения в `.claude/skills/sdd/apply/skill.md`

## 5. Coverage audit — 4-category compliance (spec: skill-cases-4cat-audit)

**Контекст:** все 27 существующих case-файлов используют произвольные имена кейсов без категорийного префикса. `check-coverage-matrix.py` задекларирован в `skill-tdd-coverage-policy`, но не проверяет наличие 4 категорий по префиксу и не валидирует существование стабов. TDD-цикл в apply пропускает все скиллы через SKIP — это означает нулевую TDD-гарантию пока файлы не переименованы.

- [ ] 5.1 Обновить `skills/skill/scripts/check-coverage-matrix.py`: добавить детекцию категории по имени кейса (`positive-happy-*`, `positive-corner-*`, `negative-missing-input-*`, `negative-invalid-input-*`); вывести per-skill статус `OK | MISSING [<cats>] | STUB MISSING [<stubs>]` и итоговую строку `Coverage: N/N skills compliant`
- [ ] 5.2 Добавить в `check-coverage-matrix.py` валидацию стабов: для каждого `stub: <name>` в кейсе проверить наличие `skills/skill/test-skill/stubs/<name>.md`
- [ ] 5.3 Зеркалировать `check-coverage-matrix.py` в `.claude/skills/skill/scripts/`
- [ ] 5.4 Обновить `skills/sdd/apply/skill.md`: добавить вызов `check-coverage-matrix.py` перед task-loop; при нарушениях — WARNING-секция (не блокирует); при отсутствии скрипта — `WARNING: check-coverage-matrix.py not found — coverage audit skipped`
- [ ] 5.5 Зеркалировать обновлённый `apply/skill.md` в `.claude/skills/sdd/apply/`

## 6. Миграция существующих case-файлов к 4-category naming (spec: skill-cases-4cat-audit)

**Контекст:** 27 скиллов с кейсами. Стратегия: переименовать существующие кейсы к ближайшей категории; добавить stub-кейсы с `TODO:` для недостающих категорий. Маппинг: `happy-path-*` → `positive-happy-*`, `no-*` / `missing-*` → `negative-missing-input-*`, `fresh-repo-*` / `empty-*` / `edge-*` → `positive-corner-*`, `malformed-*` / `invalid-*` → `negative-invalid-input-*`; кейсы без явного маппинга — оцениваются индивидуально.

- [ ] 6.1 Мигрировать `dev/` namespace (10 скиллов): `commit`, `tracing`, `fix-tests`, `deploy`, `fix-bug`, `test-all`, `dead-features`, `init-repo`, `tdd`, `bump-version`
- [ ] 6.2 Мигрировать `sdd/` namespace (11 скиллов): `propose`, `apply`, `archive`, `audit`, `change-verify`, `contradiction`, `explore`, `help`, `repo`, `spec-verify`, `sync`, `bump-version`
- [ ] 6.3 Мигрировать `report/` namespace (3 скилла): `describe`, `session-report`, `bump-version`
- [ ] 6.4 Мигрировать `research/` namespace (2 скилла): `triz`, `bump-version`
- [ ] 6.5 Зеркалировать все обновлённые case-файлы в `.claude/skills/<ns>/<skill>/cases/`
- [ ] 6.6 Прогнать `check-coverage-matrix.py` после миграции — убедиться что все 27 скиллов показывают `OK`

## 7. Universal execution state (spec: universal-execution-state)

**Контекст:** сейчас `run_test.py` пишет `state.yaml` только для тест-прогонов (задекларировано в `skill-test-runner-script`), но нет единого механизма для skill-invocation state. `skill:test-all` не пишет никакого агрегированного стейта. Нужно три отдельных хранилища: `skill-runs/` (per-invocation), `test-runs/` (per `run_test.py` run), `test-all-runs/` (per `test-all` run). Скилл-тело не знает о стейте — ответственность на runner'е.

- [ ] 7.1 В `run_test.py`: перед каждым `claude -p` — создать `~/.cache/awesome-claude/skill-runs/<run-id>/state.yaml` со `status: pending`; после запуска — `status: running`; после завершения — `status: done | failed`, `finished_at`, `output_path`
- [ ] 7.2 В `run_test.py`: переместить существующий `state.yaml` теста из `~/.cache/awesome-claude/<run-id>/` в `~/.cache/awesome-claude/test-runs/<run-id>/`; обновить схему: добавить `test:`, `started_at:` на уровне run и поля `started_at`, `finished_at` на уровне кейса
- [ ] 7.3 В `run_test.py`: при создании skill-run записи заполнять `test_run_id` ссылкой на текущий тест-прогон (для drill-down)
- [ ] 7.4 Обновить `skills/skill/test-skill/skill.md`: добавить описание трёх хранилищ стейта и схем; обновить `--run-id` / `--clean` документацию под новые пути
- [ ] 7.5 Обновить `skills/skill/test-all/skill.md`: добавить aggregate state `~/.cache/awesome-claude/test-all-runs/<run-id>/state.yaml`; перед первым скиллом — создать файл со всеми skills в `pending`; перед каждым скиллом — `running`; после — `done | failed` + `test_run_id`; поддержать `--run-id` для resume (пропускать `done` скиллы)
- [ ] 7.6 Зеркалировать `run_test.py`, `test-skill/skill.md`, `test-all/skill.md` в `.claude/skills/skill/`
