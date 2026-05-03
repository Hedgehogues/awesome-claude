## 1. Убрать мёртвый код из sdd:propose/skill.md

- [ ] 1.1 Удалить строку про `.openspec-version` из frontmatter description
- [ ] 1.2 Заменить шаг 1 (вызов `openspec-propose` через Skill tool) на guard + `openspec new change`

## 2. Добавить guard

- [ ] 2.1 Добавить в начало шагов: `which openspec || { echo "openspec not found. Run /dev:install"; exit 1; }`

## 3. Верификация

- [ ] 3.1 Убедиться, что `/sdd:propose` проходит до конца без ошибки `Unknown skill: openspec-propose`
- [ ] 3.2 Убедиться, что при отсутствии `openspec` выводится корректное сообщение
