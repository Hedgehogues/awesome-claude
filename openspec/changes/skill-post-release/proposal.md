## Why

После того как `skill:release` завершён и PR смёрджен, контрибьютор вручную создаёт следующую release-ветку и обновляет версию в `manifest.yaml`. Этот шаг не стандартизирован и легко пропустить.

## What Changes

- Новый скилл `skill:post-release`:
  - Читает текущую версию из `manifest.yaml`
  - Спрашивает тип следующего бампа (major / minor / patch)
  - Вычисляет новую версию
  - Создаёт ветку `release-<new-version>`
  - Обновляет `manifest.yaml` до новой версии
  - Делает commit
- Не пушит в remote — контрибьютор делает явно

## Capabilities

### New Capabilities

- `post-release-transition`: скилл перехода к следующему dev-циклу — создаёт release-ветку и обновляет версию в manifest.yaml.

### Modified Capabilities

<!-- Нет изменений в существующих спеках -->

## Impact

- Новый файл: `skills/skill/post-release/skill.md`
- Новые тест-кейсы: `skills/skill/cases/skill/post-release.md`

See `.sdd.yaml` for capability declarations.
