## ADDED Requirements

### Requirement: openspec binary guard
`sdd:propose` SHALL проверять наличие `openspec` в `$PATH` перед любыми другими действиями. Если бинарь не найден — скилл MUST остановиться с сообщением `openspec not found. Run /dev:install` и не продолжать выполнение.

#### Scenario: openspec установлен
- **WHEN** пользователь вызывает `/sdd:propose`
- **THEN** скилл продолжает выполнение без сообщения об ошибке

#### Scenario: openspec не установлен
- **WHEN** пользователь вызывает `/sdd:propose` при отсутствии `openspec` в `$PATH`
- **THEN** скилл останавливается с сообщением `openspec not found. Run /dev:install`
