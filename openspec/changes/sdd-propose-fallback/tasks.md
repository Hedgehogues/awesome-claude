## 1. Шаблоны

- [ ] 1.1 Создать `skills/sdd/propose/templates/proposal.md.tmpl` с секциями Why / What Changes / Capabilities / Impact и плейсхолдерами `{{name}}`, `{{description}}`, TODO-маркерами
- [ ] 1.2 Создать `skills/sdd/propose/templates/design.md.tmpl` с 4 обязательными секциями (Context / Goals/Non-Goals / Decisions / Risks/Trade-offs) и TODO
- [ ] 1.3 Создать `skills/sdd/propose/templates/tasks.md.tmpl` с одной секцией `## 1. <area>` и `- [ ] 1.1 TODO`
- [ ] 1.4 Создать `skills/sdd/propose/templates/spec.md.tmpl` с `## ADDED Requirements` + один шаблон Requirement + Scenario

## 2. Preflight check

- [ ] 2.1 В `skills/sdd/propose/skill.md` добавить шаг 0 (перед текущим шагом 1) — preflight: попытка вызвать `openspec-propose` через Skill tool с обработкой `Unknown skill`
- [ ] 2.2 Если preflight удачен — продолжать по существующему workflow (шаг 1 → openspec-propose)
- [ ] 2.3 Если preflight упал — переключиться на fallback (шаг 1' — встроенная генерация)

## 3. Fallback-генерация

- [ ] 3.1 В `skills/sdd/propose/skill.md` добавить шаг 1' — fallback-путь: создать директорию `openspec/changes/<name>/`, прочитать шаблоны из `templates/`, подставить `{{name}}` и `{{description}}`, записать файлы
- [ ] 3.2 После fallback-генерации продолжить с шага 3 (identity check) — оставшийся workflow одинаков для обоих путей
- [ ] 3.3 Создать placeholder capability `<name>-placeholder` в `specs/` для прохождения spec-проверок (автор переименует и заполнит)

## 4. Diagnostic-вывод

- [ ] 4.1 При входе в fallback-путь — вывести WARN-блок с указанием источника шаблонов и списком созданных файлов
- [ ] 4.2 Финальное сообщение: «Fill TODO sections before /sdd:contradiction»

## 5. Тесты

- [ ] 5.1 Создать стаб `skills/skill/test-skill/stubs/no-openspec-plugin.md` — окружение без зарегистрированного `openspec-propose` (имитация через моk Skill tool возвращающий Unknown skill)
- [ ] 5.2 Расширить `skills/sdd/propose/cases/propose.md` кейсом `propose-without-openspec` (стаб `no-openspec-plugin`); contains: `openspec-propose unavailable`, файлы proposal.md/design.md/tasks.md/spec.md созданы; semantic: WARN-блок присутствует в выводе
- [ ] 5.3 Расширить `cases/propose.md` кейсом `propose-with-openspec` (нормальный путь, openspec-propose доступен); contains: стандартные артефакты openspec-формата
- [ ] 5.4 Расширить `cases/propose.md` кейсом `templates-have-required-placeholders`: semantic — каждый `.tmpl` содержит `{{name}}` и `{{description}}`
- [ ] 5.5 Расширить `cases/propose.md` кейсом `fallback-design-passes-check`: после fallback-генерации `check-design.py` возвращает OK на сгенерированной `design.md`

## 6. Документация

- [ ] 6.1 В `skills/sdd/propose/skill.md` обновить description в frontmatter: упомянуть fallback-режим
- [ ] 6.2 В `README.md` или `CLAUDE.md` (если есть упоминание sdd:propose) — добавить заметку про fallback и условия его срабатывания
