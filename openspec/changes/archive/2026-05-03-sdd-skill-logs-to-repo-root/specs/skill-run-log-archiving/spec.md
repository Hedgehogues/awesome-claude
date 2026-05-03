## MODIFIED Requirements

### Requirement: Каждый запуск SDD-скилла создаёт timestamped лог-файл
При каждом запуске скиллов `sdd:contradiction`, `sdd:apply`, `sdd:propose`, `sdd:archive` SHALL создаваться файл `.logs/<change-name>/<skill>-<YYYYMMDDTHHmmss>.md` с полным техническим отчётом. Директория `.logs/<change-name>/` SHALL создаваться автоматически при первом запуске.

#### Scenario: Лог создаётся после запуска contradiction
- **WHEN** пользователь запускает `/sdd:contradiction` на change-директории
- **THEN** в `.logs/<name>/` (в корне репозитория) появляется файл `contradiction-<timestamp>.md`
- **THEN** файл содержит полный вывод детекторов (эквивалент текущего `## Технические статусы`)

#### Scenario: Повторный запуск создаёт новый файл
- **WHEN** пользователь запускает тот же скилл на том же change повторно
- **THEN** создаётся новый файл с новым timestamp
- **THEN** предыдущий лог-файл сохраняется без изменений

#### Scenario: Лог создаётся при отсутствии директории .logs/<name>/
- **WHEN** директория `.logs/<name>/` ещё не существует в корне репозитория
- **THEN** скилл создаёт её и записывает файл без ошибки

#### Scenario: Логи всех четырёх скиллов кладутся в единую директорию
- **WHEN** пользователь последовательно запускает contradiction, apply, propose, archive на одном change
- **THEN** все лог-файлы оказываются в `.logs/<name>/` в корне репозитория
- **THEN** каждый файл имеет имя вида `<skill>-<timestamp>.md`

### Requirement: .logs/ директория не попадает в git
Корневая директория `.logs/` SHALL быть исключена из git через паттерн `.logs/` в `.gitignore`. Паттерн `**/.log/` SHALL быть удалён из `.gitignore`.

#### Scenario: .logs/ не отображается в git status
- **WHEN** скилл записал лог-файл в `.logs/<name>/`
- **THEN** `git status` не показывает файлы из `.logs/` как untracked или modified

### Requirement: .logs/<name>/ содержит отдельный файл пользовательского вывода с суффиксом -output
Файловая структура `.logs/<change-name>/` SHALL поддерживать именование `<skill>-<ts>-output.md` для файлов пользовательского вывода, отличая их от технических логов `<skill>-<ts>.md`.

#### Scenario: Файл пользовательского вывода именован с суффиксом -output
- **WHEN** скилл `sdd:apply`, `sdd:contradiction` или `sdd:archive` завершает работу
- **THEN** файл пользовательского вывода имеет имя вида `<skill>-<YYYYMMDDTHHmmss>-output.md` в `.logs/<name>/`
- **THEN** технический лог имеет имя вида `<skill>-<YYYYMMDDTHHmmss>.md` (без суффикса)
- **THEN** оба файла имеют одинаковый timestamp
