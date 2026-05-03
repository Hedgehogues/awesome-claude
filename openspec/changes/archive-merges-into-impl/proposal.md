# Proposal: archive-merges-into-impl

See `.sdd.yaml` for capability declarations.

## Summary

Дореализация capability `archive-merges-into-support` из ченжа `sdd-merges-into-gaps`. Добавляет в `sdd:archive` skill.md поддержку `merges-into` в шагах 7 и 9, и команду `update-index-description` в `_sdd_yaml.py`.

## Why

При архивировании `sdd-merges-into-gaps` L1/L2/L3 показал verdict `gaps_found`: задачи были отмечены выполненными, но реализация в skill.md отсутствует. Без этого при архивировании любого ченжа с непустым `merges-into` spec-верификация будет пропускать эти capabilities.

## What Changes

### Modified Capabilities

- `archive-merges-into-support`: добавляет L1/L2/L3 верификацию для merges-into capabilities (шаг 7) и обновление index.yaml description (шаг 9)

### Files

| File | Change |
|---|---|
| `skills/sdd/archive/skill.md` | Шаг 7: добавить чтение merges-into + верификационный цикл. Шаг 9: добавить обновление index.yaml |
| `skills/sdd/scripts/_sdd_yaml.py` | Новая команда `update-index-description` |
| `.claude/skills/sdd/archive/skill.md` | Зеркало изменений из `skills/sdd/archive/skill.md` |
| `.claude/skills/sdd/scripts/_sdd_yaml.py` | Зеркало изменений из `skills/sdd/scripts/_sdd_yaml.py` |
