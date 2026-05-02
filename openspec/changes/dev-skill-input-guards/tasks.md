# Tasks: dev-skill-input-guards

## 1. Баги в скиллах

- [ ] `skills/dev/bump-version/skill.md` — добавить проверку `.versions` перед запуском bump-namespace.sh; стоп с "Missing prerequisite: .versions not found"
- [ ] `skills/dev/commit/skill.md` — добавить early-exit: если `git status --short` только `??` или пусто → "Nothing to commit"
- [ ] `skills/dev/fix-bug/skill.md` — guard на пустой `$ARGUMENTS`: спросить описание бага, завершить скилл
- [ ] `skills/dev/init-repo/skill.md` — добавить `!git branch --show-current` в pre-computed context
- [ ] `skills/dev/tdd/skill.md` — guard на пустой `$ARGUMENTS`: спросить описание фичи, завершить
- [ ] `skills/dev/tracing/skill.md` — guard на пустой `$ARGUMENTS`: спросить цель, не дефолтить в Feature tracing

## 2. Тест-спеки и стабы

- [ ] `skills/sdd/archive/cases/archive.md` — удалить кейс `index-yaml-update`
- [ ] `skills/sdd/apply/cases/apply.md` — добавить кейс `index-yaml-update` с правильными проверками
- [ ] `skills/skill/test-skill/stubs/change-with-sdd-yaml.md` — добавить в `tasks.md` задачи: одну с артефактом (gaps_found), одну с live-проверкой (human_needed)
