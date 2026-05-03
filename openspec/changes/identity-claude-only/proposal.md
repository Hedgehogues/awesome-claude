## Why

`identity.py` резолвит email через `claude auth` и падает обратно на `git config user.email`. Проблема: глобальный git-конфиг хранит email автора репозитория (`hedgehogues@bk.ru`), а не реального пользователя. В результате owner в `.sdd.yaml` проставляется чужой — без предупреждений, молча. Claude auth — единственный надёжный источник identity в контексте Claude Code: он привязан к аккаунту пользователя, а не к машине.

## What Changes

- `identity.py`: убрать ветку `from_git()` из функции `resolve()`; если `claude auth` не вернул email — сразу exit ≠ 0 с сообщением «выполните `claude auth login`»
- Функция `from_git()` и соответствующий `--source`-тег `git` больше не используются (можно удалить или оставить как dead code, но из `resolve()` убрать)
- Сценарий «Не залогинен, есть git» в spec `sdd-ownership` заменяется сценарием «Не залогинен — ошибка»

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

- `sdd-ownership`: требование «Identity-resolver primary source» теряет git-fallback; сценарий «Не залогинен, есть git» заменяется на «Не залогинен — exit с ошибкой»

## Impact

- `skills/sdd/scripts/identity.py` — удалить git-ветку из `resolve()`
- `openspec/specs/sdd-ownership/spec.md` — обновить требование и сценарии
- `openspec/specs/index.yaml` — обновить description capability `sdd-ownership`

See `.sdd.yaml` for capability declarations.
