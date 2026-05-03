## Why

Глобальные правила (файлы без `paths:` frontmatter) загружаются движком Claude Code недетерминированно: формально они «always active», но на практике могут не попасть в активный контекст. Это подтверждает опыт с `recommend-skills.md` — правило создано, но рекомендации не появились в новой сессии.

Кроме того, нет единой точки входа, которую можно читать программно: скиллы install, audit и bump-version не имеют способа узнать, какие правила входят в репо и каков их scope, не обходя весь `.claude/rules/` вручную.

## What Changes

- Новый файл `.claude/rules/index.md` — глобальное правило (no frontmatter) с YAML-блоком как machine-readable схемой: секции `always:` и `path_scoped:` перечисляют все правила репо с указанием файла, scope и namespace-владельца.
- Тело `index.md` содержит краткий набор always-триггеров (рекомендуй скилл, стоп на красных тестах и т.п.) — те инструкции, которые должны быть в контексте всегда.
- `.claude/CLAUDE.md` обновляется: добавляется явная секция `## Rules` с указанием, что точка входа — `index.md`, и что скиллы читают его при install/audit/bump-version.
- Скиллы `skill:setup` (install), `sdd:audit`, `dev:bump-version` / `sdd:bump-version` / `report:bump-version` / `research:bump-version` обновляются: читают `index.md` для определения состава и scope правил.

## Capabilities

### New Capabilities

- `rules-index`

## Impact

- `.claude/rules/index.md` — новый файл
- `.claude/CLAUDE.md` — обновлён (добавлена секция `## Rules`)
- `skills/skill/setup/skill.md` — обновлён (читает index.md)
- `skills/sdd/audit/skill.md` — обновлён (читает index.md)
- `skills/dev/bump-version/skill.md`, `skills/sdd/bump-version/skill.md`, `skills/report/bump-version/skill.md`, `skills/research/bump-version/skill.md` — обновлены (читают index.md)

See `.sdd.yaml` for capability declarations.
