## Why

`scripts/install.sh` нарушает принцип claude-way: установка awesome-claude должна выполняться через Claude Code, а не через прямой системный вызов bash-скрипта. Claude уже умеет делать `git clone` и `cp` через Bash-инструмент — скрипт дублирует эту логику без добавления ценности.

## What Changes

- Удалить `scripts/install.sh`
- Добавить скилл `dev:install` с логикой установки компонентов из GitHub в `.claude/`
- Обновить `README.md`: убрать секцию с `curl | bash`, заменить на инструкцию "скажи Claude установить awesome-claude"
- Удалить директорию `scripts/` (после удаления единственного файла)

## Capabilities

### New Capabilities

- `claude-native-install`: скилл `dev:install` реализует логику выбора компонентов, клонирования репо и копирования файлов в `.claude/`; Claude является единственным способом установки

### Modified Capabilities

- `user-interface-principle`: удаление `scripts/install.sh` — прямое следствие принципа; необходимо отразить в спеке что bootstrap-исключения не допускаются

## Impact

**`scripts/install.sh`** — удаляется

**`scripts/`** — директория удаляется

**`skills/dev/install.md`** — новый скилл (и зеркало `.claude/skills/dev/install.md`)

**`README.md`** — обновляются секции Quick Start и Installation

**`.claude/scripts/`** — удаляется из установленных компонентов (install.sh не копируется пользователям)

See `.sdd.yaml` for capability declarations.
