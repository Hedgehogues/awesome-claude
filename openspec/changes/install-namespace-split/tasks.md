## 1. Реструктуризация rules

- [ ] 1.1 Создать `rules/dev/` — перенести `makefile.md`, `monorepo-structure.md`, `frontend-design.md`, `frontend-testing.md`, `ui-library.md`, `arch/`
- [ ] 1.2 Создать `rules/skill/` — перенести `skill-tdd-coverage.md`
- [ ] 1.3 Обновить зеркала `.claude/rules/` аналогично
- [ ] 1.4 Проверить что `paths:` frontmatter в перенесённых rules не сломан

## 2. Specs

- [ ] 2.1 Создать `openspec/specs/namespace-install/spec.md` — pipeline, динамический explore, per-namespace rules
- [ ] 2.2 Создать `openspec/specs/namespace-rules/spec.md` — структура `rules/<ns>/`, корневые rules универсальны

## 3. Скилл dev:install

- [ ] 3.1 Создать `skills/dev/install/skill.md` — pipeline: clone → explore (ls skills/ + ls rules/<ns>/) → propose (текст + AskUserQuestion) → install
- [ ] 3.2 Создать `commands/dev/install.md` — команда `/dev:install`
- [ ] 3.3 Создать `.claude/skills/dev/install/skill.md` — зеркало
- [ ] 3.4 Создать `.claude/commands/dev/install.md` — зеркало

## 4. Тест-кейсы

- [ ] 4.1 Обновить `skills/dev/install/cases/install.md` — кейсы: полный pipeline, нераспознанная структура, пустой выбор, уже установлен, ns без rules

## 5. README + delta-спек

- [ ] 5.1 Обновить `README.md`: Quick Start — "скажи Claude URL репозитория, он предложит что установить"
- [ ] 5.2 Создать delta-спек для `install-modes` — добавить namespace-rules структуру и autonomous-propose
