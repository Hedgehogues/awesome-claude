## 0. Rename namespace `__dev` → `skill`

- [ ] 0.1 Переименовать директорию `skills/__dev/` → `skills/skill/`
- [ ] 0.2 Переименовать директорию `commands/__dev/` → `commands/skill/`
- [ ] 0.3 В каждом файле `skills/skill/*.md` обновить frontmatter `name: __dev:<x>` → `name: skill:<x>`
- [ ] 0.4 В `commands/skill/*.md` обновить ссылки на `__dev:` → `skill:`
- [ ] 0.5 grep по репе на `__dev:` и `skills/__dev/` / `commands/__dev/` — заменить остаточные упоминания

## 1. manifest.yaml

- [ ] 1.1 Создать `manifest.yaml` в корне репы со схемой: `version:` (версия репы), `tools:` (openspec и др. CLI), `repos:` (субмодули)

## 2. skill:setup

- [ ] 2.1 Создать `skills/skill/setup.md` — напрямую создаёт симлинки `skills → .claude/skills`, `commands → .claude/commands`, `rules → .claude/rules` через bash
- [ ] 2.2 Обработать кейс "Already linked" — вывести сообщение, завершить без изменений
- [ ] 2.3 Обработать кейс "существующая директория" — предупредить, спросить подтверждение

## 3. skill:deps

- [ ] 3.1 Создать `skills/skill/deps.md` — читает `manifest.yaml`; устанавливает инструменты из `tools:`, вызывает `sdd:sync` если `repos:` не пуст
- [ ] 3.2 Валидировать схему `manifest.yaml`: ошибка и стоп, если отсутствует один из `version`, `tools`, `repos` (см. `design.md` → D12)
- [ ] 3.3 Гарантировать, что `skill:deps` не пишет в `manifest.yaml` (см. `design.md` → D11; `specs/deps-skill/spec.md` → Requirement: skill:deps does not modify manifest.yaml)
- [ ] 3.4 Обработать кейс "зависимости уже установлены" — вывести статус, выйти без изменений

## 4. skill:onboarding

- [ ] 4.1 Создать `skills/skill/onboarding.md` — показывает полный workflow (см. `proposal.md` → What Changes; `contributor-workflow/spec.md`)
- [ ] 4.2 Реализовать логику "следующего шага": нет симлинков → `/skill:setup`; нет ченжей → `/sdd:propose`; есть ченжи → список + `/sdd:apply`
- [ ] 4.3 Убедиться, что скилл не вызывает другие скиллы автоматически (см. `contributor-workflow/spec.md` → Requirement: skill:onboarding does not auto-invoke other skills)

## 5. skill:release

- [ ] 5.1 Создать `skills/skill/release.md` — скилл для релиза awesome-claude: bump-version, коммит, тег

## 6. README

- [ ] 6.1 Добавить раздел `## Init` с инструкцией для Клода: определить директорию, предложить режим, описать оба варианта (1-2 предложения), спросить пользователя, выполнить setup
- [ ] 6.2 Описать bootstrap для dev mode: Клод читает `skills/skill/setup.md` напрямую при первом запуске
- [ ] 6.3 Описать user mode setup: Клод делает git clone + cp напрямую, без curl | bash
- [ ] 6.4 Переписать Quick Start в секцию user mode без curl | bash команд
- [ ] 6.5 Добавить секцию Contributing с dev mode: `skill:setup`, `skill:deps`, `skill:onboarding`, `sdd:propose`, `skill:test-skill`
- [ ] 6.6 Убрать все прямые вызовы `curl | bash install.sh`

## 7. Удалить install.sh

- [ ] 7.1 Удалить `scripts/install.sh`
- [ ] 7.2 Проверить что `scripts/` пуста — удалить папку если так

## 8. Стаб with-change и тест-спеки sdd:

- [ ] 8.1 Создать `skills/skill/stubs/with-change.md` — стаб с одним ченжем в `openspec.changes`
- [ ] 8.2 Добавить в стаб `with-change` `manifest.yaml` с версией openspec; если CLI недоступен — кейс SKIP
- [ ] 8.3 Создать `skills/skill/cases/sdd/propose.md` — кейс на `fresh-repo` стабе; contains: вывод о создании proposal; semantic: branch
- [ ] 8.4 Создать `skills/skill/cases/sdd/apply.md` — кейс на `with-change` стабе; contains: список tasks или шагов реализации
- [ ] 8.5 Создать `skills/skill/cases/sdd/sync.md` — кейс на `fresh-repo` стабе; contains: вывод о синхронизации или статусе
- [ ] 8.6 Создать `skills/skill/cases/sdd/help.md` — кейс на `fresh-repo` стабе; contains: секции workflow и repo state
- [ ] 8.7 Создать `skills/skill/cases/sdd/explore.md` — кейс на `fresh-repo` стабе; contains: вопросы или анализ проблемы
- [ ] 8.8 Создать `skills/skill/cases/sdd/contradiction.md` — кейс на `with-change` стабе; contains: отчёт с секцией Hard issues или "no issues"
- [ ] 8.9 Создать `skills/skill/cases/sdd/change-verify.md` — кейс на `with-change` стабе; contains: статус верификации
- [ ] 8.10 Создать `skills/skill/cases/sdd/archive.md` — кейс на `with-change` стабе; contains: подтверждение архивации или список шагов
- [ ] 8.11 Создать `skills/skill/cases/sdd/spec-verify.md` — кейс на `with-change` стабе; contains: вывод о соответствии спекам
- [ ] 8.12 Создать `skills/skill/cases/sdd/repo.md` — кейс на `fresh-repo` стабе; contains: список субмодулей или статус
- [ ] 8.13 Создать `skills/skill/cases/sdd/audit.md` — кейс на `with-change` стабе; contains: аудит-отчёт или список проблем
- [ ] 8.14 Создать `skills/skill/cases/sdd/bump-version.md` — кейс на `fresh-repo` стабе; contains: новая версия или статус bump

## 9. Eval-фреймворк skill:test-skill

- [ ] 9.1 Обновить `skills/skill/test-skill.md` (после rename из шага 0) — реализовать eval-механику согласно `skill-eval-framework/spec.md`
- [ ] 9.2 Реализовать создание `test-results/YYYY-MM-DD-HHMMSS.md` в начале прогона
- [ ] 9.3 Реализовать append каждого результата (статус + причина LLM-judge) в файл по мере выполнения
- [ ] 9.4 Реализовать вывод прогресса в реальном времени: `[case-name] 1/5 ✓  2/5 ✗  … → PASS 4/5` или `→ ⚠ WARN`
- [ ] 9.5 Добавить итоговый отчёт в конец файла результатов после завершения всех кейсов
- [ ] 9.6 Создать директорию `test-results/` (добавить `.gitkeep`)
