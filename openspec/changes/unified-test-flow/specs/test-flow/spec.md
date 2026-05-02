## ADDED Requirements

### Requirement: capability `test-flow` владеет test-generation pipeline
Capability `test-flow` SHALL быть единым формальным владельцем:
- скрипта материализации acceptance cases (`skills/sdd/apply/scripts/test-plan-to-cases.py`),
- layout cases в репе (behavioral vs acceptance),
- правил резолва пути материализации.

Любая правка скрипта или layout SHALL проходить через изменение spec этой capability.

#### Scenario: скрипт имеет formal owner
- **WHEN** developer хочет изменить логику генерации acceptance cases
- **THEN** изменение спека `test-flow` обязательно перед изменением кода
- **THEN** PR трогающий `test-plan-to-cases.py` без изменения spec блокируется

### Requirement: behavioral cases живут рядом со скиллом по фиксированному пути
Cases описывающие поведение скилла (lifecycle, idempotency, error handling, граничные значения) SHALL храниться в `skills/<ns>/<skill>/cases/<skill>.md`. Один файл содержит несколько `## Case:` блоков, покрывающих 4 категории по `rules/skill-tdd-coverage.md`.

#### Scenario: behavioral case path
- **WHEN** developer создаёт behavioral case для скилла `<ns>:<skill>`
- **THEN** файл создаётся по пути `skills/<ns>/<skill>/cases/<skill>.md`
- **THEN** имя файла совпадает с именем скилла

### Requirement: acceptance cases имеют префикс `ac-` и материализуются по правилу резолва
Cases описывающие acceptance criteria capability (наблюдаемые контракты из `test-plan.md`) SHALL храниться в:
- `skills/<ns>/<cap>/cases/ac-NN-<slug>.md` — если capability имеет соответствующий скилл (`skills/<ns>/<cap>/skill.md` существует);
- `openspec/specs/<cap>/cases/ac-NN-<slug>.md` — если такого скилла нет.

Имя файла SHALL начинаться с префикса `ac-` и включать порядковый номер критерия (`NN:02d`) и slug текста criterion.

#### Scenario: capability — скилл, cases рядом со скиллом
- **WHEN** capability `<cap>` имеет файл `skills/<ns>/<cap>/skill.md`
- **WHEN** материализация acceptance criterion из `test-plan.md`
- **THEN** файл создаётся по пути `skills/<ns>/<cap>/cases/ac-{NN:02d}-{slug}.md`

#### Scenario: capability — не скилл, cases рядом со spec
- **WHEN** capability `<cap>` не имеет файла `skills/*/<cap>/skill.md` ни в одном namespace
- **WHEN** материализация acceptance criterion
- **THEN** файл создаётся по пути `openspec/specs/<cap>/cases/ac-{NN:02d}-{slug}.md`

#### Scenario: behavioral и acceptance cosуществуют в одной директории
- **WHEN** capability является скиллом и имеет behavioral cases
- **THEN** в `skills/<ns>/<cap>/cases/` находятся одновременно `<cap>.md` (behavioral) и `ac-*.md` (acceptance)
- **THEN** разделение ролей определяется по префиксу имени файла

### Requirement: алгоритм резолва пути материализации без эвристик
`test-plan-to-cases.py` SHALL определять путь материализации только по факту существования файла `skills/*/<cap>/skill.md`. Подстрочные эвристики по имени capability (`infer_namespace()` или подобные) SHALL NOT использоваться.

#### Scenario: эвристика по подстроке отсутствует
- **WHEN** code review скрипта `test-plan-to-cases.py`
- **THEN** функция `infer_namespace` отсутствует
- **THEN** namespace определяется только через `glob('skills/*/<cap>/skill.md')`

#### Scenario: множественные совпадения скилла
- **WHEN** capability `foo` имеет соответствующий skill в одном namespace
- **THEN** `find_skill_for_capability` возвращает один namespace
- **THEN** ambiguous-случай (несколько namespace содержат `<cap>/skill.md`) обрабатывается явным error'ом, не silent выбором первого

### Requirement: idempotent материализация
`test-plan-to-cases.py` SHALL не перезаписывать уже существующие case-файлы при повторном запуске.

#### Scenario: повторный запуск
- **WHEN** скрипт уже создал `ac-01-foo.md` в предыдущем run
- **WHEN** повторный запуск с тем же `test-plan.md`
- **THEN** существующий файл не перезаписывается
- **THEN** новые criteria (если добавлены) — материализуются как новые файлы
