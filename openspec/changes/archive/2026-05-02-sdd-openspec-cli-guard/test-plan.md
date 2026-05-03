---
approach: |
  Запустить каждый из 4 изменённых скиллов в тест-среде. Проверить: preflight выдаёт правильную ошибку при отсутствии openspec; при наличии openspec скилл проходит первый шаг без ошибки Unknown skill.
acceptance_criteria:
  - sdd:propose не падает с "Unknown skill: openspec-propose"
  - sdd:explore не падает с "Unknown skill: openspec-explore"
  - sdd:apply не падает с "Unknown skill: openspec-apply-change"
  - sdd:archive не падает с "Unknown skill: openspec-archive-change"
  - При отсутствии openspec все 4 скилла выдают "openspec not found. Install: npm install -g @openspec/cli"
---

## Scenarios

### sdd:propose — happy path
Запустить `/sdd:propose test-change`, убедиться что директория `openspec/changes/test-change/` создана через CLI.

### sdd:explore — happy path
Запустить `/sdd:explore тема`, убедиться что опросрежим открылся (opsx:explore сработал).

### sdd:apply — happy path
Запустить `/sdd:apply` на существующем change, убедиться что opsx:apply вызвался без ошибки.

### sdd:archive — happy path
Запустить `/sdd:archive <name>`, убедиться что `openspec archive <name> -y` выполнился.

### Все скиллы — openspec не установлен
При `PATH` без openspec каждый скилл должен остановиться с сообщением установки.
