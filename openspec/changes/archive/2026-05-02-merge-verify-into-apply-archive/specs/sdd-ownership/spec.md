## ADDED Requirements

### Requirement: Owner поле в .sdd.yaml

`.sdd.yaml` каждого change'а SHALL содержать поле `owner:` со строковым значением (email) — единственный владелец change'а. MUST быть инициализировано при `/sdd:propose` через identity-resolver.

#### Scenario: Propose инициализирует owner

- **WHEN** `/sdd:propose` создаёт `.sdd.yaml`
- **THEN** поле `owner:` содержит email текущего пользователя (через `identity.py`)

### Requirement: Identity-resolver primary source

`skills/sdd/scripts/identity.py` SHALL получать identity в следующем порядке:

1. Вызов `claude auth status --json`, парсинг поля `email` при `loggedIn: true`.
2. При `loggedIn: false`, недоступности CLI или ошибке парсинга — fallback на `git config user.email`.
3. При недоступности обоих источников — exit-код != 0 с сообщением «не удалось определить identity, выполните `claude auth login` или `git config user.email`».

#### Scenario: Залогинен в Claude

- **WHEN** `claude auth status --json` возвращает `{"loggedIn": true, "email": "user@example.com", ...}`
- **THEN** `identity.py` выводит `user@example.com` и завершается с кодом 0

#### Scenario: Не залогинен, есть git

- **WHEN** `claude auth status --json` возвращает `{"loggedIn": false}`, и `git config user.email` возвращает `user@git.com`
- **THEN** `identity.py` выводит `user@git.com` и завершается с кодом 0

#### Scenario: Ни Claude, ни git недоступны

- **WHEN** `claude` CLI не установлен и `git config user.email` пустой
- **THEN** `identity.py` выводит ошибку на stderr и завершается с ненулевым кодом

### Requirement: Identity check в каждом sdd-скилле

Каждый sdd-скилл, изменяющий состояние change'а (`/sdd:contradiction`, `/sdd:apply`, `/sdd:archive`), SHALL вызывать `identity.py` в начале выполнения и сравнивать результат с `owner:` из `.sdd.yaml`. При несовпадении MUST вывести warning и запросить подтверждение через AskUserQuestion.

#### Scenario: Своя change

- **WHEN** `identity.py` вернул `user@example.com` и `.sdd.yaml owner: user@example.com`
- **THEN** скилл продолжает без warning'а

#### Scenario: Чужая change, согласие на перезапись

- **WHEN** `identity.py` вернул `new@user.com`, `.sdd.yaml owner: old@user.com`, пользователь подтверждает перезапись
- **THEN** скилл переписывает `owner:` на `new@user.com` и продолжает

#### Scenario: Чужая change, отказ от перезаписи

- **WHEN** `identity.py` вернул `new@user.com`, `.sdd.yaml owner: old@user.com`, пользователь отказывается
- **THEN** скилл останавливается с сообщением «работа над чужим change'ем отклонена»; ничего не меняет

### Requirement: Owner единичный, не массив

Поле `owner:` SHALL быть строкой, не списком. Multi-owner / co-authoring явно НЕ поддерживается. Перезапись всегда полная: `old@user.com` → `new@user.com`, без агрегации.

#### Scenario: Попытка прочитать список

- **WHEN** YAML-парсер встречает `owner: [a@x, b@x]` (массив, ошибка пользователя)
- **THEN** скрипт `state.py` или identity-валидация выдаёт ошибку «owner must be a string, not list»

### Requirement: Owner живёт только в change-уровне

Поле `owner:` SHALL храниться только в `.sdd.yaml` внутри change-директории. После архивации change'а директория уезжает в `archive/`, owner сохраняется как историческая запись. Live spec'ы в `openspec/specs/` MUST NOT содержать `owner:`.

#### Scenario: Архивированный change сохраняет owner

- **WHEN** change `foo` с `owner: a@x` уехал в `openspec/changes/archive/2026-05-02-foo/`
- **THEN** `.sdd.yaml` в архиве по-прежнему содержит `owner: a@x`; spec'ы из этого change в `openspec/specs/` не имеют поля owner
