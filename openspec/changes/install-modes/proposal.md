## Why

awesome-claude используется в двух принципиально разных режимах: разработка самой репы (dev mode) и использование скиллов в своём проекте (user mode). Сейчас эти режимы не разделены явно, нет единой точки входа ни для одного из них. Когда Клод открывает репу — он не знает в каком режиме работать и что делать первым делом. Когда разработчик вносит правки в `skills/` — изменения не видны Claude Code без ручного копирования.

## What Changes

- Переименовать namespace `__dev` → `skill`: `skills/__dev/` → `skills/skill/`, `commands/__dev/` → `commands/skill/`, обновить `name:` во frontmatter всех скиллов и команд (см. `design.md` → D10)
- Добавить `skill:setup` — создаёт симлинки `skills/ → .claude/skills/`, `commands/ → .claude/commands/`, `rules/ → .claude/rules/` напрямую (см. `design.md` → D1, D2, D3)
- Ввести `manifest.yaml` в корне репы — единый источник правды для setup: секции `version:`, `tools:`, `repos:` (см. `design.md` → D6, D12)
- Добавить `skill:deps` — единая точка оркестрации зависимостей; read-only по `manifest.yaml` (см. `design.md` → D11)
- Добавить `skill:onboarding` — guided entry point для контрибьютора (см. `design.md` → D4; `specs/contributor-workflow/spec.md` → Requirement: skill:onboarding shows the full contributor path)
- Добавить `skill:release` — финальный шаг workflow (см. `specs/skill-release/spec.md` → Requirement: skill:release cuts an awesome-claude release)
- Добавить в README раздел `## Init` — инструкция для Клода (см. `design.md` → D5, D7)
- Удалить `scripts/install.sh` (см. `design.md` → D8)
- Обновить README: разделить Quick Start (user mode) и Contributing (dev mode); убрать все `curl | bash`
- Добавить test-спеки `skills/skill/cases/sdd/` для всех sdd-скиллов (см. `design.md` → D13)
- Ввести eval-фреймворк для test-спеков с прогрессом и файлом результатов (см. `design.md` → D9)

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `dev-mode`: dev mode setup через симлинки — изменения в `skills/` сразу видны Claude Code без ручного копирования
- `install-modes`: два режима работы без публичных CLI-команд — Клод делает setup сам
- `dev-setup-skill`: `/skill:setup` — создаёт симлинки напрямую; единственная точка входа для dev setup
- `manifest`: `manifest.yaml` в корне — единый файл для версий инструментов и субмодулей; `sdd:repo` управляет `repos:`, `skill:deps` читает оба раздела
- `deps-skill`: `/skill:deps` — читает `manifest.yaml`, устанавливает инструменты и субмодули
- `contributor-workflow`: `/skill:onboarding` — скилл для разработчика скиллов: полный путь работы в репе; Клод вызывает при онбординге нового контрибьютора
- `claude-init-mode`: инструкция в README для Клода — определить режим, спросить пользователя, выполнить setup
- `sdd-test-coverage`: test-спеки `skills/skill/cases/sdd/<skill>.md` для всех sdd-скиллов
- `skill-eval-framework`: eval-механика для test-спеков — assertions (`contains:` + `semantic:` с LLM-judge), bootstrap k=5 (≥4/5), изоляция через стабы; файл результатов создаётся в начале прогона, каждый результат фиксируется по мере выполнения, итоговый отчёт в конце
- `skill-release`: `/skill:release` — финальный шаг контрибьютора: bump-version в `manifest.yaml version:`, git-коммит, тег версии

### Modified Capabilities

<!-- нет изменений в существующих спеках -->

## Impact

- `skills/__dev/` → `skills/skill/` — переименование namespace (директория и frontmatter `name:`)
- `commands/__dev/` → `commands/skill/` — переименование namespace
- `skills/skill/setup.md` — новый скилл
- `manifest.yaml` — новый файл в корне репы
- `skills/skill/deps.md` — новый скилл
- `skills/skill/onboarding.md` — новый скилл
- `skills/skill/release.md` — новый скилл
- `skills/skill/cases/sdd/*.md` — тест-спеки для всех sdd-скиллов
- `test-results/` — директория для файлов результатов прогонов
- `skills/skill/stubs/with-change.md` — новый стаб
- `README.md` — раздел `## Init`, разделы Contributing и Quick Start, убраны `curl | bash`
- `scripts/install.sh` — **удалить**
