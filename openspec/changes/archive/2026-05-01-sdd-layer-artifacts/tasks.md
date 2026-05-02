## 1. Документация

- [x] 1.1 Добавить в `docs/SKILL_DESIGN.md` описание SDD-артефактов: `test-plan.md`, `.sdd.yaml`
- [x] 1.2 Добавить в `docs/SKILL_DESIGN.md` обязательные секции `design.md`: Technical Approach, Architecture Decisions, Data Flow, File Changes
- [x] 1.3 Добавить в `docs/SKILL_DESIGN.md` формат `.sdd.yaml` с описанием полей `creates` и `merges-into`
- [x] 1.4 Добавить в `docs/SKILL_DESIGN.md` формат `openspec/specs/index.yaml` с примером
- [x] 1.5 Добавить в `docs/SKILL_DESIGN.md` формат `test-plan.md`: YAML front matter (`approach`, `acceptance_criteria`) + markdown body (`## Scenarios`)

## 2. Обновление sdd:propose

- [x] 2.1 Создавать `.sdd.yaml` stub при генерации нового change (`creates: []`, `merges-into: []`)
- [x] 2.2 Создавать `test-plan.md` stub: YAML front matter с полями `approach` и `acceptance_criteria`, markdown body с секцией `## Scenarios`
- [x] 2.3 Форматтер `design.md`: проверить наличие четырёх обязательных секций
- [x] 2.4 Форматтер `proposal.md`: проверить наличие ссылки на `.sdd.yaml`
- [x] 2.5 Зеркалить в `.claude/skills/sdd/propose.md`

## 3. Обновление sdd:apply

- [x] 3.1 Читать `test-plan.md` как контекст при имплементации (наряду со specs и design.md)
- [x] 3.2 Добавить или обновить запись в `openspec/specs/index.yaml` для каждой capability из `.sdd.yaml` `creates`
- [x] 3.3 Зеркалить в `.claude/skills/sdd/apply.md`

## 4. Обновление sdd:archive

- [x] 4.1 Копировать `test-plan.md` в `openspec/specs/<capability>/test-plan.md`
- [x] 4.2 Проверять наличие `test-plan.md` перед архивированием; блокировать если отсутствует
- [x] 4.3 Обновить `openspec/specs/index.yaml`: добавить или обновить записи для capabilities из `.sdd.yaml`
- [x] 4.4 Зеркалить в `.claude/skills/sdd/archive.md`

## 5. Создание contradiction.py

- [x] 5.1 Создать `skills/sdd/contradiction.py`
- [x] 5.2 Читать `openspec/specs/index.yaml` — список всех capabilities
- [x] 5.3 Читать `.sdd.yaml` текущего change — `creates` и `merges-into`
- [x] 5.4 Загружать `spec.md` для всех capabilities из индекса и из `.sdd.yaml`
- [x] 5.5 Выводить структурированный пакет: capability name + spec content для каждой
- [x] 5.6 Выводить summary: total discovered, total loaded, skipped with reason
- [x] 5.7 Сообщать если `index.yaml` или `.sdd.yaml` не найдены
- [x] 5.8 Скопировать `skills/sdd/contradiction.py` в `.claude/skills/sdd/contradiction.py` (зеркало Python-скрипта рядом со skill-файлом)

## 6. Обновление sdd:contradiction

- [x] 6.1 Вызывать `contradiction.py` передавая путь к change-директории
- [x] 6.2 Читать вывод скрипта и передавать Claude для анализа
- [x] 6.3 Формировать отчёт: "Analyzed: N capabilities", список противоречий, список пропущенных
- [x] 6.4 Зеркалить в `.claude/skills/sdd/contradiction.md`

## 7. Тест-стабы для __dev

- [x] 7.1 Стаб `change-with-sdd-yaml` — полная структура: `.sdd.yaml`, `test-plan.md` (покрывает `proposal-merge-deps`, `test-plan-link`)
- [x] 7.2 Стаб `change-missing-test-plan` — отсутствует `test-plan.md` (покрывает `test-plan-link`)
- [x] 7.3 Стаб `specs-with-index` — два capabilities с `index.yaml` и зависимостью между ними (покрывает `spec-index-yaml`, `contradiction-full-scan`)
- [x] 7.4 `cases/sdd/propose.md` — кейсы: полная структура, отсутствие `.sdd.yaml`, отсутствие ссылки в proposal (покрывает `design-formatter`, `proposal-merge-deps`)
- [x] 7.5 `cases/sdd/contradiction.md` — кейс: два связанных spec с противоречием, проверить что оба найдены (покрывает `contradiction-full-scan`)
- [x] 7.6 Зеркалить `skills/__dev/` в `.claude/skills/__dev/`

## 8. Bootstrap-соответствие (required for archiving)

- [x] 8.1 Создать `openspec/changes/sdd-layer-artifacts/.sdd.yaml` — поле `creates` с пятью capabilities: `test-plan-link`, `design-formatter`, `proposal-merge-deps`, `spec-index-yaml`, `contradiction-full-scan`
- [x] 8.2 Создать `openspec/changes/sdd-layer-artifacts/test-plan.md` — заполненный: YAML front matter (approach, acceptance_criteria) + `## Scenarios` по каждой из пяти capabilities
- [x] 8.3 Создать `openspec/specs/index.yaml` — пять записей для capabilities из `.sdd.yaml` (bootstrap первого индекса)
