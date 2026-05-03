---
approach: |
  Выполнить каждый затронутый скилл в тестовом репозитории и убедиться,
  что скрипты вызываются без FileNotFoundError.
  Проверить grep-ом, что ${CLAUDE_SKILL_DIR} полностью исчезло из тел скиллов.
acceptance_criteria:
  - grep -r "CLAUDE_SKILL_DIR" skills/ --include="*.md" не даёт вывода (кроме документационных упоминаний)
  - sdd:propose выполняет identity.py, state.py, _sdd_yaml.py без ошибок пути
  - sdd:apply выполняет скрипты без ошибок пути
  - sdd:archive выполняет скрипты без ошибок пути
  - sdd:contradiction выполняет contradiction.py без ошибок пути
  - SKILL_DESIGN.md содержит раздел про git-based паттерн
---

## Scenarios

### Сценарий 1: sdd:propose успешно вызывает identity.py
- GIVEN репозиторий с установленным awesome-claude
- WHEN пользователь вызывает /sdd:propose my-change
- THEN скрипт identity.py выполняется без ошибки пути
- THEN возвращает email пользователя

### Сценарий 2: все файлы скиллов не содержат ${CLAUDE_SKILL_DIR} в bash-командах
- GIVEN обновлённые skill.md файлы
- WHEN grep -r "CLAUDE_SKILL_DIR" skills/ применяется к телам скиллов
- THEN вывод пуст (переменная полностью устранена из bash-команд)

### Сценарий 3: git rev-parse работает при любом cwd
- GIVEN Claude запущен не из корня репозитория
- WHEN скилл вызывает $(git rev-parse --show-toplevel)
- THEN путь корректно резолвится в корень репозитория
