## 1. Namespace sre/ и структура

- [ ] 1.1 Создать директорию `skills/sre/` с `README.md` — описание namespace: SRE-практики, incident response.
- [ ] 1.2 Создать `skills/sre/scripts/` — директория для Python-скриптов namespace.

## 2. gitlab_client.py

- [ ] 2.1 Создать `skills/sre/scripts/gitlab_client.py`: читает `GITLAB_URL`, `GITLAB_TOKEN` из env. Команда `create-branch <project_id> <branch_name>` — POST `/projects/{id}/repository/branches`. Exit 1 если ветка уже существует или API вернул ошибку.
- [ ] 2.2 Добавить команду `create-mr <project_id> <source_branch> <target_branch> <title> <body_file>` — POST `/projects/{id}/merge_requests`. `body_file` — путь к файлу с телом MR (обходит проблему экранирования в argv). Возвращает JSON с `iid` в stdout.
- [ ] 2.3 Добавить команду `add-label <project_id> <mr_iid> <label>` — PUT `/projects/{id}/merge_requests/{iid}` с `labels`. Exit 1 при ошибке API.
- [ ] 2.4 Не логировать значение `GITLAB_TOKEN` — только маскировать в ошибках (показывать `***`).

## 3. incident_template.py

- [ ] 3.1 Создать `skills/sre/scripts/incident_template.py`: принимает `--title`, `--severity`, `--timestamp` (ISO). Генерирует Markdown с секциями: `## Incident Summary`, `## Timeline`, `## Impact`, `## Root Cause`, `## Mitigation`, `## Follow-ups`. Пишет результат в stdout.
- [ ] 3.2 Добавить slug-генерацию: `title.lower().replace(" ", "-")[:40] + "-" + YYYYMMDD`. Экспортировать как часть JSON-вывода (`{"slug": "...", "body": "..."}`).

## 4. skill.md для sre:incident-mr

- [ ] 4.1 Создать `skills/sre/incident-mr/skill.md`. Шаги:
  - Preflight: проверить наличие `GITLAB_URL`, `GITLAB_TOKEN`, `GITLAB_PROJECT_ID` в env — если нет, остановиться с сообщением.
  - Парсить `$ARGUMENTS`: извлечь title и опциональный `--severity`.
  - Вызвать `incident_template.py --title "..." --severity "..." --timestamp $(date -u +%Y-%m-%dT%H:%M:%SZ)` → сохранить JSON, записать body во временный файл.
  - Вызвать `gitlab_client.py create-branch $GITLAB_PROJECT_ID "incident/<slug>"`.
  - Вызвать `gitlab_client.py create-mr $GITLAB_PROJECT_ID "incident/<slug>" main "<title>" /tmp/mr_body.md` → сохранить iid.
  - Вызвать `gitlab_client.py add-label $GITLAB_PROJECT_ID <iid> incident`.
  - Если severity задан — вызвать `gitlab_client.py add-label $GITLAB_PROJECT_ID <iid> "severity:<severity>"`.
  - Вывести URL MR в формате: `MR created: $GITLAB_URL/<project_path>/-/merge_requests/<iid>`.
- [ ] 4.2 Документировать env-переменные в начале skill.md (required: GITLAB_URL, GITLAB_TOKEN, GITLAB_PROJECT_ID).

## 5. Тест-кейсы

- [ ] 5.1 Создать `skills/sre/incident-mr/cases/incident-mr.md` — 4 категории: positive-happy (valid incident + severity), positive-corner (no severity, minimal title), negative-missing-input (missing GITLAB_TOKEN), negative-invalid-input (GitLab API 403).
- [ ] 5.2 Создать `skills/sre/scripts/cases/gitlab_client.md` — тест-кейсы для gitlab_client.py: happy (branch created), corner (branch already exists → exit 1 with message), negative-missing-input (GITLAB_TOKEN not set → exit 1), negative-invalid-input (invalid project_id → 404).

## 6. Документация

- [ ] 6.1 Добавить `sre:incident-mr` в `README.md` — раздел Skills catalog, namespace `sre/`.
- [ ] 6.2 Добавить env-секцию в `docs/README_DETAILED.md`: как настроить GitLab-интеграцию (GITLAB_URL, GITLAB_TOKEN, GITLAB_PROJECT_ID).
