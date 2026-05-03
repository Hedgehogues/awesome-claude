## MODIFIED Requirements

### Requirement: Identity-resolver primary source

`skills/sdd/scripts/identity.py` SHALL получать identity исключительно через `claude auth status --json`. Git-конфиг НЕ используется ни как основной источник, ни как fallback.

1. Вызов `claude auth status --json`, парсинг поля `email` при `loggedIn: true`.
2. При `loggedIn: false`, недоступности CLI или ошибке парсинга — exit-код != 0 с сообщением «не удалось определить identity, выполните `claude auth login`».

#### Scenario: Залогинен в Claude

- **WHEN** `claude auth status --json` возвращает `{"loggedIn": true, "email": "user@example.com", ...}`
- **THEN** `identity.py` выводит `user@example.com` и завершается с кодом 0

#### Scenario: Не залогинен — ошибка

- **WHEN** `claude auth status --json` возвращает `{"loggedIn": false}` или CLI недоступен
- **THEN** `identity.py` выводит ошибку на stderr: «не удалось определить identity, выполните `claude auth login`»
- **THEN** `identity.py` завершается с exit-кодом != 0
- **THEN** git config user.email НЕ читается

#### Scenario: Claude CLI не установлен

- **WHEN** `claude` бинарник не найден в PATH
- **THEN** `identity.py` выводит ошибку на stderr и завершается с exit-кодом != 0
