---
approach: |
  Верификация через чтение изменённых файлов и ручной запуск команды.
  _sdd_yaml.py — запустить update-index-description на реальном index.yaml, проверить результат.
  skill.md — проверить grep на наличие merges-into в шаге 7 и шаге 9.
acceptance_criteria:
  - grep "merges-into" skills/sdd/archive/skill.md возвращает совпадения в шаге 7
  - grep "update-index-description" skills/sdd/archive/skill.md возвращает совпадение в шаге 9
  - python3 skills/sdd/scripts/_sdd_yaml.py update-index-description openspec/specs/index.yaml <existing-cap> "test" обновляет description и возвращает exit 0
  - python3 skills/sdd/scripts/_sdd_yaml.py update-index-description openspec/specs/index.yaml missing-cap "x" возвращает exit 2
  - .claude/ копии совпадают с skills/ копиями
---

## Scenarios

**Happy path — update-index-description:**
Запустить `python3 skills/sdd/scripts/_sdd_yaml.py update-index-description openspec/specs/index.yaml contradiction-full-scan "Updated description"`.
Ожидаемо: exit 0, поле `description` в index.yaml обновлено.

**Missing capability:**
Запустить с несуществующим именем capability.
Ожидаемо: exit 2, stderr содержит `not found`.

**skill.md step 7 contains merges-into:**
`grep -n "merges-into" skills/sdd/archive/skill.md` — результат должен включать строку из шага 7.

**skill.md step 9 contains update-index-description:**
`grep -n "update-index-description" skills/sdd/archive/skill.md` — результат должен включать строку из шага 9.

**Mirror check:**
`diff skills/sdd/archive/skill.md .claude/skills/sdd/archive/skill.md` — нет различий.
`diff skills/sdd/scripts/_sdd_yaml.py .claude/skills/sdd/scripts/_sdd_yaml.py` — нет различий.
