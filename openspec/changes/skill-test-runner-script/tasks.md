## 1. Парсинг кейсов и стабов

- [ ] 1.1 Создать `skills/skill/test-skill/scripts/run_test.py` с CLI-интерфейсом: `run_test.py <ns>:<skill> [--run-id <id>] [--clean <run-id>]`
- [ ] 1.2 Реализовать парсинг `skills/<ns>/<skill>/cases/<skill>.md`: извлечь все `## Case:` блоки с полями `stub:`, `contains:`, `semantic:`
- [ ] 1.3 Реализовать парсинг YAML-frontmatter стабов из `skills/skill/test-skill/stubs/<name>.md`: поля `git`, `skills`, `files`, `mock_commands`, `env`, `openspec`
- [ ] 1.4 При отсутствии cases-файла — вывести `SKIP: no test spec for <ns>:<skill>` и выйти с кодом 0

## 2. Материализация стабов

- [ ] 2.1 Реализовать создание `$TMP` для каждого кейса через `tempfile.mkdtemp`; удалять `$TMP` после завершения кейса (не весь run_root)
- [ ] 2.2 Реализовать материализацию git-репозитория: `git init`, `git checkout -b <branch>`, `git commit --allow-empty` для каждого коммита из `git.commits`
- [ ] 2.3 Реализовать копирование skill-файлов из `skills/<ns>/<skill>/skill.md` в `$TMP/.claude/skills/<ns>/<skill>/`; также копировать `skills/<ns>/.manifest` если существует
- [ ] 2.4 Реализовать создание файлов из `files:` — записать содержимое по указанным путям в `$TMP`
- [ ] 2.5 Реализовать создание mock-команд из `mock_commands:` в `$TMP/.mocks/` с флагом executable
- [ ] 2.6 Реализовать создание `openspec/changes/<name>/` директорий из `openspec.changes`

## 3. Запуск скилла и сбор вывода

- [ ] 3.1 Проверить наличие `claude` CLI в PATH; при отсутствии — вывести инструкцию по устан��вке и выйти non-zero
- [ ] 3.2 Читать тело скилла из `skills/<ns>/<skill>/skill.md`, удалить YAML frontmatter (`---…---`)
- [ ] 3.3 Запустить `claude -p "<skill-body>" --cwd <TMP>` через `subprocess.run`, захватить stdout+stderr как `OUTPUT`; передать env vars из `env:` стаба + `PATH=$TMP/.mocks:$PATH`

## 4. YAML state и проверки

- [ ] 4.1 При старте: создать `~/.cache/awesome-claude/<run-id>/state.yaml` со всеми items в `status: pending`; если `--run-id` передан и файл существует — загрузить и пропустить `done`/`failed` items
- [ ] 4.2 Перед каждым кейсом: обновить его запись в `state.yaml` → `status: running`
- [ ] 4.3 Реализовать проверку `contains:` — substring match каждого правила в `OUTPUT`, записать PASS/FAIL
- [ ] 4.4 Реализовать автоматическую проверку `semantic:` правил по данным стаба: `branch` → git.branch в OUTPUT, `skills` → /ns:name в OUTPUT, `changes` → change names или (none) в OUTPUT; неизвестные ключи → `UNKNOWN — <rule>`
- [ ] 4.5 После каждого кейса: обновить `state.yaml` → `status: done|failed`, `verdict`, `duration_ms`

## 5. Отчёт и очистка

- [ ] 5.1 Вывести per-case результат в формате `Case: <name>  PASSED (N/N) | FAILED (M/N)` с детализацией по каждой проверке
- [ ] 5.2 Вывести итоговую строку `RESULT: X passed, Y failed (total checks: N)`
- [ ] 5.3 При наличии FAILED — вывести первые 20 строк `OUTPUT` упавшего кейса
- [ ] 5.4 Реализовать `--clean <run-id>`: удалить `~/.cache/awesome-claude/<run-id>/`; вывести путь к state.yaml после каждого прогона
- [ ] 5.5 Зеркалировать `skills/skill/test-skill/scripts/run_test.py` в `.claude/skills/skill/test-skill/scripts/`

## 6. Кейсы для run_test.py (spec: skill-test-runner-script)

