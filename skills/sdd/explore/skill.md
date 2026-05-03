---
name: sdd:explore
description: >
  Режим исследования идей, проблем, требований. Нелинейный, применим на любой фазе.
---

0. **Preflight — проверь наличие openspec** через Bash tool:
   ```bash
   which openspec > /dev/null 2>&1 || echo "NOTFOUND"
   ```
   Если вывод содержит `NOTFOUND` — остановись немедленно с сообщением:
   `openspec not found. Install: npm install -g @openspec/cli`

1. Вызови скилл `opsx:explore` через Skill tool. Передай аргументы: $ARGUMENTS
