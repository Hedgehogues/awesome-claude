## 1. .manifest — поле namespaces

- [x] 1.1 Добавить поле `namespaces:` в `.manifest` неймспейса `dev`
- [x] 1.2 Добавить поле `namespaces:` в `.manifest` неймспейса `sdd`
- [x] 1.3 Добавить поле `namespaces:` в `.manifest` неймспейса `report`
- [x] 1.4 Добавить поле `namespaces:` в `.manifest` неймспейса `research`
- [x] 1.5 Добавить поле `namespaces:` в `.manifest` неймспейса `skill`

## 2. bump-namespace.sh — чтение namespaces из .manifest

- [x] 2.1 Заменить жёстко заданные пути копирования на чтение `namespaces:` из `.manifest`
- [x] 2.2 Добавить проверку: если `namespaces:` отсутствует — выход с ошибкой

## 3. bump-namespace.sh — поддержка --ref

- [x] 3.1 Добавить парсинг флага `--ref <value>` в начало скрипта
- [x] 3.2 При `--ref`: клонировать по указанному ref вместо последнего тега
- [x] 3.3 При `--ref`: печатать WARNING что ref нестабилен (если не тег)
- [x] 3.4 При `--ref`: пропускать автообновление зависимостей

## 4. bump-namespace.sh — формат .versions

- [x] 4.1 При записи в `.versions` всегда резолвить SHA через `git rev-parse`
- [x] 4.2 Писать в формате `type:label@sha` (или `sha:<sha>` для прямого SHA)
- [x] 4.3 Изменить проверку «уже установлен»: сравнивать только SHA (часть после `@`)

## 5. claude-entry-point — CLAUDE.md и index.md

- [x] 5.1 При первой установке любого неймспейса: добавить секцию `## awesome-claude` в `CLAUDE.md` если её нет
- [x] 5.2 Создать или обновить `.claude/awesome-claude/index.md` после каждой установки неймспейса
- [x] 5.3 В `index.md` перечислять только установленные неймспейсы с путями

## 6. Тест-кейсы

- [x] 6.1 Добавить тест-кейсы для `bump-ref-support` в `skills/skill/cases/skill/bump-version.md`
- [x] 6.2 Добавить тест-кейсы для `bump-full-namespace` в `skills/skill/cases/skill/bump-version.md`
- [x] 6.3 Добавить тест-кейсы для `claude-entry-point` в `skills/skill/cases/skill/bump-version.md`
- [x] 6.4 Обновить тест-кейсы для `bump-namespace` (.versions формат)
