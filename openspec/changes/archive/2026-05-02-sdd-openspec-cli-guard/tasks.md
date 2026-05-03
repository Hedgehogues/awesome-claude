## 1. Preflight guard во всех 4 скиллах

- [x] 1.1 `skills/sdd/propose/skill.md` — добавить preflight `which openspec` перед шагом 1; убрать из frontmatter упоминание `.openspec-version`
- [x] 1.2 `skills/sdd/explore/skill.md` — добавить preflight `which openspec`; убрать из frontmatter упоминание `.openspec-version`
- [x] 1.3 `skills/sdd/apply/skill.md` — добавить preflight `which openspec`; убрать из frontmatter упоминание `.openspec-version`
- [x] 1.4 `skills/sdd/archive/skill.md` — добавить preflight `which openspec`; убрать из frontmatter упоминание `.openspec-version`

## 2. Замена делегирований

- [x] 2.1 `skills/sdd/propose/skill.md` шаг 1 — заменить `Skill('openspec-propose')` на `openspec new change "<name>"` через Bash; добавить запрос имени если не передан в args
- [x] 2.2 `skills/sdd/explore/skill.md` — заменить `Skill('openspec-explore')` на `Skill('opsx:explore')`
- [x] 2.3 `skills/sdd/apply/skill.md` шаг 5 — заменить `Skill('openspec-apply-change')` на `Skill('opsx:apply')`
- [x] 2.4 `skills/sdd/archive/skill.md` шаг 6 — заменить `Skill('openspec-archive-change')` на `openspec archive "<name>" -y` через Bash

## 3. Проверка смежных упоминаний

- [x] 3.1 Проверить frontmatter `description` всех 4 скиллов — убрать упоминания `openspec-*` и `.openspec-version`
- [x] 3.2 Проверить `opsx:archive` — там упоминается `openspec-sync-specs`; оценить нужна ли аналогичная правка
