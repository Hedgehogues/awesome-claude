## 1. Скрипт identity.py

- [ ] 1.1 Убрать вызов `from_git()` из функции `resolve()` в `skills/sdd/scripts/identity.py`
- [ ] 1.2 Обновить ветку «нет email» в `resolve()`: вернуть `(None, None)` без git-fallback
- [ ] 1.3 Обновить сообщение об ошибке в `main()`: убрать упоминание `git config`; оставить только «выполните `claude auth login`»
- [ ] 1.4 Убрать тег `"git"` из возможных значений `source` (вывод `--source`)

## 2. Спека sdd-ownership

- [ ] 2.1 Обновить `openspec/specs/sdd-ownership/spec.md`: заменить требование «Identity-resolver primary source» по delta из этого change'а
- [ ] 2.2 Обновить `openspec/specs/index.yaml`: description capability `sdd-ownership` — убрать упоминание git-fallback

## 3. Финальная проверка

- [ ] 3.1 `python3 skills/sdd/scripts/identity.py` при активной Claude-сессии возвращает правильный email
- [ ] 3.2 `grep -n "from_git\|git config" skills/sdd/scripts/identity.py` не встречается в `resolve()`
