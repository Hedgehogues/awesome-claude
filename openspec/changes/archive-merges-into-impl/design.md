## Context

Ченж `sdd-merges-into-gaps` (архивирован 2026-05-03) задекларировал capability `archive-merges-into-support` — поддержку поля `merges-into` в `sdd:archive`. Задачи в `tasks.md` были отмечены как выполненные, однако при архивировании L1/L2/L3 верификация выявила gaps: ни шаг 7 (`skills/sdd/archive/skill.md`), ни шаг 9 не содержат соответствующей логики.

Spec-файл `openspec/specs/archive-merges-into-support/spec.md` существует на диске (создан при архивировании), но не зарегистрирован в `index.yaml`. Команда `update-index-description` в `_sdd_yaml.py` отсутствует.

## Goals / Non-Goals

**Goals:**
- Добавить в шаг 7 `skill.md` чтение `.sdd.yaml.merges-into` и L1/L2/L3 цикл для этих capabilities — симметрично обработке `creates`
- Добавить в шаг 9 `skill.md` обновление `description` в `openspec/specs/index.yaml` для merges-into capabilities при verify-ok
- Добавить команду `update-index-description <index-yaml> <cap> <description>` в `_sdd_yaml.py`
- Синхронизировать изменения в `.claude/skills/sdd/archive/skill.md` и `.claude/skills/sdd/scripts/_sdd_yaml.py`

**Non-Goals:**
- Менять логику шагов 1–6 и 8 `skill.md`
- Добавлять тесты для `_sdd_yaml.py`
- Рефакторить существующий L1/L2/L3 цикл для `creates`

## Decisions

- Команда `update-index-description` принимает путь к `index.yaml` явно (не хардкодит путь внутри) — это делает её переиспользуемой и тестируемой
- L1/L2/L3 для `merges-into` capabilities запускается в той же секции шага 7, что и для `creates` — никакого отдельного блока
- Обновление `index.yaml` в шаге 9 происходит только при verify-ok (verdict = `passed`) и только для capabilities из `merges-into`
- `.claude/` — зеркальные копии; синхронизируются вручную в рамках тех же задач

## Risks / Trade-offs

- Если `proposal.md` не содержит `### Modified Capabilities` или нужной строки — description не обновляется; это допустимо (поле `description` остаётся прежним)
- Два экземпляра одного файла (`skills/` и `.claude/skills/`) — риск расхождения при будущих правках; решается симлинками, но вне scope этого ченжа
