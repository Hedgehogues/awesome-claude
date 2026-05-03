## Context

см. `proposal.md` → ## Why.

`proposal.md` лишён двух структурных секций, которые обеспечивают самодостаточность ченджа как артефакта: `## Summary` (быстрый ответ на «что это») и `## Verification` (быстрый ответ на «как проверить»). Оба вопроса задаются при каждом новом диалоге и не должны требовать переобъяснения.

## Goals / Non-Goals

**Goals:**
- Добавить в `design-formatter` spec два новых требования к `proposal.md`
- Создать `check-proposal.py` для валидации наличия секций
- Обновить `sdd:propose` skill.md: вызвать `check-proposal.py` после генерации `proposal.md`
- Обновить `docs/SKILL_DESIGN.md`

**Non-Goals:**
- Не ретрофитить существующие `proposal.md` в активных ченджах
- Не изменять структуру `design.md` (валидируется `check-design.py`)
- Не менять формат `test-plan.md`

## Decisions

### D1: Две отдельные секции, не одна

`## Summary` и `## Verification` — разные по назначению и аудитории:
- `## Summary`: контекст для читателя, 1–2 предложения без технины
- `## Verification`: критерии готовности, ожидаемое поведение с точки зрения пользователя

Объединять нельзя — разные time-of-use (Summary читают при входе в диалог, Verification — при закрытии ченджа).

### D2: check-proposal.py — отдельный скрипт

Не расширять `check-design.py`, создать `check-proposal.py` рядом в `skills/sdd/propose/scripts/`. Причина: один скрипт — одна ответственность; `check-design.py` валидирует `design.md`.

### D3: Вызов из sdd:propose, не из sdd:apply или sdd:contradiction

`check-proposal.py` запускается только при создании ченджа (`sdd:propose`). Это защищает существующие ченджи от ретроактивной поломки.

### D4: Содержимое `## Verification` — ожидаемое поведение, не команды

`## Verification` SHALL описывать что должно быть истинным, не как запустить команду:
- ✓ «sdd:propose блокирует создание ченджа без ## Summary»
- ✗ `grep "## Summary" proposal.md`

Технические команды и shell-сценарии — в `test-plan.md`.

## Risks / Trade-offs

[check-proposal.py не запускается для существующих ченджей] → авторы активных ченджей не увидят нарушений. Это принято: ретрофит нарушил бы существующие workflows и не добавляет ценности.
