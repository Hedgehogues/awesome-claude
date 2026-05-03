## ADDED Requirements

### Requirement: incident_template.py генерирует runbook-шаблон MR

`skills/sre/scripts/incident_template.py` SHALL принимать `--title`, `--severity`, `--timestamp` и генерировать JSON `{"slug": "...", "body": "..."}` с Markdown-телом MR, содержащим 6 обязательных секций.

#### Scenario: Полный набор аргументов

- **WHEN** `incident_template.py --title "DB connection pool exhausted" --severity critical --timestamp 2026-05-03T10:00:00Z`
- **THEN** stdout содержит JSON с полями `slug` и `body`
- **THEN** `slug` = `db-connection-pool-exhausted-20260503`
- **THEN** `body` содержит все 6 секций: `## Incident Summary`, `## Timeline`, `## Impact`, `## Root Cause`, `## Mitigation`, `## Follow-ups`
- **THEN** в `## Incident Summary` присутствует заголовок инцидента и severity
- **THEN** exit 0

#### Scenario: Без severity — поле опускается из summary

- **WHEN** `incident_template.py --title "API latency spike"` (без --severity)
- **THEN** `body` содержит 6 секций, строка severity в summary помечена `N/A`
- **THEN** exit 0

#### Scenario: Slug ограничен 40 символами + дата

- **WHEN** title длиннее 40 символов
- **THEN** slug обрезается до 40 символов перед добавлением `-<YYYYMMDD>`
