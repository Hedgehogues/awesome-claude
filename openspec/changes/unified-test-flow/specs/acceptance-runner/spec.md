## ADDED Requirements

### Requirement: `skill:test-acceptance` запускает acceptance cases по capability-имени
`/skill:test-acceptance <capability>` SHALL принимать имя capability и запускать все acceptance cases (`ac-*.md`), относящиеся к ней. Скилл резолвит путь cases через тот же алгоритм, что и `test-plan-to-cases.py`: `skills/<ns>/<cap>/cases/` если capability — скилл, иначе `openspec/specs/<cap>/cases/`.

#### Scenario: capability — скилл
- **WHEN** `/skill:test-acceptance setup-skill` где `skills/skill/setup/skill.md` существует
- **THEN** скилл читает все `skills/skill/setup/cases/ac-*.md`
- **THEN** каждый кейс прогоняется через единый eval-framework

#### Scenario: capability — не скилл
- **WHEN** `/skill:test-acceptance manifest` где соответствующего `<ns>/manifest/skill.md` нет
- **THEN** скилл читает все `openspec/specs/manifest/cases/ac-*.md`
- **THEN** каждый кейс прогоняется через тот же eval-framework

#### Scenario: capability без cases
- **WHEN** `/skill:test-acceptance <cap>` и acceptance cases не материализованы
- **THEN** скилл сообщает «no acceptance cases for <cap>» и завершается с статусом no-op
- **THEN** test-results не модифицируется

### Requirement: единый eval-framework и общий test-results файл
`skill:test-acceptance` SHALL использовать тот же eval-framework, что и `skill:test-skill`: bootstrap k=5, ≥4/5 для PASS, contains + LLM-judge assertions, прогресс в реальном времени. Результаты SHALL appended в общий `test-results/<timestamp>.md`, чтобы один прогон CI содержал и behavioral, и acceptance в одном артефакте.

#### Scenario: общий файл результатов
- **WHEN** в одном CI-прогоне вызваны `/skill:test-skill skill:setup` и `/skill:test-acceptance manifest`
- **THEN** оба создают/append'ят в один `test-results/<timestamp>.md`
- **THEN** записи отличаются только полем тип (behavioral / acceptance)

### Requirement: capability-имя валидируется перед запуском
`skill:test-acceptance` SHALL проверять, что переданное имя capability либо имеет соответствующий скилл, либо имеет `openspec/specs/<cap>/spec.md`. Если capability неизвестна — остановиться с ошибкой.

#### Scenario: неизвестная capability
- **WHEN** `/skill:test-acceptance bogus-name`
- **WHEN** ни `skills/*/bogus-name/skill.md`, ни `openspec/specs/bogus-name/spec.md` не существуют
- **THEN** скилл выводит `unknown capability: bogus-name` и останавливается с non-zero exit
