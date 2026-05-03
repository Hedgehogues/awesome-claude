---
name: sdd:audit
display_positions: [8]
description: >
  Семантический аудит инвентаря: проверяет консистентность manifest.yaml,
  .gitmodules и состояния субмодулей. Вызывать перед коммитом изменений в
  инвентарь, после добавления или удаления реп, или при подозрении на
  расхождение между manifest и фактическим состоянием.
---

# sdd:audit — аудит инвентаря

## Вход

Нет параметров. Всегда аудирует текущее состояние репы целиком.

## Два уровня проверки

### Уровень 1: Структурный (всегда выполняется)

```bash
make validate
```

Проверяет:
- `manifest.yaml` → все 7 обязательных полей присутствуют и непусты
- SET(`manifest.yaml` paths) == SET(`.gitmodules` paths)
- Ветки совпадают в `manifest.yaml` и `.gitmodules` для каждого пути
- `gitops` отсутствует в `.gitmodules`
- Все change-директории в `openspec/changes/` имеют `.openspec.yaml` со `schema:` полем

### Уровень 1а: Целостность rules-реестра (всегда выполняется)

Читает `.claude/rules/index.md`, парсит YAML-блок с `rules:` и проверяет:

```bash
python3 -c "
import re, yaml, os, sys
txt = open('.claude/rules/index.md').read()
m = re.search(r'\`\`\`yaml\n(.*?)\`\`\`', txt, re.DOTALL)
if not m:
    print('FAIL: index.md has no YAML block'); sys.exit(1)
data = yaml.safe_load(m.group(1))
rules = data.get('rules', {})
missing = []
for r in rules.get('always', []) + rules.get('path_scoped', []):
    f = r['file']
    if not os.path.exists(f):
        missing.append(f)
if missing:
    print('FAIL: missing files:', missing); sys.exit(1)
total = len(rules.get('always',[])) + len(rules.get('path_scoped',[]))
print(f'rules-index OK — {total} rules registered')
"
```

Также проверяет, что все `.md` файлы в `.claude/rules/` (кроме `index.md`) перечислены в реестре:

```bash
python3 -c "
import re, yaml, glob
txt = open('.claude/rules/index.md').read()
m = re.search(r'\`\`\`yaml\n(.*?)\`\`\`', txt, re.DOTALL)
data = yaml.safe_load(m.group(1))
rules = data.get('rules', {})
registered = {r['file'] for r in rules.get('always',[]) + rules.get('path_scoped',[])}
on_disk = set(glob.glob('.claude/rules/**/*.md', recursive=True))
unregistered = on_disk - registered
if unregistered:
    print('WARN: unregistered rules:', sorted(unregistered))
else:
    print('all rules on disk are registered')
"
```

### Уровень 2: Семантический (выполняется отдельно)

Ручная проверка через чтение `manifest.yaml`:

1. **Доменное покрытие**: каждая запись имеет хотя бы один непустой домен в поле `domains`.
   Домены — свободные строки; неизвестных доменов нет. Предупреждение: домен, не встречавшийся
   ни в одной другой записи `manifest.yaml` (возможная опечатка).

2. **Cross-domain корректность**: если одна и та же URL встречается несколько раз —
   убедиться, что пути разные и домены разные (разные контексты использования)

3. **Ветки**: убедиться, что поле `branch` непустое для каждой записи (уже покрыто уровнем 1).
   Семантически — выявить аномалии: feature-ветки там, где ожидается стабильная ветка;
   расхождение в соглашениях внутри одного домена. Отклонения — предупреждение, не ошибка.

4. **Заглушки**: `description` или `rationale` содержат `TODO` → предупреждение

## Вывод

```
=== Уровень 1: Структурный ===
make validate: OK — N путей, M уникальных реп, .gitmodules в синке; K change-dir валидны

=== Уровень 2: Семантический ===
Домены: OK — все N записей имеют непустой домен
Cross-domain: <число> алиасов — OK
Ветки: WARN — <число> TODO в поле description (<path1>, <path2>)

Итог: структура OK, <число> предупреждений
```

## Fallback при ошибках

- **make validate завершился с ошибкой**: показать полный вывод ошибки и предложить `make check-manifest` для детальной диагностики
- **manifest.yaml не найден**: предложить запустить bootstrap-инструкцию из README
- **Критические расхождения**: показать конкретные строки с проблемой и команду для исправления
