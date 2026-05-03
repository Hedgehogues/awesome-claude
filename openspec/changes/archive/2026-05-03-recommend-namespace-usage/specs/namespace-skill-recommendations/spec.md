## ADDED Requirements

### Requirement: recommend-skills-rule-exists

Файл `.claude/rules/recommend-skills.md` SHALL существовать как глобальное правило без `paths:` frontmatter.

#### Scenario: rule file present

Файл `.claude/rules/recommend-skills.md` существует на диске и не начинается с `---` (нет frontmatter).

### Requirement: rule-instructs-skill-recommendation

Правило SHALL содержать инструкцию: при каждом запросе пользователя проверить, покрывает ли его скилл из публичных неймспейсов, и назвать конкретную команду до начала выполнения. Правило MUST включать один конкретный пример-шаблон фразы рекомендации.

#### Scenario: trigger instruction present

Файл `.claude/rules/recommend-skills.md` содержит секцию `## Правило` с инструкцией проверки и рекомендации скилла и один пример фразы вида `Для этой задачи подходит /sdd:propose — предлагаю запустить его.`

### Requirement: rule-references-manifest-as-ssot

Правило SHALL указывать `manifest.yaml` как единственный источник актуального списка неймспейсов.

#### Scenario: manifest reference present

Файл `.claude/rules/recommend-skills.md` содержит упоминание `manifest.yaml` как SSOT для списка неймспейсов.

### Requirement: rule-forbids-internal-namespaces

Правило SHALL явно запрещать рекомендовать внутренние/экспериментальные неймспейсы (например `opsx:`).

#### Scenario: forbidden namespaces section present

Файл `.claude/rules/recommend-skills.md` содержит секцию `## Не рекомендовать` с упоминанием `opsx:`.

### Requirement: rule-instructs-bump-version-on-outdated-release

Правило SHALL инструктировать Claude при обнаружении устаревшего релиза предлагать `namespace:bump-version`.

#### Scenario: bump-version detection instruction present

Файл `.claude/rules/recommend-skills.md` содержит секцию `## Обнаружение устаревшего релиза` с упоминанием bump-version скиллов.

### Requirement: manifest-namespaces-section-exists

Файл `manifest.yaml` SHALL содержать секцию `namespaces:` с перечислением публичных неймспейсов и флагом `public:`.

#### Scenario: namespaces section in manifest

`manifest.yaml` содержит ключ `namespaces:` верхнего уровня с хотя бы одной записью, имеющей поле `public: true`.
