# sdd-archive Specification

## Purpose
TBD - created by archiving change merge-verify-into-apply-archive. Update Purpose after archive.
## Requirements
### Requirement: Inline spec-verification

`/sdd:archive` SHALL выполнять L1/L2/L3 верификацию реализации против live `spec.md` после merge specs в `openspec/specs/`, до копирования `test-plan.md` и удаления `.sdd-state.yaml`. Отдельная команда `/sdd:spec-verify` MUST NOT существовать.

#### Scenario: Успешный archive с прохождением spec-verify

- **WHEN** пользователь вызывает `/sdd:archive <change-name>` и все Requirements из live spec'ов прошли L1+L2+L3
- **THEN** скилл архивирует change, прогоняет inline spec-verify, копирует `test-plan.md` в `openspec/specs/<cap>/`, обновляет `.sdd-state.yaml` со `stage: archived`, удаляет `.sdd-state.yaml`

#### Scenario: Spec-verify fail после merge specs

- **WHEN** specs уже merged в `openspec/specs/`, но verify обнаружил `missing` или `partial` Requirements
- **THEN** скилл обновляет `.sdd-state.yaml` со `stage: archive-failed`, выводит red-banner с двумя опциями (`git restore openspec/specs/` или новый change через `/sdd:propose`), MUST NOT удалять `.sdd-state.yaml`, MUST NOT пытаться автоматически откатить файлы

### Requirement: REMOVED-инверсия в spec-verify

При обработке блоков `## REMOVED Requirements` в live `spec.md` `/sdd:archive` SHALL применять инвертированную L1: артефакт MUST отсутствовать. L1 pass = файл НЕ существует; L1 fail = файл существует. L2/L3 для REMOVED блоков MUST помечаться как `N/A`.

#### Scenario: REMOVED Requirement и файл удалён

- **WHEN** spec содержит `## REMOVED Requirements` с упоминанием удалённого скилла, и файла на диске нет
- **THEN** verdict `done` для этого Requirement (L1 inverted pass)

#### Scenario: REMOVED Requirement, но файл остался

- **WHEN** spec содержит REMOVED-блок для скилла, но файл всё ещё существует
- **THEN** verdict `missing` (L1 inverted fail) с note «removal not performed»

### Requirement: Manual rollback с red-banner

При неудачном spec-verify внутри `/sdd:archive` (specs уже merged) скилл SHALL вывести выделенный red-banner:

```
🔴 SPECS MODIFIED — manual rollback required
🔴 Run: git restore openspec/specs/
🔴 OR: start a new change via /sdd:propose
```

Скилл MUST NOT выполнять автоматический rollback файлов. MUST NOT продолжать workflow после red-banner.

#### Scenario: Verify fail после merge

- **WHEN** verify обнаружил Requirement с verdict `missing` после merge specs в `openspec/specs/`
- **THEN** скилл выводит red-banner точно в указанном формате и останавливается; пользователь принимает решение вручную

### Requirement: Финальное удаление state-file

`/sdd:archive` SHALL удалять `.sdd-state.yaml` через `skills/sdd/scripts/state.py delete` **только** последним шагом успешного workflow — после merge specs, успешного spec-verify, и copy `test-plan.md`. MUST NOT удалять файл при любом промежуточном fail.

#### Scenario: Полный success

- **WHEN** все шаги archive прошли успешно
- **THEN** `.sdd-state.yaml` удаляется; директория change уезжает в `archive/`

#### Scenario: Fail на copy test-plan

- **WHEN** spec-verify прошёл, но copy `test-plan.md` упал (например, права доступа)
- **THEN** `.sdd-state.yaml` остаётся со `stage: archive-failed`, файл НЕ удаляется

### Requirement: Inline L1/L2/L3 verifier (KEEP IN SYNC with sdd-apply)

`/sdd:archive` SHALL содержать инлайн-описание трёх уровней проверки. MUST NOT вызывать отдельный sub-skill. Логика идентична `/sdd:apply`, отличается только источником списка проверяемых единиц (live `spec.md` vs `tasks.md`).

#### Scenario: L2 stub detection в spec-verify

- **WHEN** spec ссылается на скилл с пустой секцией Body
- **THEN** verdict `partial` с note «substantive content missing»

