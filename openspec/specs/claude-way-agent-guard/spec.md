# claude-way-agent-guard Specification

## Purpose
TBD - created by archiving change skill-output-replay. Update Purpose after archive.
## Requirements
### Requirement: claude-way.md содержит правило write-then-replay для скиллов с форматированным выводом
`claude-way.md` SHALL содержать секцию, требующую write-then-replay паттерн для скиллов с форматированным многосекционным финальным выводом. Правило SHALL указывать: форматированный вывод записывается в файл, затем воспроизводится через `cat`; это гарантирует сохранность вывода при запуске через Agent tool.

#### Scenario: Правило присутствует в claude-way.md
- **WHEN** открыт файл `.claude/rules/claude-way.md`
- **THEN** файл содержит секцию о write-then-replay паттерне
- **THEN** секция объясняет проблему Agent tool (summary вместо полного вывода)
- **THEN** секция содержит требование SHALL для скиллов с форматированным финальным выводом

#### Scenario: Правило объясняет механику паттерна
- **WHEN** читатель изучает правило
- **THEN** понятно, что паттерн — это: запись вывода в файл → `cat` файла как последний шаг
- **THEN** понятно, к каким скиллам применяется (sdd:apply, sdd:contradiction, sdd:archive)

