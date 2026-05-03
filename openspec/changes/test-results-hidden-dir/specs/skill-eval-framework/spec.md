## MODIFIED Requirements

### Requirement: skill:test-skill creates results file before running any cases
When `skill:test-skill` is invoked, it SHALL create `.test-results/YYYY-MM-DD-HHMMSS.md` immediately — before executing any test case. Each case result SHALL be appended to the file as it completes.

#### Scenario: Results file exists before first case runs
- **WHEN** `skill:test-skill` is invoked
- **THEN** `.test-results/<timestamp>.md` is created
- **THEN** the file exists before the first case result is written

#### Scenario: Each result is appended immediately
- **WHEN** a bootstrap run completes for a case
- **THEN** the result (status + LLM-judge reason) is appended to the results file
- **THEN** subsequent runs append their results without overwriting previous ones

### Requirement: формальное разделение behavioral vs acceptance в отчёте
В отчёте `.test-results/<timestamp>.md` каждый кейс SHALL маркироваться полем типа: `behavioral` (cases из `<skill>.md`) или `acceptance` (cases из `ac-*.md`). Группировка в отчёте идёт по типу для упрощения диагностики.

#### Scenario: маркировка кейса в отчёте
- **WHEN** в `.test-results/` записывается результат прогона
- **THEN** строка содержит явный type: `[behavioral]` или `[acceptance]`
- **THEN** итоговая статистика по типам разделена: `behavioral: 8 PASS / 1 WARN`, `acceptance: 5 PASS / 0 WARN`
