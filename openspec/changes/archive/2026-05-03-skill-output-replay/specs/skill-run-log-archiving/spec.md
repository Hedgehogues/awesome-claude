## ADDED Requirements

### Requirement: .log/ содержит отдельный файл пользовательского вывода с суффиксом -output
Файловая структура `.log/` SHALL поддерживать именование `<skill>-<ts>-output.md` для файлов пользовательского вывода, отличая их от технических логов `<skill>-<ts>.md`.

#### Scenario: Файл пользовательского вывода именован с суффиксом -output
- **WHEN** скилл `sdd:apply`, `sdd:contradiction` или `sdd:archive` завершает работу
- **THEN** файл пользовательского вывода имеет имя вида `<skill>-<YYYYMMDDTHHmmss>-output.md`
- **THEN** технический лог имеет имя вида `<skill>-<YYYYMMDDTHHmmss>.md` (без суффикса)
- **THEN** оба файла имеют одинаковый timestamp
