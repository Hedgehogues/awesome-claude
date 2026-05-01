## 1. Скрипты сбора отчётов

- [ ] 1.1 Создать `skills/sdd/scripts/_sdd_yaml.py` — общий парсер `.sdd.yaml`, отдаёт `creates: list[str]`, `merges_into: list[str]`. Используется тремя скриптами ниже.
- [ ] 1.2 Создать `skills/sdd/scripts/apply_report.py` — читает `.sdd.yaml.creates`, парсит `tasks.md` (чекбоксы по группам/capabilities), читает `test-plan.md` (`acceptance_criteria` + `## Scenarios`), возвращает JSON `{capabilities: [{name, status: "done"|"partial"}], file_facts: [...], verify: [{capability, scenario, where, how_skeleton}]}`. Поле `how` оставляется пустым — заполняется LLM на этапе рендера.
- [ ] 1.3 Создать `skills/sdd/scripts/contradiction_summary.py` — парсит Summary существующего детализированного отчёта детекторов (stdin или путь к файлу), отдаёт JSON `{hard_counts: {numeric, reference, deontic, semantic}, warning_counts: {redundancy, coverage, ...}, residual_risk}`.
- [ ] 1.4 Создать `skills/sdd/scripts/archive_report.py` — читает `.sdd.yaml.creates`, проверяет существование `openspec/specs/<cap>/spec.md` и `openspec/specs/<cap>/test-plan.md`, отдаёт JSON `{archived: [{name, spec_path, test_plan_path, exists: bool}]}`.
- [ ] 1.5 Зеркалировать все четыре скрипта в `.claude/skills/sdd/scripts/`.
- [ ] 1.6 Self-test для каждого скрипта при запуске напрямую (`python apply_report.py <change-dir>` и т.д.).

## 2. Обновление `sdd:apply`

- [ ] 2.1 В `skills/sdd/apply.md` добавить финальный шаг «Финальный отчёт»: вызвать `apply_report.py`, получить JSON, сформировать markdown в строгом порядке: `## Технические статусы` → `## Описание` → `## Реализованные фичи` → `## Как проверить` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок).
- [ ] 2.2 В шаге зафиксировать правила «Вопросы к пользователю»: только то, что вне компетенции Claude; **последняя строка — всегда CTA**; по умолчанию `<N>. Продолжаем по флоу? (да / нет)`; минимум — одна строка `1. Продолжаем по флоу? (да / нет)` даже если других вопросов нет.
- [ ] 2.3 Зафиксировать «Реализованные фичи» — `done`/`partial` из `tasks.md`; пустой creates → `_нет_` (заголовок остаётся).
- [ ] 2.4 Зафиксировать «Как проверить»: для каждой фичи 3 поля — `**Что:** …`, `**Где:** …`, `**Как:** <command> → ожидание: <result>`. Skeleton (Что/Где) приходит из `apply_report.py.verify[]`, поле «Как» Claude заполняет; пустой creates / отсутствующий test-plan → `_нет_`.
- [ ] 2.5 Если Claude выбирает между равнозначными командами для поля «Как» — выбор и обоснование уходят строкой в `## Решено самостоятельно`.
- [ ] 2.6 Зафиксировать опциональные блоки: `## Решено самостоятельно` (формат `<вопрос> → <решение>`) и `## Прочее` (заметки без действия) — опускаются, если пусто; всегда выше `## Вопросы к пользователю`.
- [ ] 2.7 Зеркалировать `skills/sdd/apply.md` в `.claude/skills/sdd/apply.md`.

## 3. Обновление `sdd:contradiction`

- [ ] 3.1 В `skills/sdd/contradiction.md` добавить финальный шаг «User-facing wrapper» **после** Phase 5 и существующего `## Report format`: формирует markdown в строгом порядке `## Технические статусы` → `## Описание` → `## Найденные противоречия` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок). **Блок `## Как проверить` НЕ рендерится** — он только в `sdd:apply`.
- [ ] 3.2 Зафиксировать: существующий детализированный отчёт целиком вкладывается в `## Технические статусы` без изменений (verbatim); `## Найденные противоречия` строится из `contradiction_summary.py` поверх Summary существующего отчёта.
- [ ] 3.3 Decision-gate развилки нумеруются в `## Вопросы к пользователю` первыми; CTA `Продолжаем по флоу? (да / нет)` — финальная строка отчёта (всегда есть, даже если decision-gate не сработал).
- [ ] 3.4 Зафиксировать опциональные блоки `## Решено самостоятельно` и `## Прочее` в том же порядке, что и для apply.
- [ ] 3.5 Зеркалировать `skills/sdd/contradiction.md` в `.claude/skills/sdd/contradiction.md`.

## 4. Обновление `sdd:archive`

