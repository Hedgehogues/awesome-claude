# Proposal: sdd declared deps — контекст зависимостей в contradiction и apply

## Why

Оба ключевых скилла — `sdd:contradiction` и `sdd:apply` — игнорируют задекларированные зависимости ченджа из `.sdd.yaml` (`creates` и `merges-into`).

**В `sdd:contradiction`:**

1. **`merges-into` не валидируется.** Capabilities из поля `merges-into` в `.sdd.yaml` (список существующих capabilities, которые change модифицирует) пассивно попадают в full scan, если есть в index.yaml — и тихо пропускаются, если отсутствуют. Нет явной проверки: «эта capability из merges-into есть в индексе? её spec.md загружается?»

2. **`creates`/`merges-into` не отделены от background.** Все capabilities в пакете, который видит Claude, равнозначны. Нет сигнала: «вот capabilities этого change — проверь их в первую очередь», «вот всё остальное — background context».

3. **Нет index awareness.** Индекс растёт по мере архивации других ченджей. Когда change написан и потом прогоняется contradiction — в index.yaml могут появиться новые capabilities, тематически смежные с change, которые автор не учёл при написании `creates`/`merges-into`. Contradiction сейчас это не детектирует.

**В `sdd:apply`:**

4. **`merges-into` не используется при реализации.** `sdd:apply` читает только `creates` (чтобы добавить записи в `index.yaml`). Поле `merges-into` полностью игнорируется: спеки существующих capabilities, которые change модифицирует, не загружаются и не используются как контекст при реализации задач. Реализация может незаметно нарушить контракты уже задокументированных capabilities.

Итог: оба скилла работают вслепую относительно того, что change явно декларирует в `.sdd.yaml`.

## What Changes

- `contradiction.py`: добавить явную валидацию `merges-into` — для каждой capability проверить наличие в index.yaml; если нет — добавить в warnings с пометкой `merges-into: not in index`; если есть — загружать с меткой `[PRIMARY/merges-into]`
- `contradiction.py`: пометить `creates`-capabilities как `[PRIMARY/creates]` (draft — уже делает, live — нет)
- `contradiction.py`: добавить third pass — index awareness scan: для capabilities из index.yaml, не входящих в `creates` ∪ `merges-into`, проверить тематическое пересечение с именами и текстом `creates`/`merges-into` capabilities; surface как `[ADJACENT]` с коротким обоснованием
- `skill.md` contradiction (cross-spec preamble): обновить описание вывода — добавить секции `PRIMARY capabilities`, `ADJACENT capabilities`, обновить Summary-поля
- `skill.md` apply (шаг 3): после чтения `test-plan.md` добавить шаг загрузки спек `merges-into` capabilities из `index.yaml`; использовать как read-only контекст при реализации задач
- Живая спека `contradiction-full-scan`: обновить Requirement'ы для отражения новых меток и валидации

## Capabilities

### New Capabilities

- `contradiction-deps-validation`: явная валидация `creates`/`merges-into` из `.sdd.yaml` — проверка наличия в index.yaml, маркировка `[PRIMARY]` в пакете анализа; warning при missing
- `contradiction-index-awareness`: index awareness scan — обнаружение capabilities в index.yaml, тематически смежных с change, но незадекларированных; вывод как `[ADJACENT]` с обоснованием
- `apply-merges-into-context`: `sdd:apply` загружает спеки capabilities из `merges-into` как read-only контекст перед реализацией задач

### Modified Capabilities

- `contradiction-full-scan`: расширение — добавляет PRIMARY/ADJACENT маркировку и merges-into validation

See `.sdd.yaml` for capability declarations.
