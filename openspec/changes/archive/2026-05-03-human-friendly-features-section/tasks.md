## 1. Обновление схемы `.sdd.yaml`

- [ ] 1.1 В `skills/sdd/scripts/_sdd_yaml.py` добавить функцию `read_creates_with_meta()` → возвращает `list[{name: str, title: str | None}]`, нормализуя как строки, так и объекты `{name, title}`
- [ ] 1.2 Убедиться, что существующая `read_creates()` возвращает только `list[str]` (без изменений — backward compatibility)
- [ ] 1.3 Зеркалировать `_sdd_yaml.py` в `.claude/skills/sdd/scripts/`

## 2. Обновление `apply_report.py`

- [ ] 2.1 Использовать `read_creates_with_meta()` вместо `read_creates()`
- [ ] 2.2 Для каждого capability возвращать `{name, title, status, incomplete_count}`, где `title` — строка или `null`, `incomplete_count` — число незакрытых чекбоксов в группе capability
- [ ] 2.3 Зеркалировать в `.claude/skills/sdd/scripts/apply_report.py`

## 3. Обновление `sdd:apply` — рендер «Реализованные фичи»

- [ ] 3.1 В `skills/sdd/apply/skill.md` в шаге рендера «Реализованные фичи» заменить «имя + статус done|partial» на: «`title` (если есть, иначе `name`) — статус на русском; для partial добавить `(N задач не завершено)`»
- [ ] 3.2 Зафиксировать маппинг: `done` → «готово», `partial` → «частично»
- [ ] 3.3 Зеркалировать `skills/sdd/apply/skill.md` в `.claude/skills/sdd/apply/skill.md`

## 4. Обновление `sdd:propose` — подсказка для `title`

- [ ] 4.1 В `skills/sdd/propose/skill.md` в шаге создания `.sdd.yaml` добавить: после записи `creates` — если capability записан как строка, предложить формат `{name: ..., title: ...}` и описать зачем это нужно
- [ ] 4.2 Зеркалировать в `.claude/skills/sdd/propose/skill.md`

## 5. Обновление `sdd:apply` — рендер «Как проверить»

- [ ] 5.1 В `skills/sdd/apply/skill.md` в шаге рендера «Как проверить» заменить «имя capability» на `title` (или `name` если `title` отсутствует)
- [ ] 5.2 Зафиксировать правило для поля «Что»: ожидаемое поведение с точки зрения пользователя, без упоминания имён файлов, скриптов и технических инвариантов
- [ ] 5.3 Зафиксировать правило для поля «Как»: сначала предложение с ожиданием на русском, затем (опционально) команда для проверки; поле НЕ начинается с голой shell-команды
- [ ] 5.4 Зеркалировать `skills/sdd/apply/skill.md` в `.claude/skills/sdd/apply/skill.md`

## 6. Обновление `sdd:contradiction` — подсказки и правило «поясни»

- [ ] 6.1 В `skills/sdd/contradiction/skill.md` в шаге рендера `## Что делать` добавить: каждая строка `- [ ]` заканчивается на `(непонятно — скажи «поясни», слишком очевидно — скажи «детали»)`
- [ ] 6.2 В `skills/sdd/contradiction/skill.md` в шаге рендера `## Вопросы к пользователю` добавить: каждый вопрос заканчивается на `(непонятно — скажи «поясни», слишком очевидно — скажи «детали»)` — по той же схеме
- [ ] 6.3 В `skills/sdd/contradiction/skill.md` добавить правило поведения: если пользователь отвечает «поясни», «не понял», «сложно» или аналогично — следующий ответ скилла строго одно предложение на русском языке без технических терминов, имён файлов и вариантов реализации; при повторном «поясни» — переформулировать иначе, объём не увеличивать
- [ ] 6.4 В `skills/sdd/contradiction/skill.md` в правилах рендера `## Вопросы к пользователю` зафиксировать: в блок попадают только вопросы про желаемое поведение, на которые можно ответить не зная кода; технические выборы (структура данных, флаги, внутренние API) Claude закрывает самостоятельно и фиксирует в `## Решено самостоятельно`
- [ ] 6.5 Зеркалировать `skills/sdd/contradiction/skill.md` в `.claude/skills/sdd/contradiction/skill.md`

## 7. Тест-кейсы

- [ ] 7.1 В `skills/sdd/apply/cases/apply.md` добавить кейс «title renders instead of name in features section»: `contains:` для значения title, `not_contains:` для kebab-name
- [ ] 7.2 В `skills/sdd/apply/cases/apply.md` добавить кейс «status is in Russian»: `contains: "готово"` или `contains: "частично"`
- [ ] 7.3 В `skills/sdd/apply/cases/apply.md` добавить кейс «partial shows incomplete count not raw tasks»: `contains: "задач не завершено"`, `not_contains:` для сырого текста задачи
- [ ] 7.4 В `skills/sdd/apply/cases/apply.md` добавить кейс «string capability falls back to name if no title»
- [ ] 7.5 В `skills/sdd/apply/cases/apply.md` добавить кейс «verify section uses title not kebab-name»: `contains:` для title, `not_contains:` для kebab-name
- [ ] 7.6 В `skills/sdd/apply/cases/apply.md` добавить кейс «verify "Как" field starts with human expectation, not command»: `semantic:` поле «Как» начинается с предложения на русском
- [ ] 7.7 В `skills/sdd/contradiction/cases/` добавить кейс «todo items end with clarification hint»: `contains: "поясни"` и `contains: "детали"`
- [ ] 7.8 Зеркалировать обновлённые case-файлы в `.claude/skills/sdd/apply/cases/` и `.claude/skills/sdd/contradiction/cases/`
