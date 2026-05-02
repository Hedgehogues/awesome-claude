## Why

`sdd:apply` сейчас не контролирует порядок реализации задач. Исполнитель может реализовать задачу без теста, пропустить RED-фазу или написать тест после зелёного кода. Артефактная верификация (L1/L2/L3 из `merge-verify-into-apply-archive`) проверяет что файлы существуют и связаны — но не то, что тесты запускались красными до реализации и зелёными после.

Без TDD-цикла в apply: корнер-кейсы легко не покрыть, регрессии не поймать на ранней стадии, и нет машинной гарантии что каждая задача проходила через red→green.

См. `.sdd.yaml` для capability declarations.

## What Changes

- `sdd:apply` вызывает `run_test.py <ns>:<skill>` перед реализацией каждой задачи — ожидает RED (не все тесты зелёные). Если до задачи уже GREEN — выводит предупреждение: нет красного теста, TDD-цикл не может быть проверен.
- `sdd:apply` вызывает `run_test.py` после реализации задачи — ожидает GREEN. Если не GREEN — выводит red-banner и останавливается.
- При отсутствии `cases/<ns>/<skill>.md` — `run_test.py` возвращает SKIP, TDD-проверка пропускается для этого скилла (не блокирует).
- Поведение встраивается в существующий task-loop `openspec-apply-change`, не добавляет новый шаг пользователю.

## Capabilities

### New Capabilities

- `sdd-apply-tdd-cycle`: TDD-цикл в `sdd:apply` — вызов `run_test.py` до (RED) и после (GREEN) каждой задачи реализации; SKIP при отсутствии кейсов; stop при не-GREEN после реализации.
- `skill-cases-4cat-audit`: Аудит всех существующих case-файлов на соответствие 4-категорийному стандарту (`positive-happy`, `positive-corner`, `negative-missing-input`, `negative-invalid-input`); валидация существования стабов; интеграция `check-coverage-matrix.py` в pre-run `sdd:apply`; миграция всех 27 существующих case-файлов.
- `universal-execution-state`: Три раздельных хранилища стейта: `skill-runs/` (per `claude -p` invocation), `test-runs/` (per `run_test.py` run), `test-all-runs/` (aggregate per `skill:test-all` run); стейт обновляется по ходу выполнения; поддержка resume через `--run-id`; скилл-тело не знает о стейте.
