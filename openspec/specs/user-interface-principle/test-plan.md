---
approach: |
  Ручная проверка артефактов: README.md не содержит curl/bash-вызовов вне bootstrap;
  раздел Interface присутствует; rules/claude-way.md существует и загружается в .claude/rules/;
  scripts/ содержит только install.sh; bump-version скиллы каждого namespace ссылаются на
  ${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh.
acceptance_criteria:
  - README.md не содержит curl или bash-команд для установки и обновления
  - README.md содержит раздел Interface с описанием Claude-way принципа
  - rules/claude-way.md существует и зеркалируется в .claude/rules/claude-way.md
  - scripts/ содержит только install.sh (bump-namespace.sh перенесён к скиллам)
  - skills/{dev,sdd,report,research}/scripts/bump-namespace.sh существуют
  - skills/{dev,sdd,report,research}/bump-version.md вызывают ${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh
  - .claude/README.md идентичен README.md
---

## Scenarios

### Сценарий 1 — Установка через Claude Code

Открыть Claude Code и сказать «Install awesome-claude from github.com/Hedgehogues/awesome-claude».
Убедиться что README Quick Start описывает именно этот способ, без curl-команды.

### Сценарий 2 — Обновление namespace

Набрать `/dev:bump-version` в Claude Code. Убедиться что скилл находит
`${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh` и выполняет его.

### Сценарий 3 — Правило claude-way загружается автоматически

Открыть новую сессию Claude Code в любом проекте с установленным awesome-claude.
Убедиться что `.claude/rules/claude-way.md` присутствует и Claude видит правило.
