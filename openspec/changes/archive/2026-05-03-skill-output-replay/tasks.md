## 1. sdd:contradiction — write-then-replay финальная фаза

- [x] 1.1 В `.claude/skills/sdd/contradiction/skill.md` добавить шаг: записать форматированный вывод (`## Что делать`, `## Вопросы к пользователю`) в `.log/contradiction-${TS}-output.md` через bash-heredoc
- [x] 1.2 Добавить `cat` этого файла как последний шаг скилла contradiction (после лог-записи и перед финальной строкой `→ Подробный технический отчёт:`)
- [x] 1.3 Синхронизировать зеркало `skills/sdd/contradiction/skill.md`

## 2. sdd:apply — write-then-replay финальная фаза

- [x] 2.1 В `.claude/skills/sdd/apply/skill.md` добавить шаг: записать финальный блок (`## Описание`, `## Реализованные фичи`, `## Как проверить`, `## Решено самостоятельно`, `## Прочее`, `## Вопросы к пользователю`) в `.log/apply-${TS}-output.md`
- [x] 2.2 Добавить `cat` этого файла как последний шаг скилла apply
- [x] 2.3 Синхронизировать зеркало `skills/sdd/apply/skill.md`

## 3. sdd:archive — write-then-replay финальная фаза

- [x] 3.1 В `.claude/skills/sdd/archive/skill.md` добавить шаг: записать финальный блок (`## Описание`, `## Архивированные артефакты`, `## Решено самостоятельно`, `## Прочее`, `## Вопросы к пользователю`) в `.log/archive-${TS}-output.md`
- [x] 3.2 Добавить `cat` этого файла как последний шаг скилла archive
- [x] 3.3 Синхронизировать зеркало `skills/sdd/archive/skill.md`

## 4. claude-way.md — правило write-then-replay

- [x] 4.1 Добавить секцию `## Write-then-replay` в `.claude/rules/claude-way.md` с объяснением проблемы Agent tool и требованием SHALL для скиллов с форматированным финальным выводом
