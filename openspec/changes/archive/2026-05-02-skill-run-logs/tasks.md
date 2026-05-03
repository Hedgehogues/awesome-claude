## 1. .gitignore

- [ ] 1.1 Добавить `**/.log/` в `.gitignore` (в секцию SDD workflow runtime state)

## 2. sdd:contradiction — запись лога

- [ ] 2.1 Добавить шаг записи лога в `.claude/skills/sdd/contradiction/skill.md`: после Phase 5 и перед `User-facing wrapper` — записать технический отчёт детекторов в `.log/contradiction-<timestamp>.md`
- [ ] 2.2 Добавить в лог секцию `## Drift` с таблицей весов (hard×10, warning×1, итого drift_score) и однострочным комментарием к каждой строке
- [ ] 2.3 Убрать `## Технические статусы` из диалогового вывода; добавить строку `→ Подробный технический отчёт: .log/contradiction-<timestamp>.md`
- [ ] 2.4 Переписать инструкцию генерации `## Что делать`: каждый warning → одна строка `- [ ] <действие без файловых путей и жаргона>` на русском
- [ ] 2.5 Обновить зеркальную копию `skills/sdd/contradiction/skill.md` в корне репозитория

## 3. sdd:apply — запись лога

- [ ] 3.1 Добавить шаг записи лога в `.claude/skills/sdd/apply/skill.md`: перед финальным отчётом записать L1/L2/L3 результаты и verify-вердикт в `.log/apply-<timestamp>.md`
- [ ] 3.2 Убрать `## Технические статусы` из диалогового вывода apply; добавить ссылку на лог
- [ ] 3.3 Обновить зеркальную копию `skills/sdd/apply/skill.md`

## 4. sdd:propose — запись лога

- [ ] 4.1 Добавить шаг записи лога в `.claude/skills/sdd/propose/skill.md`: после всех шагов записать результаты (capability-пересечения, design-check, итог) в `.log/propose-<timestamp>.md`
- [ ] 4.2 Добавить ссылку на лог в конец вывода propose
- [ ] 4.3 Обновить зеркальную копию `skills/sdd/propose/skill.md`

## 5. sdd:archive — запись лога

- [ ] 5.1 Добавить шаг записи лога в `.claude/skills/sdd/archive/skill.md`: список архивируемых файлов и результаты проверок в `.log/archive-<timestamp>.md`
- [ ] 5.2 Добавить ссылку на лог в конец вывода archive
- [ ] 5.3 Обновить зеркальную копию `skills/sdd/archive/skill.md`
