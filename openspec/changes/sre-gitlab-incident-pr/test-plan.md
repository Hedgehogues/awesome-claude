---
approach: |
  Юнит-тесты для gitlab_client.py и incident_template.py через mocking HTTP (responses/unittest.mock).
  Skill-тесты через skill:test-skill с stub-репозиторием и мок-переменными окружения.
  Integration smoke test — запуск против реального GitLab (только в CI с GITLAB_TOKEN).
acceptance_criteria:
  - sre:incident-mr создаёт ветку и MR при валидных env-переменных
  - При отсутствии GITLAB_TOKEN скилл останавливается без API-вызовов
  - MR-тело содержит все 6 runbook-секций
  - Лейбл incident навешивается всегда; severity:* — только при явном аргументе
  - gitlab_client.py не логирует токен при ошибке 401/403
---

## Scenarios

### S1: Полный happy path с severity
Вызов `/sre:incident-mr "DB pool exhausted --severity critical"` при наличии всех env. Ожидается: ветка создана, MR создан, 2 лейбла навешены, URL выведен.

### S2: Happy path без severity
Вызов `/sre:incident-mr "API latency spike"`. Ожидается: MR с одним лейблом `incident`, без `severity:*`.

### S3: Preflight — GITLAB_TOKEN отсутствует
Env без GITLAB_TOKEN. Ожидается: скилл выводит ошибку и завершается, API не вызывается.

### S4: Коллизия ветки
GitLab возвращает 400 при create-branch. Ожидается: скилл останавливается с понятным сообщением, MR не создаётся.

### S5: incident_template.py — slug из длинного title
Title > 40 символов. Ожидается: slug обрезан до 40 + дата, JSON валиден.
