## 1. Файловая система

- [ ] 1.1 Переименовать `test-results/` → `.test-results/` через `git mv`
- [ ] 1.2 Удалить `.test-results/.gitkeep`
- [ ] 1.3 Добавить `.test-results` в `.gitignore`

## 2. Скилл

- [ ] 2.1 Обновить `skills/skill/test-skill/skill.md`: заменить `test-results` → `.test-results` (строки `mkdir -p` и `RESULTS_FILE=`)

## 3. OpenSpec specs

- [ ] 3.1 Обновить `openspec/specs/index.yaml`: описание capability `skill-eval-framework` (упоминание пути)
- [ ] 3.2 Обновить `openspec/changes/install-modes/specs/skill-eval-framework/spec.md`: `test-results/` → `.test-results/`
- [ ] 3.3 Обновить `openspec/changes/unified-test-flow/specs/skill-eval-framework/spec.md`: `test-results/` → `.test-results/`

## 4. Документы pending changes

- [ ] 4.1 Обновить `openspec/changes/install-modes/design.md`
- [ ] 4.2 Обновить `openspec/changes/install-modes/tasks.md`
- [ ] 4.3 Обновить `openspec/changes/install-modes/test-plan.md`
- [ ] 4.4 Обновить `openspec/changes/install-modes/proposal.md`
- [ ] 4.5 Обновить `openspec/changes/unified-test-flow/design.md`
- [ ] 4.6 Обновить `openspec/changes/unified-test-flow/tasks.md`
- [ ] 4.7 Обновить `openspec/changes/unified-test-flow/test-plan.md`

## 5. Финальная проверка

- [ ] 5.1 `grep -r "test-results" .` возвращает только CHANGELOG и этот change
