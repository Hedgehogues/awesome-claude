---
generate_cases: false  # compromise flag — apply шаг 10 (test-plan-to-cases.py) пропускает генерацию для этого change'а; снимается change'ем `unified-test-flow` после починки скрипта
approach: |
  После apply прогнать skill:test-skill для каждого нового скилла (skill:setup, skill:deps,
  skill:onboarding, skill:release) — должны проходить 4 категории кейсов. Прогнать
  skill:test-all для проверки покрытия всех скиллов sdd-namespace. В fresh-clone проверить
  bootstrap-сценарий dev mode: Клод читает skills/skill/setup/skill.md напрямую, создаёт
  симлинки, повторный запуск через .claude/ работает. Проверить что после удаления
  scripts/install.sh README не содержит curl|bash и Quick Start описывает user mode flow.
acceptance_criteria:
  - "skill:test-skill skill:setup PASSED ≥4/5 для всех 4 категорий (positive-happy, positive-corner, negative-missing-input, negative-invalid-input)"
  - "skill:test-skill skill:deps PASSED ≥4/5 для всех 4 категорий"
  - "skill:test-skill skill:onboarding PASSED ≥4/5 для всех 4 категорий"
  - "skill:test-skill skill:release PASSED ≥4/5 для всех 4 категорий"
  - "skill:test-all sdd: показывает наличие cases для всех 10 sdd-скиллов (apply, archive, audit, bump-version, contradiction, explore, help, propose, repo, sync)"
  - "После skill:setup в свежей репе .claude/skills, .claude/commands, .claude/rules — симлинки на $(pwd)/<dir>"
  - "Повторный skill:setup в той же репе выводит 'Already linked' и завершается без изменений"
  - "Bootstrap: в свежей repo Клод читает skills/skill/setup/skill.md напрямую и создаёт симлинки без зависимости от .claude/"
  - "manifest.yaml в корне содержит ровно три top-level ключа: version, tools, repos; skill:deps падает при отсутствии любого"
  - "skill:deps дважды подряд не меняет manifest.yaml (read-only гарантия)"
  - "scripts/install.sh отсутствует; README не содержит 'curl' и 'bash install.sh'; раздел ## Init присутствует"
  - "test-results/YYYY-MM-DD-HHMMSS.md создаётся в начале skill:test-skill и содержит per-case appended результаты"
---

## Scenarios

### Bootstrap dev mode в свежей repo
GIVEN свежеклонированная awesome-claude репа без `.claude/skills`
WHEN Клод читает README → раздел `## Init` → распознаёт dev mode → читает `skills/skill/setup/skill.md` напрямую
THEN симлинки `.claude/skills` → `$(pwd)/skills`, `.claude/commands` → `$(pwd)/commands`, `.claude/rules` → `$(pwd)/rules` созданы
AND повторный вызов `skill:setup` через `.claude/` выводит "Already linked" и exit 0

### skill:setup на существующей реальной директории
GIVEN `.claude/skills/` существует как обычная директория (не симлинк)
WHEN вызван `skill:setup`
THEN скилл выводит warning со списком замещаемого
AND запрашивает подтверждение перед заменой
AND без подтверждения не модифицирует диск

### skill:deps валидирует схему manifest.yaml
GIVEN `manifest.yaml` без ключа `tools` (или `version`/`repos`)
WHEN вызван `skill:deps`
THEN скилл выводит "manifest.yaml missing required key: <key>"
AND завершается с non-zero exit
AND не выполняет установку инструментов

### skill:deps read-only по manifest.yaml
GIVEN `manifest.yaml` с валидной схемой
WHEN вызван `skill:deps` дважды подряд
THEN содержимое `manifest.yaml` идентично до и после каждого вызова
AND изменения, если нужны, делаются только через ручное редактирование или `sdd:repo`

### Eval-framework: bootstrap k=5 с порогом ≥4/5
GIVEN test-spec с одним Case
WHEN `skill:test-skill` запускает кейс
THEN кейс прогоняется 5 раз
AND при 4-5 успешных результатах кейс получает PASS
AND при ≤3 успешных результатах кейс получает ⚠ WARN
AND результат каждого прогона appended в `test-results/<timestamp>.md` immediately

### User mode setup без curl|bash
GIVEN директория без `.claude/`
WHEN пользователь просит Клода установить awesome-claude
THEN Клод выполняет git clone в temp директорию + cp выбранных namespace в `.claude/` + удаление temp
AND нигде не используется `curl ... | bash`
AND `scripts/install.sh` отсутствует в репозитории

### Namespace rename: __dev → skill (apply step)
GIVEN репа с директориями `skills/__dev/` и `commands/__dev/`
WHEN выполнены задачи 0.1–0.5
THEN `skills/skill/` и `commands/skill/` существуют
AND `skills/__dev/` и `commands/__dev/` отсутствуют
AND все frontmatter `name: __dev:<x>` заменены на `name: skill:<x>`
AND `grep -r '__dev:' skills/ commands/` ничего не находит
