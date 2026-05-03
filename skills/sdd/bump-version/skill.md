---
name: sdd:bump-version
description: >
  Update sdd: namespace to latest version from awesome-claude.
  Checks dependencies and updates them if needed.
---

Before bumping, read `.claude/rules/index.md` to determine which rules belong to the `sdd` namespace:

```bash
python3 -c "
import re, yaml
txt = open('.claude/rules/index.md').read()
m = re.search(r'\`\`\`yaml\n(.*?)\`\`\`', txt, re.DOTALL)
data = yaml.safe_load(m.group(1))
rules = data.get('rules', {})
sdd_rules = [r['file'] for r in rules.get('always',[]) + rules.get('path_scoped',[]) if r.get('namespace') == 'sdd']
print('sdd rules:', sdd_rules if sdd_rules else '(none — all rules are core)')
" 2>/dev/null || echo "index.md not found or no YAML block — skipping rules check"
```

Run the bump-namespace script for the sdd namespace:

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh" sdd
```
