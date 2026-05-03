# write-then-replay-output Specification

## Purpose
TBD - created by archiving change skill-output-replay. Update Purpose after archive.
## Requirements
### Requirement: Финальная фаза скиллов apply/contradiction/archive пишет вывод в файл и воспроизводит его
Скиллы `sdd:apply`, `sdd:contradiction`, `sdd:archive` SHALL перед выводом форматированного финального блока записывать весь текст этого блока в `.log/<skill>-<ts>-output.md`, а затем воспроизводить содержимое файла через `cat` как последний шаг.

#### Scenario: Вывод доступен как файл после запуска apply
- **WHEN** пользователь запускает `/sdd:apply` и скилл завершает работу
- **THEN** в `.log/` появляется файл `apply-<timestamp>-output.md`
- **THEN** файл содержит полный текст финального блока: `## Описание`, `## Реализованные фичи`, `## Как проверить`, `## Вопросы к пользователю` (и `## Решено самостоятельно`, `## Прочее` — если присутствуют в выводе)
- **THEN** скилл выводит содержимое этого файла через `cat` в конце работы

#### Scenario: Вывод доступен как файл после запуска contradiction
- **WHEN** пользователь запускает `/sdd:contradiction`
- **THEN** в `.log/` появляется файл `contradiction-<timestamp>-output.md`
- **THEN** файл содержит блоки `## Что делать` и `## Вопросы к пользователю`

#### Scenario: Вывод доступен как файл после запуска archive
- **WHEN** пользователь запускает `/sdd:archive`
- **THEN** в `.log/` появляется файл `archive-<timestamp>-output.md`
- **THEN** файл содержит блоки `## Описание`, `## Архивированные артефакты`, `## Вопросы к пользователю` (и `## Решено самостоятельно`, `## Прочее` — если присутствуют в выводе)

#### Scenario: Запуск через Agent tool сохраняет доступ к выводу
- **WHEN** скилл запущен внутри Agent tool (суб-агент)
- **THEN** форматированный вывод записан в `-output.md` файл до завершения суб-агента
- **THEN** пользователь может прочитать файл из `.log/` даже если суб-агент вернул только summary

### Requirement: Технический лог и пользовательский вывод — отдельные файлы
В `.log/` SHALL существовать два отдельных файла для каждого запуска:
- `<skill>-<ts>.md` — технический дамп (детекторы, L1/L2/L3, вердикты)
- `<skill>-<ts>-output.md` — форматированный пользовательский вывод

#### Scenario: Два файла после одного запуска
- **WHEN** запущен `/sdd:apply` и скилл завершил работу
- **THEN** в `.log/` существует `apply-<ts>.md` с техническим дампом
- **THEN** в `.log/` существует `apply-<ts>-output.md` с пользовательским выводом
- **THEN** timestamps у обоих файлов совпадают

### Requirement: Изменения в skill-файлах синхронизируются с зеркалами
При добавлении write-then-replay фазы в `.claude/skills/sdd/<skill>/skill.md` аналогичные изменения SHALL быть применены к зеркалу `skills/sdd/<skill>/skill.md`.

#### Scenario: Зеркало синхронизировано после изменения скилла
- **WHEN** в `.claude/skills/sdd/apply/skill.md` добавлена write-then-replay фаза
- **THEN** `skills/sdd/apply/skill.md` содержит идентичные изменения
- **THEN** `diff .claude/skills/sdd/apply/skill.md skills/sdd/apply/skill.md` не показывает расхождений

