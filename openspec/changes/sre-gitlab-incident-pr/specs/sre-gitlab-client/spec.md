## ADDED Requirements

### Requirement: gitlab_client.py — обёртка GitLab REST API

`skills/sre/scripts/gitlab_client.py` SHALL поддерживать команды `create-branch`, `create-mr`, `add-label`. Читает `GITLAB_URL` и `GITLAB_TOKEN` из env. Exit 1 при любой API-ошибке.

#### Scenario: create-branch — успех

- **GIVEN** `GITLAB_URL=https://gitlab.example.com`, `GITLAB_TOKEN=valid-token`
- **WHEN** `gitlab_client.py create-branch 42 "incident/db-crash-20260503"`
- **THEN** скрипт делает POST `/api/v4/projects/42/repository/branches` с `branch=incident/db-crash-20260503&ref=main`
- **THEN** exit 0

#### Scenario: create-branch — ветка уже существует

- **WHEN** GitLab возвращает 400 `Branch already exists`
- **THEN** скрипт выводит `Error: branch 'incident/db-crash-20260503' already exists` в stderr
- **THEN** exit 1

#### Scenario: create-mr — возвращает iid

- **WHEN** `gitlab_client.py create-mr 42 "incident/db-crash-20260503" main "[Incident] DB crash" /tmp/body.md`
- **THEN** скрипт читает тело из `/tmp/body.md`, делает POST `/api/v4/projects/42/merge_requests`
- **THEN** выводит JSON `{"iid": 7, "web_url": "..."}` в stdout
- **THEN** exit 0

#### Scenario: GITLAB_TOKEN не задан

- **GIVEN** `GITLAB_TOKEN` отсутствует в env
- **WHEN** вызывается любая команда
- **THEN** скрипт выводит `Error: GITLAB_TOKEN is not set` в stderr и exit 1
- **THEN** значение токена НЕ появляется в stdout или stderr

#### Scenario: API возвращает 403

- **WHEN** GitLab API возвращает HTTP 403
- **THEN** скрипт выводит `Error: GitLab API returned 403 Forbidden` в stderr (без заголовков с токеном)
- **THEN** exit 1
