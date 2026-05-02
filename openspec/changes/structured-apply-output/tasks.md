## 1. Скрипты сбора отчётов

- [x] 1.1 Создать `skills/sdd/scripts/_sdd_yaml.py` — общий парсер `.sdd.yaml`, отдаёт `creates: list[str]`, `merges_into: list[str]`. Используется тремя скриптами ниже.
- [x] 1.2 Создать `skills/sdd/scripts/apply_report.py` — читает `.sdd.yaml.creates`, парсит `tasks.md` (чекбоксы по группам/capabilities), читает `test-plan.md` (`acceptance_criteria` + `## Scenarios`), возвращает JSON `{capabilities: [{name, status: "done"|"partial"}], file_facts: [...], verify: [{capability, scenario, where, how_skeleton}]}`. Поле `how` оставляется пустым — заполняется LLM на этапе рендера.
- [x] 1.3 Создать `skills/sdd/scripts/contradiction_summary.py` — парсит Summary существующего детализированного отчёта детекторов (stdin или путь к файлу), отдаёт JSON `{hard_counts: {numeric, reference, deontic, semantic}, warning_counts: {redundancy, coverage, ...}, residual_risk}`.
- [x] 1.4 Создать `skills/sdd/scripts/archive_report.py` — читает `.sdd.yaml.creates`, проверяет существование `openspec/specs/<cap>/spec.md` и `openspec/specs/<cap>/test-plan.md`, отдаёт JSON `{archived: [{name, spec_path, test_plan_path, exists: bool}]}`.
- [x] 1.5 Зеркалировать все четыре скрипта в `.claude/skills/sdd/scripts/`.
- [x] 1.6 Self-test для каждого скрипта при запуске напрямую (`python apply_report.py <change-dir>` и т.д.).

## 2. Обновление `sdd:apply`

- [x] 2.1 В `skills/sdd/apply.md` добавить финальный шаг «Финальный отчёт»: вызвать `apply_report.py`, получить JSON, сформировать markdown в строгом порядке: `## Технические статусы` → `## Описание` → `## Реализованные фичи` → `## Как проверить` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок).
- [x] 2.2 В шаге зафиксировать правила «Вопросы к пользователю»: только реальные user-only вопросы; если их нет — единственная строка `Продолжаю.` (констатация, не вопрос); синтетические CTA `Продолжаем по флоу?` запрещены.
- [x] 2.3 Зафиксировать «Реализованные фичи» — `done`/`partial` из `tasks.md`; пустой creates → `_нет_` (заголовок остаётся).
- [x] 2.4 Зафиксировать «Как проверить»: для каждой фичи 3 поля — `**Что:** …`, `**Где:** …`, `**Как:** <command> → ожидание: <result>`. Skeleton (Что/Где) приходит из `apply_report.py.verify[]`, поле «Как» Claude заполняет; пустой creates / отсутствующий test-plan → `_нет_`.
- [x] 2.5 Если Claude выбирает между равнозначными командами для поля «Как» — выбор и обоснование уходят строкой в `## Решено самостоятельно`.
- [x] 2.6 Зафиксировать опциональные блоки: `## Решено самостоятельно` (формат `<вопрос> → <решение>`) и `## Прочее` (заметки без действия) — опускаются, если пусто; всегда выше `## Вопросы к пользователю`.
- [x] 2.7 Зеркалировать `skills/sdd/apply.md` в `.claude/skills/sdd/apply.md`.

## 3. Обновление `sdd:contradiction`

- [x] 3.1 В `skills/sdd/contradiction.md` добавить финальный шаг «User-facing wrapper» **после** Phase 5 и существующего `## Report format`: формирует markdown в строгом порядке `## Технические статусы` → `## Описание` → `## Найденные противоречия` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок). **Блок `## Как проверить` НЕ рендерится** — он только в `sdd:apply`.
- [x] 3.2 Зафиксировать: существующий детализированный отчёт целиком вкладывается в `## Технические статусы` без изменений (verbatim); `## Найденные противоречия` строится из `contradiction_summary.py` поверх Summary существующего отчёта.
- [x] 3.3 Decision-gate развилки рендерятся в `## Вопросы к пользователю` нумерованным списком; если decision-gate не сработал и других user-only вопросов нет — блок содержит ровно `Продолжаю.` (никаких синтетических CTA).
- [x] 3.4 Зафиксировать опциональные блоки `## Решено самостоятельно` и `## Прочее` в том же порядке, что и для apply.
- [x] 3.5 Зеркалировать `skills/sdd/contradiction.md` в `.claude/skills/sdd/contradiction.md`.

## 4. Обновление `sdd:archive`

