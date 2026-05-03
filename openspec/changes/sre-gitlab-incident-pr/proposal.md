## Why

В awesome-claude нет namespace `sre:` — SRE-практики (incident response, runbook, postmortem) не покрыты ни одним существующим namespace (`dev:`, `sdd:`, `report:`, `research:`). SRE-инженеры работают с другим контекстом: не с кодом и тестами, а с надёжностью систем, инцидентами и трассировкой изменений.

Этот change создаёт namespace `sre:` и первый скилл в нём. SRE-команды сейчас реагируют на инциденты вручную: создают ветку, пишут MR, заполняют описание, навешивают лейблы — каждый раз по-разному. Нет единого шаблона runbook'а в теле MR, нет стандартных лейблов, нет автоматической трассировки «инцидент → изменение в репо».

Нужен скилл `sre:incident-mr`, который принимает описание инцидента и за один шаг создаёт GitLab Merge Request со структурированным runbook-шаблоном, incident-metadata и правильными лейблами.

См. `.sdd.yaml` для capability declarations.

## What Changes

- Создать namespace `sre:` — `skills/sre/` с `README.md`. Это первый SRE-namespace в awesome-claude; он устанавливает конвенцию для будущих SRE-скиллов (postmortem, on-call, runbook и т.д.).
- Добавить `skills/sre/incident-mr/skill.md` — скилл `sre:incident-mr`. Принимает из `$ARGUMENTS` описание инцидента (title + опционально severity). Читает конфиг GitLab из env (`GITLAB_URL`, `GITLAB_TOKEN`, `GITLAB_PROJECT_ID`). Вызывает `gitlab_client.py create-incident-mr` — создаёт ветку `incident/<slug>`, формирует MR с runbook-шаблоном и лейблом `incident`.
- Добавить `skills/sre/scripts/gitlab_client.py` — Python-клиент для GitLab API. Команды: `create-branch <project_id> <branch>`, `create-mr <project_id> <source> <target> <title> <body>`, `add-label <project_id> <mr_iid> <label>`. Читает `GITLAB_URL` и `GITLAB_TOKEN` из env. Exit 1 при ошибке API.
- Добавить `skills/sre/scripts/incident_template.py` — генерирует тело MR по шаблону runbook: секции `## Incident Summary`, `## Timeline`, `## Impact`, `## Root Cause`, `## Mitigation`, `## Follow-ups`.

## Capabilities

### New Capabilities

- `sre-namespace`: `skills/sre/` — новый namespace для SRE-практик в awesome-claude. Первый скилл: `sre:incident-mr`. Конвенция: скиллы namespace работают с надёжностью систем, а не с разработкой.
- `sre-gitlab-incident-mr`: `skills/sre/incident-mr/skill.md` — создаёт GitLab MR для инцидента. Принимает (title, severity), создаёт ветку `incident/<slug>`, MR с runbook-шаблоном и лейблом `incident`. Требует env: `GITLAB_URL`, `GITLAB_TOKEN`, `GITLAB_PROJECT_ID`.
- `sre-gitlab-client`: `skills/sre/scripts/gitlab_client.py` — обёртка GitLab REST API. Команды: `create-branch`, `create-mr`, `add-label`. Exit 1 при API-ошибке, вывод JSON ответа в stdout.
- `sre-incident-template`: `skills/sre/scripts/incident_template.py` — генерирует Markdown-тело MR. Принимает (title, severity, timestamp), возвращает runbook-шаблон с 6 секциями.
