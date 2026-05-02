## 0. Rename namespace `__dev` → `skill`

- [ ] 0.1 Переименовать директорию `skills/__dev/` → `skills/skill/`
- [ ] 0.2 Переименовать директорию `commands/__dev/` → `commands/skill/`
- [ ] 0.3 В каждом файле `skills/skill/*.md` обновить frontmatter `name: __dev:<x>` → `name: skill:<x>`
- [ ] 0.4 В `commands/skill/*.md` обновить ссылки на `__dev:` → `skill:`
- [ ] 0.5 grep по репе на `__dev:` и `skills/__dev/` / `commands/__dev/` — заменить остаточные упоминания

## 1. manifest.yaml

- [ ] 1.1 Создать `manifest.yaml` в корне репы со схемой: `version:` (версия репы), `tools:` (openspec и др. CLI), `repos:` (субмодули)

## 2. skill:setup

- [ ] 2.1 Создать `skills/skill/setup/skill.md` — напрямую создаёт симлинки `skills → .claude/skills`, `commands → .claude/commands`, `rules → .claude/rules` через bash
- [ ] 2.2 Обработать кейс "Already linked" — вывести сообщение, завершить без изменений
- [ ] 2.3 Обработать кейс "существующая директория" — предупредить, спросить подтверждение
- [ ] 2.4 Создать `skills/skill/setup/cases/setup.md` с 4 категориями (positive-happy, positive-corner, negative-missing-input, negative-invalid-input — см. `rules/skill-tdd-coverage.md`)

## 3. skill:deps

- [ ] 3.1 Создать `skills/skill/deps/skill.md` — читает `manifest.yaml`; устанавливает инструменты из `tools:`, вызывает `sdd:sync` если `repos:` не пуст
- [ ] 3.2 Валидировать схему `manifest.yaml`: ошибка и стоп, если отсутствует один из `version`, `tools`, `repos` (см. `design.md` → D12)
- [ ] 3.3 Гарантировать, что `skill:deps` не пишет в `manifest.yaml` (см. `design.md` → D11; `specs/deps-skill/spec.md` → Requirement: skill:deps does not modify manifest.yaml)
- [ ] 3.4 Обработать кейс "зависимости уже установлены" — вывести статус, выйти без изменений
- [ ] 3.5 Создать `skills/skill/deps/cases/deps.md` с 4 категориями покрытия

## 4. skill:onboarding

- [ ] 4.1 Создать `skills/skill/onboarding/skill.md` — показывает полный workflow (см. `proposal.md` → What Changes; `contributor-workflow/spec.md`)
- [ ] 4.2 Реализовать логику "следующего шага": нет симлинков → `/skill:setup`; нет ченжей → `/sdd:propose`; есть ченжи → список + `/sdd:apply`
- [ ] 4.3 Убедиться, что скилл не вызывает другие скиллы автоматически (см. `contributor-workflow/spec.md` → Requirement: skill:onboarding does not auto-invoke other skills)
- [ ] 4.4 Создать `skills/skill/onboarding/cases/onboarding.md` с 4 категориями покрытия

## 5. skill:release

- [ ] 5.1 Создать `skills/skill/release/skill.md` — скилл для релиза awesome-claude: bump-version, коммит, тег
- [ ] 5.2 Создать `skills/skill/release/cases/release.md` с 4 категориями покрытия

## 6. README

- [ ] 6.1 Добавить раздел `## Init` с инструкцией для Клода: определить директорию, предложить режим, описать оба варианта (1-2 предложения), спросить пользователя, выполнить setup
- [ ] 6.2 Описать bootstrap для dev mode: Клод читает `skills/skill/setup/skill.md` напрямую при первом запуске
- [ ] 6.3 Описать user mode setup: Клод делает git clone + cp напрямую, без curl | bash
- [ ] 6.4 Переписать Quick Start в секцию user mode без curl | bash команд
- [ ] 6.5 Добавить секцию Contributing с dev mode: `skill:setup`, `skill:deps`, `skill:onboarding`, `sdd:propose`, `skill:test-skill`
- [ ] 6.6 Убрать все прямые вызовы `curl | bash install.sh`

## 7. Удалить install.sh

- [ ] 7.1 Удалить `scripts/install.sh`
- [ ] 7.2 Проверить что `scripts/` пуста — удалить папку если так

## 8. Стаб with-change и расширение тест-спек sdd:

- [ ] 8.1 Создать `skills/skill/test-skill/stubs/with-change.md` — стаб с одним ченжем в `openspec.changes`
- [ ] 8.2 Добавить в стаб `with-change` `manifest.yaml` с версией openspec; если CLI недоступен — кейс SKIP
- [ ] 8.3 Расширить `skills/sdd/propose/cases/propose.md` до 4 категорий (positive-happy / positive-corner / negative-missing-input / negative-invalid-input); базовый кейс — `fresh-repo` стаб
- [ ] 8.4 Расширить `skills/sdd/apply/cases/apply.md` до 4 категорий; базовый кейс — `with-change` стаб
- [ ] 8.5 Расширить `skills/sdd/sync/cases/sync.md` до 4 категорий; базовый кейс — `fresh-repo` стаб
- [ ] 8.6 Расширить `skills/sdd/help/cases/help.md` до 4 категорий; базовый кейс — `fresh-repo` стаб
- [ ] 8.7 Расширить `skills/sdd/explore/cases/explore.md` до 4 категорий; базовый кейс — `fresh-repo` стаб
- [ ] 8.8 Расширить `skills/sdd/contradiction/cases/contradiction.md` до 4 категорий; базовый кейс — `with-change` стаб
- [ ] 8.9 Расширить `skills/sdd/archive/cases/archive.md` до 4 категорий; базовый кейс — `with-change` стаб
- [ ] 8.10 Расширить `skills/sdd/repo/cases/repo.md` до 4 категорий; базовый кейс — `fresh-repo` стаб
- [ ] 8.11 Расширить `skills/sdd/audit/cases/audit.md` до 4 категорий; базовый кейс — `with-change` стаб
- [ ] 8.12 Расширить `skills/sdd/bump-version/cases/bump-version.md` до 4 категорий; базовый кейс — `fresh-repo` стаб

## 9. Eval-фреймворк skill:test-skill

- [ ] 9.1 Обновить `skills/skill/test-skill/skill.md` (после rename из шага 0) — реализовать eval-механику согласно `skill-eval-framework/spec.md`
- [ ] 9.2 Реализовать создание `test-results/YYYY-MM-DD-HHMMSS.md` в начале прогона
- [ ] 9.3 Реализовать append каждого результата (статус + причина LLM-judge) в файл по мере выполнения
- [ ] 9.4 Реализовать вывод прогресса в реальном времени: `[case-name] 1/5 ✓  2/5 ✗  … → PASS 4/5` или `→ ⚠ WARN`
- [ ] 9.5 Добавить итоговый отчёт в конец файла результатов после завершения всех кейсов
- [ ] 9.6 Создать директорию `test-results/` (добавить `.gitkeep`)