- [ ] 4.1 В `skills/sdd/archive.md` добавить финальный шаг «Финальный отчёт» **после** шага 5 (копирование test-plan.md): вызвать `archive_report.py`, сформировать markdown в строгом порядке `## Технические статусы` → `## Описание` → `## Архивированные артефакты` → опц. `## Решено самостоятельно` → опц. `## Прочее` → `## Вопросы к пользователю` (последний блок). **Блок `## Как проверить` НЕ рендерится** — он только в `sdd:apply`.
- [ ] 4.2 Зафиксировать «Архивированные артефакты» — capabilities из `.sdd.yaml.creates` с путями к spec.md и test-plan.md; пустой creates → `_нет_` (заголовок остаётся).
- [ ] 4.3 Зафиксировать «Вопросы к пользователю»: обычно только CTA `1. Продолжаем по флоу? (да / нет)` (последняя строка отчёта).
- [ ] 4.4 Зафиксировать опциональные блоки `## Решено самостоятельно` и `## Прочее` в том же порядке, что и для apply.
- [ ] 4.5 Зеркалировать `skills/sdd/archive.md` в `.claude/skills/sdd/archive.md`.

## 5. Тест-кейсы

- [ ] 5.1 В `skills/skill/cases/sdd/apply.md` добавить кейс «final report has the canonical block order (apply)»: `semantic:`-проверка порядка `Технические статусы → Описание → Реализованные фичи → Как проверить → (опц.) Решено самостоятельно → (опц.) Прочее → Вопросы к пользователю` (последний).
- [ ] 5.2 В `skills/skill/cases/sdd/apply.md` добавить кейс «no content below «Вопросы к пользователю»»: `semantic:`-проверка, что после блока вопросов нет ни заголовков, ни прозы.
- [ ] 5.3 В `skills/skill/cases/sdd/apply.md` добавить кейс «CTA is the last line»: `semantic:` — последняя непустая строка отчёта = строка с `Продолжаем по флоу? (да / нет)`.
- [ ] 5.4 В `skills/skill/cases/sdd/apply.md` добавить кейс «empty creates renders _нет_ in features section».
- [ ] 5.5 В `skills/skill/cases/sdd/apply.md` добавить кейс «autonomous decisions go to «Решено самостоятельно», not to «Вопросы к пользователю»»: `semantic:` — строки с маркером `→` присутствуют только в `## Решено самостоятельно`.
- [ ] 5.6 В `skills/skill/cases/sdd/apply.md` добавить кейс «Как проверить has Что/Где/Как fields per feature»: `contains:` для меток `**Что:**`, `**Где:**`, `**Как:**`; `semantic:` — для каждой capability из «Реализованные фичи» есть запись в «Как проверить».
- [ ] 5.7 В `skills/skill/cases/sdd/apply.md` добавить кейс «empty creates / missing test-plan → «Как проверить» renders _нет_».
- [ ] 5.8 В `skills/skill/cases/sdd/contradiction.md` повторить 5.1–5.3 для contradiction-варианта (per-skill итог = `## Найденные противоречия`).
- [ ] 5.9 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «existing detailed report embedded verbatim inside «Технические статусы»»: `contains:` для маркеров (`--- Hard issues ---`, `--- Summary ---`).
- [ ] 5.10 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «no hard issues → «Найденные противоречия» renders _нет_».
- [ ] 5.11 В `skills/skill/cases/sdd/contradiction.md` добавить кейс «no «Как проверить» block in contradiction report»: `semantic:` — заголовок `## Как проверить` отсутствует.
- [ ] 5.12 В `skills/skill/cases/sdd/archive.md` повторить 5.1–5.3 для archive-варианта (per-skill итог = `## Архивированные артефакты`).
- [ ] 5.13 В `skills/skill/cases/sdd/archive.md` добавить кейс «empty creates → «Архивированные артефакты» renders _нет_».
- [ ] 5.14 В `skills/skill/cases/sdd/archive.md` добавить кейс «archived artifacts list paths to spec.md and test-plan.md».
- [ ] 5.15 В `skills/skill/cases/sdd/archive.md` добавить кейс «no «Как проверить» block in archive report»: `semantic:` — заголовок `## Как проверить` отсутствует.
- [ ] 5.16 Зеркалировать все обновлённые case-файлы в `.claude/skills/skill/cases/sdd/`.

## 6. Документация и валидация

- [ ] 6.1 Обновить `docs/SKILL_DESIGN.md` (если описывает формат вывода скиллов) — упомянуть 4-блочную структуру как стандарт для трёх workflow-скиллов.
- [ ] 6.2 Прогнать `skill:test-skill sdd:apply`, `skill:test-skill sdd:contradiction`, `skill:test-skill sdd:archive` локально — все кейсы зелёные.
- [ ] 6.3 Прогнать `sdd:contradiction openspec/changes/structured-apply-output/` — без hard issues; warnings допустимы и обоснованы.