**Контекст:** spec.md описывает 8 требований с 19 сценариями. Каждый сценарий должен стать именованным кейсом в `cases/test-skill.md`. Кейсы покрывают 4 категории матрицы TDD: `positive-happy`, `positive-corner`, `negative-missing-input`, `negative-invalid-input`. Для resume-сценариев нужен отдельный стаб с предсозданным `state.yaml`.

- [ ] 6.1 Создать `skills/skill/test-skill/cases/test-skill.md` — кейсы парсинга (spec: script parses cases file):
  - `positive-happy-cases-found`: stub `fresh-repo`, cases-файл существует → `contains: ["Case:"]`, нет exit non-zero
  - `negative-missing-input-no-cases-file`: stub `fresh-repo`, `dev:unknown` без cases-файла → `contains: ["SKIP: no test spec for dev:unknown"]`

- [ ] 6.2 Добавить кейсы материализации стабов (spec: script materializes stubs):
  - `positive-happy-fresh-repo-materializes`: stub `fresh-repo` → `contains: [".claude/skills/", "main"]`
  - `positive-corner-deploy-config-materializes`: stub `with-deploy-config` → `contains: ["Makefile", ".mocks/docker"]`

- [ ] 6.3 Создать stub `with-preexisting-state.md` — pre-existing `~/.cache/awesome-claude/<run-id>/state.yaml` с одним item в `status: done` и одним в `status: pending`

- [ ] 6.4 Добавить кейсы YAML state (spec: script maintains persistent YAML state):
  - `positive-happy-state-yaml-created`: новый run без `--run-id` → `contains: ["state.yaml", "pending"]`
  - `positive-corner-state-updated-after-item`: кейс завершён → `contains: ["done", "verdict"]`

- [ ] 6.5 Добавить кейсы resume (spec: script resumes interrupted runs):
  - `positive-corner-resume-skips-done-items`: stub `with-preexisting-state`, `--run-id` с done-item → `contains: ["skipped"]`
  - `positive-happy-fresh-run-new-id`: без `--run-id` → новый run-id генерируется, `contains: ["run_id:"]`

- [ ] 6.6 Добавить кейс claude CLI (spec: script runs skill via claude CLI):
  - `negative-missing-input-claude-missing`: `claude` не в PATH → `contains: ["ERROR: claude CLI not found"]`

- [ ] 6.7 Добавить кейсы проверок contains и semantic (spec: script checks contains rules + semantic rules):
  - `positive-happy-contains-pass`: contains-строка есть в OUTPUT → `contains: ["PASS", "RESULT:", "passed, 0 failed"]`
  - `negative-invalid-input-contains-fail`: contains-строки нет → `contains: ["FAIL", "RESULT:", "0 passed,"]`
  - `positive-happy-semantic-branch`: stub с `git.branch: feature-test`, OUTPUT содержит ветку → `contains: ["PASS"]`, `semantic: [branch]`
  - `positive-corner-semantic-changes-none`: stub без `openspec.changes`, OUTPUT содержит `(none)` → `contains: ["PASS"]`
  - `negative-invalid-input-unknown-semantic-key`: неизвестный ключ в `semantic:` → `contains: ["UNKNOWN —"]`

- [ ] 6.8 Добавить кейсы отчёта (spec: script prints final report):
  - `positive-happy-all-pass-report`: все кейсы прошли → `contains: ["RESULT:", "passed, 0 failed"]`
  - `positive-corner-some-fail-report`: есть FAILED → `contains: ["RESULT:", "0 passed,", "failed"]` + первые 20 строк OUTPUT

- [ ] 6.9 Добавить кейсы cleanup (spec: script cleans up state explicitly):
  - `positive-happy-tmp-deleted-after-case`: $TMP кейса отсутствует после завершения → `contains: ["cleaned up"]`
  - `positive-corner-state-persists-after-run`: после завершения всех кейсов state.yaml существует → `contains: ["state.yaml"]`
  - `positive-corner-explicit-cleanup`: `--clean <run-id>` → `contains: ["cleaned up", "removed"]`

- [ ] 6.10 Зеркалировать `skills/skill/test-skill/cases/test-skill.md` и `skills/skill/test-skill/stubs/with-preexisting-state.md` в `.claude/skills/skill/test-skill/`
