## Context

Релизный цикл управляется `skill:release`: валидация working tree, бамп `manifest.yaml`, commit, git tag. После этого контрибьютор вручную создаёт следующую release-ветку и коммитит новую версию. Этот шаг не стандартизирован.

Скилл работает только внутри awesome-claude репо. Не применим к пользовательским проектам.

## Goals / Non-Goals

**Goals:**
- Стандартизировать переход к следующему dev-циклу одной командой `/skill:post-release`
- Следовать тому же UX-паттерну, что и `skill:release` (AskUserQuestion для выбора типа бампа)
- Создать ветку с именем `release-<new-version>` и зафиксировать версию в `manifest.yaml`

**Non-Goals:**
- Пуш в remote — контрибьютор делает явно
- Изменение логики `skill:release`
- Поддержка pre-release меток (alpha, rc)

## Decisions

**1. Отдельный скилл, не расширение `skill:release`**
`skill:release` вызывается в момент релиза. `skill:post-release` — после мёрджа PR. Разделение уважает single responsibility.

**2. Версия читается из `manifest.yaml`, не из git tag**
`manifest.yaml` — источник правды для текущего состояния репо.

**3. Имя ветки — конвенция `release-<new-version>`**
Существующий паттерн в репо. Скилл его закрепляет.

**4. Claude выполняет скилл напрямую без отдельного скрипта**
Git-команды и правка `manifest.yaml` через inline python3 — как в `skill:release`. Отдельный скрипт не нужен.

## Risks / Trade-offs

- [Risk] `manifest.yaml` уже содержит версию, опережающую последний tag → Mitigation: скилл показывает текущую версию и спрашивает подтверждение перед созданием ветки.
- [Risk] Working tree не чистый → Mitigation: pre-check как в `skill:release`, выход с ошибкой.
