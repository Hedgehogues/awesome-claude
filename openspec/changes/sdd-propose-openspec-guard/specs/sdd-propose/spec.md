## MODIFIED Requirements

### Requirement: create change via CLI
`sdd:propose` SHALL создавать директорию change через прямой вызов `openspec new change "<name>"` через Bash tool. Вызов несуществующего скилла `openspec-propose` через Skill tool использоваться НЕ ДОЛЖЕН.

#### Scenario: создание change
- **WHEN** пользователь вызывает `/sdd:propose <name>`
- **THEN** скилл выполняет `openspec new change "<name>"` через Bash и создаёт директорию `openspec/changes/<name>/`

## REMOVED Requirements

### Requirement: auto-install via .openspec-version
**Reason**: `.openspec-version` файл не существует, автоматическая установка не реализована. Упоминание создаёт ложные ожидания.
**Migration**: Установка openspec — ответственность `dev:install` скилла. Пользователь вызывает `/dev:install` один раз перед использованием SDD.
