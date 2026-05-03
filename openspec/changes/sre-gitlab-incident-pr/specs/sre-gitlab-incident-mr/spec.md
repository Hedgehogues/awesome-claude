## ADDED Requirements

### Requirement: sre:incident-mr создаёт GitLab MR для инцидента

`skills/sre/incident-mr/skill.md` SHALL принимать из `$ARGUMENTS` описание инцидента, создавать ветку `incident/<slug>-<YYYYMMDD>` и GitLab Merge Request с runbook-шаблоном и лейблом `incident`.

#### Scenario: Happy path — инцидент с severity

- **GIVEN** env содержит `GITLAB_URL`, `GITLAB_TOKEN`, `GITLAB_PROJECT_ID`
- **WHEN** пользователь вызывает `/sre:incident-mr "Database connection pool exhausted --severity critical"`
- **THEN** скилл создаёт ветку `incident/database-connection-pool-exhauste-<YYYYMMDD>`
- **THEN** создаётся MR с заголовком `[Incident] Database connection pool exhausted`
- **THEN** MR содержит runbook-шаблон с 6 секциями
- **THEN** на MR навешены лейблы `incident` и `severity:critical`
- **THEN** скилл выводит URL MR

#### Scenario: Без severity — только базовый лейбл

- **WHEN** пользователь вызывает `/sre:incident-mr "API response time degradation"`
- **THEN** создаётся MR с лейблом `incident`
- **THEN** лейбл `severity:*` НЕ навешивается

#### Scenario: Preflight — отсутствует GITLAB_TOKEN

- **GIVEN** env НЕ содержит `GITLAB_TOKEN`
- **WHEN** пользователь вызывает `/sre:incident-mr "..."`
- **THEN** скилл останавливается с сообщением: `GITLAB_TOKEN is not set. Configure env before running sre:incident-mr.`
- **THEN** ни один API-вызов НЕ выполняется
