## Context

В awesome-claude существуют namespace `dev/`, `sdd/`, `report/` и `research/`. SRE-практики (incident response, postmortem, GitLab automation) не покрыты ни одним namespace. SRE-инженеры вынуждены создавать GitLab MR вручную при каждом инциденте — без стандартного runbook-шаблона и без автоматической разметки.

GitLab REST API позволяет программно создавать ветки и MR. Весь доступ к GitLab изолирован в `gitlab_client.py` — скилл не делает raw HTTP-запросы напрямую.

## Goals / Non-Goals

**Goals:**
- Скилл `sre:incident-mr`, доступный через `/sre:incident-mr "Описание инцидента"`.
- Автоматическое создание ветки `incident/<slug>` и GitLab MR с runbook-шаблоном.
- Конфигурация через env-переменные (`GITLAB_URL`, `GITLAB_TOKEN`, `GITLAB_PROJECT_ID`) — без хардкода и без интерактивного ввода.
- Структурированный runbook в теле MR: 6 секций (Summary, Timeline, Impact, Root Cause, Mitigation, Follow-ups).
- Лейбл `incident` и severity-лейбл (`severity:critical`, `severity:high`, etc.) навешиваются автоматически.

**Non-Goals:**
- Не создаёт тикеты в Jira или GitLab Issues — только MR.
- Не алертит в Slack/PagerDuty — только GitLab-артефакт.
- Не поддерживает GitHub или Bitbucket — только GitLab API v4.
- Не читает существующие инциденты — только создаёт новые.

## Decisions

**D1: Отдельный namespace `sre/`.**
SRE-практики концептуально отличаются от `dev/` (TDD, commit) и `sdd/` (spec workflow). Отдельный namespace позволяет добавлять postmortem, on-call, runbook-скиллы без загрязнения dev-namespace.

**D2: `gitlab_client.py` как отдельный скрипт, не inline-curl.**
Claude-way требует доступ к структурированным данным через Python-скрипт. GitLab API возвращает JSON — значит, `gitlab_client.py` читает и пишет через requests/urllib, а не через raw curl в skill.md. Скрипт — persistent artifact.

**D3: Slug из title через lowercase + replace spaces с `-`.**
`incident_template.py` генерирует slug: `title.lower().replace(" ", "-")[:40]`. Ветка: `incident/<slug>-<YYYYMMDD>`. Дата-суффикс предотвращает коллизии при повторных инцидентах с похожим названием.

**D4: Severity как опциональный аргумент.**
`$ARGUMENTS` формат: `"<title>"` или `"<title> --severity <level>"`. По умолчанию severity = `unknown`. Лейбл навешивается только если severity задан явно. Упрощает happy-path без принудительного ввода severity.

**D5: Runbook-шаблон — 6 фиксированных секций.**
Секции: Summary, Timeline, Impact, Root Cause, Mitigation, Follow-ups. Это минимально достаточный шаблон для постмортема. Пользователь заполняет вручную после создания MR.

## Risks / Trade-offs

**R1: GITLAB_TOKEN в env — риск утечки через логи.**
Митигация: `gitlab_client.py` никогда не логирует значение токена. Вывод ошибки при HTTP 401/403 — только статус, без headers.

**R2: slug-коллизии при повторных инцидентах.**
Дата-суффикс снижает риск, но не устраняет полностью (два инцидента в один день с похожим названием). Митигация: `gitlab_client.py create-branch` возвращает exit 1 с понятным сообщением если ветка уже существует — скилл остановится с предложением уточнить название.

**R3: GitLab API rate limits.**
Скилл создаёт 2-3 API-вызова (create-branch, create-mr, add-label). Не является batch-операцией — rate limits не актуальны при разумном использовании.
