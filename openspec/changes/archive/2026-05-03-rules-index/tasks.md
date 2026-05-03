## Tasks

- [x] Создать новый файл `.claude/rules/index.md` — без frontmatter, тело: YAML-блок `rules:` (секции `always:` и `path_scoped:`) + краткий текст always-триггеров
- [x] Обновить `.claude/CLAUDE.md` — добавить секцию `## Rules` с указанием, что `.claude/rules/index.md` является точкой входа и читается скиллами при install/audit/bump-version
- [x] Обновить `.claude/rules/meta-rules.md` — добавить `index.md` как явное исключение из правила «каждый файл MUST иметь `paths:`»
- [x] Обновить `skills/skill/setup/skill.md` — добавить шаг чтения `index.md` для определения состава правил при установке
- [x] Обновить `skills/sdd/audit/skill.md` — добавить шаг чтения `index.md` для проверки целостности rules-набора
- [x] Обновить `skills/dev/bump-version/skill.md`, `skills/sdd/bump-version/skill.md`, `skills/report/bump-version/skill.md`, `skills/research/bump-version/skill.md` — добавить чтение `index.md` для определения состава правил неймспейса
