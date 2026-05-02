## ADDED Requirements

### Requirement: skill:test-skill подхватывает acceptance cases рядом со скиллом
`skill:test-skill <ns>:<skill>` SHALL читать не только `skills/<ns>/<skill>/cases/<skill>.md` (behavioral), но и все `skills/<ns>/<skill>/cases/ac-*.md` (acceptance). Каждый файл с префиксом `ac-` рассматривается как отдельный Case. Так single-call skill:test-skill покрывает оба типа cases для скилла-capability.

#### Scenario: behavioral и acceptance вместе
- **WHEN** в `skills/skill/setup/cases/` лежат `setup.md` (behavioral) и `ac-01-creates-symlink.md` (acceptance)
- **WHEN** вызван `skill:test-skill skill:setup`
- **THEN** скилл прогоняет все `## Case:` из `setup.md`
- **THEN** скилл прогоняет каждый `ac-*.md` файл как отдельный Case
- **THEN** в test-results кейсы маркированы как `[behavioral]` или `[acceptance]` по префиксу имени файла

#### Scenario: только behavioral cases
- **WHEN** в `skills/<ns>/<skill>/cases/` нет файлов `ac-*.md`
- **THEN** `skill:test-skill` работает как раньше — читает только `<skill>.md`
- **THEN** обратная совместимость сохраняется

### Requirement: формальное разделение behavioral vs acceptance в отчёте
В отчёте `test-results/<timestamp>.md` каждый кейс SHALL маркироваться полем типа: `behavioral` (cases из `<skill>.md`) или `acceptance` (cases из `ac-*.md`). Группировка в отчёте идёт по типу для упрощения диагностики.

#### Scenario: маркировка кейса в отчёте
- **WHEN** в test-results записывается результат прогона
- **THEN** строка содержит явный type: `[behavioral]` или `[acceptance]`
- **THEN** итоговая статистика по типам разделена: `behavioral: 8 PASS / 1 WARN`, `acceptance: 5 PASS / 0 WARN`
