## 1. Code change

- [ ] 1.1 В `skills/sdd/scripts/state.py` обновить `ALLOWED_TRANSITIONS`:
  - `"contradiction-ok": {"applying", "contradiction-failed", "proposed"}` (+proposed)
  - `"verify-ok": {"archiving", "verifying", "applying"}` (+verifying, +applying)
  - `"archive-failed": {"archiving", "archived", "verify-ok"}` (+verify-ok)
- [ ] 1.2 Smoke-тест: прогнать вручную 4 новых перехода через `state.py transition`, убедиться что не отвергается.

## 2. Documentation

- [ ] 2.1 Обновить `CHANGELOG.md` — patch release 0.7.1: «sdd-state: allow revisit transitions».
- [ ] 2.2 (опционально) Добавить в `docs/SKILL_DESIGN.md` диаграмму state-машины с новыми рёбрами.

## 3. Bump version

- [ ] 3.1 Bump `skills/sdd/.manifest` 0.7.0 → 0.7.1 (patch — backward-compat).

## 4. Integration check

- [ ] 4.1 Прогнать на нашем текущем merge-verify-into-apply-archive change: state в `verify-ok` → `verify-ok → verifying` должен работать. Подтверждает использование на реальном кейсе.
