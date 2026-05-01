## 1. Скрипт сбора отчёта

- [ ] 1.1 Создать `skills/sdd/scripts/apply_report.py` — читает `openspec/changes/<name>/.sdd.yaml` (поле `creates`), парсит `tasks.md` (чекбоксы по группам/capabilities), возвращает JSON `{capabilities: [{name, status: "done"|"partial"}], file_facts: [...]}`.
- [ ] 1.2 Зеркалировать в `.claude/skills/sdd/scripts/apply_report.py`.
- [ ] 1.3 Добавить простой self-test в скрипт (если запущен напрямую, прогнать на текущем change'е и распечатать результат).

## 2. Обновление `sdd:apply`

- [ ] 2.1 В `skills/sdd/apply.md` добавить шаг 5 «Финальный отчёт»: вызвать `apply_report.py`, получить структурированные данные, сформировать 4 markdown-блока в фиксированном порядке (`## Технические статусы`, `## Описание`, `## Вопросы к пользователю`, `## Реализованные фичи`).
- [ ] 2.2 Указать в шаге 5 правило для блока «Вопросы к пользователю»: только блокирующие вопросы; если их нет — `_нет_`.
- [ ] 2.3 Указать в шаге 5 правило для «Реализованные фичи»: список из `.sdd.yaml.creates`, статус `done`/`partial` из `tasks.md`; если creates пустое — `_нет_`.
- [ ] 2.4 Указать опциональный блок `## Прочее` для нерелевантных пользователю заметок и follow-up.
- [ ] 2.5 Зеркалировать `skills/sdd/apply.md` в `.claude/skills/sdd/apply.md`.

## 3. Тест-кейсы

- [ ] 3.1 В `skills/skill/cases/sdd/apply.md` добавить кейс «final report has four mandatory headings»: stub `change-with-sdd-yaml`, `contains:` для четырёх заголовков, порядок проверяется `semantic:`.
- [ ] 3.2 Добавить кейс «empty creates renders _нет_ in features section»: stub без `creates`, `contains: "_нет_"` в секции «Реализованные фичи».
- [ ] 3.3 Добавить кейс «no blocking questions renders _нет_»: `contains: "_нет_"` в секции «Вопросы к пользователю» когда блокирующих вопросов нет.
- [ ] 3.4 Зеркалировать в `.claude/skills/skill/cases/sdd/apply.md`.

## 4. Документация и spec

- [ ] 4.1 Обновить `docs/SKILL_DESIGN.md` (если описывает формат вывода скиллов) — упомянуть трёхчастную структуру + список фич как стандарт для `sdd:apply`.
- [ ] 4.2 Прогнать `skill:test-skill sdd:apply` локально — все кейсы зелёные.
- [ ] 4.3 Прогнать `sdd:contradiction` для change'а — без нарушений.
