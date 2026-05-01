## 1. Документация структуры

- [ ] 1.1 Переписать `docs/REPO_ORGANIZATION.md` под namespace-first структуру: схема директорий, маппинг при установке, критерий `shared/` vs дублирование
- [ ] 1.2 Описать миграционный путь от artifact-first к namespace-first в `docs/REPO_ORGANIZATION.md`

## 2. Реструктуризация репозитория

- [ ] 2.1 Создать новую структуру директорий: `dev/`, `sdd/`, `research/`, `report/`, `__dev/`, `shared/`
- [ ] 2.2 Перенести `skills/dev/` → `dev/skills/` через `git mv` (и зеркально для всех namespace-ов)
- [ ] 2.3 Перенести `commands/dev/` → `dev/commands/` через `git mv` (и зеркально для всех namespace-ов)
- [ ] 2.4 Распределить содержимое корневого `rules/` по namespace-папкам или в `shared/rules/` согласно критерию из 1.1
- [ ] 2.5 Распределить содержимое корневого `docs/` по namespace-папкам или в `shared/docs/` согласно критерию из 1.1
- [ ] 2.6 Удалить пустые корневые директории `skills/`, `commands/`, `rules/`, `docs/`

## 3. Обновление install.sh

- [ ] 3.1 Обновить `install_namespace` в `scripts/install.sh`: копировать `<ns>/skills/`, `<ns>/commands/`, `<ns>/rules/`, `<ns>/docs/` в соответствующие пути `.claude/`
- [ ] 3.2 Добавить автоустановку `shared/` при установке любого namespace: копировать `shared/rules/` → `.claude/rules/shared/`, `shared/docs/` → `.claude/docs/shared/`
- [ ] 3.3 Идемпотентность: перед копированием очищать целевые директории `<ns>/` под `.claude/skills/`, `.claude/commands/`, `.claude/rules/`, `.claude/docs/`
- [ ] 3.4 Обновить `usage()` в install.sh — больше не нужен компонент `rules` отдельно (он теперь часть namespace-ов и shared)

## 4. Обновление bump-namespace.sh

- [ ] 4.1 Обновить `scripts/bump-namespace.sh` под новые пути источника (`<ns>/skills/` вместо `skills/<ns>/`)
- [ ] 4.2 Проверить что bump корректно обновляет `rules/` и `docs/` namespace-а

## 5. Зеркалирование .claude/

- [ ] 5.1 Перегенерировать `.claude/` локально через обновлённый `install.sh` для всех namespace-ов
- [ ] 5.2 Проверить что Claude Code продолжает находить скиллы и команды по старым путям `.claude/skills/<ns>/` и `.claude/commands/<ns>/`

## 6. Тестирование самоописываемости

- [ ] 6.1 Создать тест-кейс: запустить Claude в чистой директории, дать клон репозитория и попросить установить `dev` без обращения к install.sh
- [ ] 6.2 Убедиться что Claude корректно выводит маппинг из структуры и устанавливает namespace
- [ ] 6.3 Документировать сценарий в `docs/REPO_ORGANIZATION.md` как иллюстрацию самоописываемости

## 7. Связь с skill-auto-deps

- [ ] 7.1 В `docs/SKILL_DESIGN.md` сослаться на namespace-first структуру при описании механики `requires:` и автоустановки зависимостей
