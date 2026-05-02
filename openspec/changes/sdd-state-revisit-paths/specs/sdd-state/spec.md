## MODIFIED Requirements

### Requirement: Stage transition rules

State-machine transitions SHALL следовать правилам:

- `unknown` → любая стадия (для at-first-touch backward-compat)
- `proposed` → `contradiction-ok` | `contradiction-failed`
- `contradiction-ok` → `applying` | `contradiction-failed` | **`proposed`** (re-edit proposal/design after contradiction passed)
- `contradiction-failed` → `proposed` (после правок) или `contradiction-ok` (после повторного контроля)
- `applying` → `verifying` | `verify-failed`
- `verifying` → `verify-ok` | `verify-failed`
- `verify-ok` → `archiving` | **`verifying`** (re-verify after fix without re-implement) | **`applying`** (re-implement after code drift)
- `verify-failed` → `applying` (после правок) | `verifying`
- `archiving` → `archived` | `archive-failed`
- `archived` → терминальное состояние, переходов нет; state-file удаляется
- `archive-failed` → `archiving` | `archived` | **`verify-ok`** (after external issue resolved without re-verify)

`state.py transition` MUST отвергать переходы вне whitelist'а.

**Use-cases для новых рёбер (выделены жирным):**

1. `contradiction-ok → proposed` — после прохождения contradiction обнаружили необходимость нового Decision в design.md или нового пункта в proposal.md; возвращаемся к правкам без перезапуска contradiction в стадии failed.
2. `verify-ok → verifying` — после verify-ok обнаружили мелкий drift (правка файла после verify); хотим перепроверить без полного re-apply.
3. `verify-ok → applying` — после verify-ok обнаружили что нужна доработка реализации; возвращаемся в applying для re-implement.
4. `archive-failed → verify-ok` — archive упал из-за внешней причины (git conflict, FS error), не из-за verify; возвращаемся в pre-archive стадию для повторного archive без re-verify.

#### Scenario: contradiction-ok → proposed re-edit

- **WHEN** state в `contradiction-ok`, пользователь вызывает `state.py transition <path> proposed`
- **THEN** transition разрешён; state.stage = proposed

#### Scenario: verify-ok → verifying re-verify

- **WHEN** state в `verify-ok`, пользователь вызывает `state.py transition <path> verifying`
- **THEN** transition разрешён; state.stage = verifying

#### Scenario: verify-ok → applying re-implement

- **WHEN** state в `verify-ok`, пользователь вызывает `state.py transition <path> applying`
- **THEN** transition разрешён; state.stage = applying

#### Scenario: archive-failed → verify-ok external resolve

- **WHEN** state в `archive-failed`, пользователь разрешил внешнюю проблему и вызывает `state.py transition <path> verify-ok`
- **THEN** transition разрешён; state.stage = verify-ok; пользователь может re-run /sdd:archive

#### Scenario: archived остаётся terminal

- **WHEN** state в `archived`, пользователь пытается transition в любую другую стадию
- **THEN** transition отвергается с `not allowed`; archived — финал