- [x] 4.1 В `skills/sdd/archive.md` добавить финальный шаг «Финальный отчёт» **после** шага 5 (копирование test-plan.md): вызвать `archive_report.py`, сформировать markdown в строгом порядке `## Технические статусы` → `## Описание` → `## Архивированные артефакты` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок). **Блок `## Как проверить` НЕ рендерится** — он только в `sdd:apply`.
- [x] 4.2 Зафиксировать «Архивированные артефакты» — capabilities из `.sdd.yaml.creates` с путями к spec.md и test-plan.md; пустой creates → `_нет_` (заголовок остаётся).
- [x] 4.3 Зафиксировать «Вопросы к пользователю»: для archive обычно ничего реального не нужно — блок содержит ровно `Продолжаю.` Никакого синтетического CTA `Продолжаем по флоу?`.
- [x] 4.4 Зафиксировать опциональные блоки `## Решено самостоятельно` и `## Прочее` в том же порядке, что и для apply.
- [x] 4.5 Зеркалировать `skills/sdd/archive.md` в `.claude/skills/sdd/archive.md`.

## 5. Тест-кейсы

- [x] 5.1 В `skills/skill/cases/sdd/apply.md` добавить кейс «final report has the canonical block order (apply)»: `semantic:`-проверка порядка `Технические статусы → Описание → Реализованные фичи → Как проверить → (опц.) Решено самостоятельно → (опц.) Прочее → Вопросы к пользователю` (последний).
- [x] 5.2 В `skills/skill/cases/sdd/apply.md` добавить кейс «no content below «Вопросы к пользователю»»: `semantic:`-проверка, что после блока вопросов нет ни заголовков, ни прозы.
- [x] 5.3 В `skills/skill/cases/sdd/apply.md` добавить два кейса для блока «Вопросы к пользователю»: (a) «no real questions → body is `Продолжаю.`» — `contains: "Продолжаю."` и `semantic:` отсутствует нумерованный список и нет `?`; (b) «no synthetic CTA» — `semantic:` строка `Продолжаем по флоу?` НЕ появляется автоматически.
- [x] 5.4 В `skills/skill/cases/sdd/apply.md` добавить кейс «empty creates renders _нет_ in features section».
- [x] 5.5 В `skills/skill/cases/sdd/apply.md` добавить кейс «autonomous decisions go to «Решено самостоятельно», not to «Вопросы к пользователю»».
- [x] 5.6 В `skills/skill/cases/sdd/apply.md` добавить кейс «Как проверить has Что/Где/Как fields per feature»: `contains:` для меток `**Что:**`, `**Где:**`, `**Как:**`.
- [x] 5.7 В `skills/skill/cases/sdd/apply.md` добавить кейс «empty creates / missing test-plan → «Как проверить» renders _нет_».
- [x] 5.8 В `skills/skill/cases/sdd/contradiction.md` повторить 5.1–5.3 для contradiction-варианта.
- [x] 5.9 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «existing detailed report embedded verbatim inside «Технические статусы»».
- [x] 5.10 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «no hard issues → «Найденные противоречия» renders _нет_».
- [x] 5.11 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «no «Как проверить» block in contradiction report».
- [x] 5.12 В `skills/skill/cases/sdd/archive.md` повторить 5.1–5.3 для archive-варианта.
- [x] 5.13 В `skills/skill/cases/sdd/archive.md` добавить кейс «empty creates → «Архивированные артефакты» renders _нет_».
- [x] 5.14 В `skills/skill/cases/sdd/archive.md` добавить кейс «archived artifacts list paths to spec.md and test-plan.md».
- [x] 5.15 В `skills/skill/cases/sdd/archive.md` добавить кейс «no «Как проверить» block in archive report».
- [x] 5.16 Зеркалировать все обновлённые case-файлы в `.claude/skills/skill/cases/sdd/`.

## 6. Правила коммуникационного стиля

- [x] 6.1 В `skills/sdd/apply.md`, `skills/sdd/contradiction.md`, `skills/sdd/archive.md` добавить раздел «Communication style».
- [x] 6.2 Зеркалировать в `.claude/skills/sdd/{apply,contradiction,archive}.md`.
- [x] 6.3 В `skills/skill/cases/sdd/apply.md`, `contradiction.md`, `archive.md` добавить кейс «no detector jargon in user-facing blocks».
- [x] 6.4 В `skills/skill/cases/sdd/apply.md` добавить кейс «intermediate clarifications use prose, not block format».
- [x] 6.5 Зеркалировать обновлённые case-файлы в `.claude/skills/skill/cases/sdd/`.

## 7. Документация и валидация

- [x] 7.1 Обновить `docs/SKILL_DESIGN.md` — упомянуть 7-блочную структуру и правила коммуникационного стиля.
- [ ] 7.2 Прогнать `skill:test-skill sdd:apply`, `skill:test-skill sdd:contradiction`, `skill:test-skill sdd:archive` локально — все кейсы зелёные.
- [ ] 7.3 Прогнать `sdd:contradiction openspec/changes/structured-apply-output/` — без hard issues; warnings допустимы и обоснованы.
