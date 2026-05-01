## ADDED Requirements

### Requirement: Inline tasks-verification

`/sdd:apply` SHALL выполнять L1/L2/L3 верификацию реализации против `tasks.md` как обязательный шаг после фазы реализации, до обновления `openspec/specs/index.yaml`. Отдельная команда `/sdd:change-verify` MUST NOT существовать.

#### Scenario: Успешный apply с прохождением verify

- **WHEN** пользователь вызывает `/sdd:apply <change-name>` и все задачи в `tasks.md` имеют корректные артефакты (L1+L2+L3 pass)
- **THEN** скилл реализует задачи, прогоняет inline-verify, выводит отчёт `verdict: passed`, обновляет `openspec/specs/index.yaml` для capabilities из `creates:` в `.sdd.yaml`

#### Scenario: Verify обнаружил недостающий артефакт

- **WHEN** после реализации хотя бы одна задача из `tasks.md` имеет статус `missing` или `partial`
- **THEN** скилл выводит отчёт с секцией `--- Gaps ---`, обновляет `.sdd-state.yaml` со `stage: verify-failed`, MUST NOT обновлять `openspec/specs/index.yaml`, останавливается с инструкцией пофиксить и перезапустить `/sdd:apply`

### Requirement: State-update на каждом подшаге

`/sdd:apply` SHALL обновлять `.sdd-state.yaml` через `skills/sdd/scripts/state.py` на каждом из подшагов: `applying` → `verifying` → `verify-ok` (или `verify-failed`).

#### Scenario: Resume после обрыва на verify

- **WHEN** сессия прервалась во время `verifying` и пользователь запускает `/sdd:apply <change-name>` снова
- **THEN** скилл читает `.sdd-state.yaml`, видит `stage: verifying`, продолжает с шага verify (не повторяет реализацию)

### Requirement: Identity-check перед apply

`/sdd:apply` SHALL вызвать `skills/sdd/scripts/identity.py` для получения текущего email и сравнить с `owner:` из `.sdd.yaml`. При несовпадении — вывести warning и запросить подтверждение.

#### Scenario: Своя change

- **WHEN** `email == owner` в `.sdd.yaml`
- **THEN** скилл продолжает без warning'а

#### Scenario: Чужая change

- **WHEN** `email != owner` в `.sdd.yaml`
- **THEN** скилл выводит warning «это change `<owner>`, перезаписать на тебя?» и продолжает только после явного согласия пользователя; при согласии перезаписывает `owner:` на текущий email

### Requirement: Inline L1/L2/L3 verifier (KEEP IN SYNC with sdd-archive)

`/sdd:apply` SHALL содержать инлайн-описание трёх уровней проверки: L1 (existence), L2 (substantive content, stub detection), L3 (wiring heuristics). MUST NOT вызывать отдельный sub-skill для верификации.

#### Scenario: Stub detection в L2

- **WHEN** task ссылается на файл, который существует но содержит только `<!-- TODO -->` или пустую секцию
- **THEN** скилл присваивает task verdict `partial` (L1 pass, L2 fail), L3 запускается всё равно

#### Scenario: Wiring detection в L3

- **WHEN** task создаёт скилл `.claude/skills/sdd/foo.md`, файл существует и содержательный
- **THEN** скилл проверяет наличие упоминания в `CLAUDE.md` и `README.md`; при отсутствии — verdict `partial` с note «not wired»

## REMOVED Requirements

### Requirement: Standalone change-verify command

**Reason:** Verify-логика инлайнится в `/sdd:apply` как обязательный шаг — отдельная команда становится избыточной и нарушает принцип «один пользовательский вызов = один логический шаг».

**Migration:** Перестать вызывать `/sdd:change-verify` напрямую — verify запускается автоматически в `/sdd:apply`. Если нужна отдельная верификация без полного apply — заводи новый change через `/sdd:propose` и используй обычный workflow.
