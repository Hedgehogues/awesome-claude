## 1. Расширение детектора placement (паттерны 4–5)

- [ ] 1.1 В `skills/sdd/contradiction.md` секция 3.7: добавить описание паттерна 4 (HOW в proposal.md) — маркеры, исключение `## Impact`
- [ ] 1.2 В `skills/sdd/contradiction.md` секция 3.7: добавить описание паттерна 5 (WHY в design.md) — маркеры `## Goals`/`## Objectives`, исключение `## Context`-бриджа
- [ ] 1.3 Обновить счётчик паттернов в описании детектора 3.7: «три паттерна» → «шесть паттернов»
- [ ] 1.4 Зеркалить в `.claude/skills/sdd/contradiction.md`

## 2. Расширение детектора redundancy (паттерн 6)

- [ ] 2.1 В `skills/sdd/contradiction.md` секция 3.5: добавить под-стратегию Context/Why cross-file — порог ≥3 предметных терминов, SSOT = proposal.md, pointer-rewrite
- [ ] 2.2 Зеркалить в `.claude/skills/sdd/contradiction.md`

## 3. Обновление N/A-условий

- [ ] 3.1 В `skills/sdd/contradiction.md` секция 3.7: добавить fallback `[placement pattern 4–6: N/A — change-directory mode required]` для не-change-directory режимов
- [ ] 3.2 Зеркалить в `.claude/skills/sdd/contradiction.md`

## 4. Тест-стабы для __dev

- [ ] 4.1 Создать `skills/__dev/cases/sdd/contradiction-placement.md` — кейс: proposal с delegation chain вне Impact, ожидаемый флаг паттерна 4
- [ ] 4.2 Создать кейс: design с `## Goals` без ссылки на proposal, ожидаемый флаг паттерна 5
- [ ] 4.3 Создать кейс: design `## Context` дублирует proposal `## Why`, ожидаемый флаг паттерна 6
- [ ] 4.4 Зеркалить `skills/__dev/` в `.claude/skills/__dev/`

## 5. Self-compliance sub-check (паттерн 7)

- [ ] 5.1 В `skills/sdd/contradiction.md` секция 3.7: добавить описание паттерна 7 (self-compliance) — subject detection, temporal-scope exclusion, Migration Plan exclusion, skill-subject exclusion
- [ ] 5.2 Обновить счётчик паттернов в описании 3.7: «шесть паттернов» → «семь паттернов»; обновить fallback note: `[placement pattern 4–6: N/A]` → `[placement pattern 4–7: N/A]`
- [ ] 5.3 Зеркалить в `.claude/skills/sdd/contradiction.md`
- [ ] 5.4 Создать `skills/__dev/cases/sdd/contradiction-self-compliance.md` — два кейса: (a) change с absent artifact без Migration Plan → флаг; (b) change с Migration Plan → нет флага
- [ ] 5.5 Зеркалить `skills/__dev/` в `.claude/skills/__dev/`

## 6. Coverage шаг 5 — Workflow-gate artifacts

- [ ] 6.1 В `skills/sdd/contradiction.md` секция 3.6: добавить шаг 5 — workflow-gate artifacts check (`test-plan.md`, `.sdd.yaml`); совпадение по имени файла в checkbox-строке; severity warning; формат issue
- [ ] 6.2 Зеркалить в `.claude/skills/sdd/contradiction.md`
- [ ] 6.3 Создать тест-кейс в `skills/__dev/cases/sdd/contradiction-coverage-workflow.md` — кейс: tasks.md без задачи на `test-plan.md` → ожидаемый `[warning] coverage: workflow artifact 'test-plan.md'`
- [ ] 6.4 Зеркалить `skills/__dev/` в `.claude/skills/__dev/`
