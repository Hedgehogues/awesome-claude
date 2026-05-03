## Why

Четыре `sdd:*` скилла вызывают несуществующие Claude-скиллы через Skill tool:

| Скилл | Вызывает |
|---|---|
| `sdd:propose` | `openspec-propose` |
| `sdd:explore` | `openspec-explore` |
| `sdd:apply` | `openspec-apply-change` |
| `sdd:archive` | `openspec-archive-change` |

Ни один из этих скиллов не зарегистрирован. Каждый падает на первом шаге с `Unknown skill: <name>` — пользователь не получает никакого результата. Дополнительно: в frontmatter всех этих скиллов написано "OpenSpec CLI устанавливается автоматически по версии из `.openspec-version`" — этот файл тоже не существует в репе, что вводит в заблуждение.

## What Changes

- Добавить preflight-проверку `which openspec` в начало каждого из 4 скиллов. Если не найден — остановиться с сообщением `openspec not found. Install: npm install -g @openspec/cli`
- `sdd:propose` шаг 1: заменить `Skill('openspec-propose')` на прямой `openspec new change <name>` через Bash
- `sdd:explore`: заменить `Skill('openspec-explore')` на `Skill('opsx:explore')` (нет CLI-эквивалента для интерактивного explore)
- `sdd:apply` шаг 5: заменить `Skill('openspec-apply-change')` на `Skill('opsx:apply')` (нет одной CLI-команды — complex multi-step)
- `sdd:archive` шаг 6: заменить `Skill('openspec-archive-change')` на `openspec archive <name> -y` через Bash
- Убрать из frontmatter всех 4 скиллов фразу про `.openspec-version` и "устанавливается автоматически"

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `sdd-openspec-cli-guard`: все `sdd:*` скиллы проверяют наличие openspec CLI перед работой и завершаются с понятной ошибкой если не установлен

### Modified Capabilities

- `sdd-propose`: шаг 1 переписан под прямой CLI-вызов
- `sdd-explore`: делегирование переключено с `openspec-explore` на `opsx:explore`
- `sdd-apply-change`: делегирование переключено с `openspec-apply-change` на `opsx:apply`
- `sdd-archive-change`: делегирование переключено с `openspec-archive-change` на CLI

## Impact

- `skills/sdd/propose/skill.md` — frontmatter + шаг 1
- `skills/sdd/explore/skill.md` — frontmatter + тело
- `skills/sdd/apply/skill.md` — frontmatter + шаг 5
- `skills/sdd/archive/skill.md` — frontmatter + шаг 6
