---
name: report:bump-version
description: >
  Update report: namespace to latest version from awesome-claude.
  Checks dependencies and updates them if needed.
---

Before bumping, read `.claude/rules/index.md` to determine which rules belong to the `report` namespace:

```bash
python3 -c "
import re, yaml
txt = open('.claude/rules/index.md').read()
m = re.search(r'\`\`\`yaml\n(.*?)\`\`\`', txt, re.DOTALL)
data = yaml.safe_load(m.group(1))
rules = data.get('rules', {})
report_rules = [r['file'] for r in rules.get('always',[]) + rules.get('path_scoped',[]) if r.get('namespace') == 'report']
print('report rules:', report_rules if report_rules else '(none — all rules are core)')
" 2>/dev/null || echo "index.md not found or no YAML block — skipping rules check"
```

Run the bump-namespace script for the report namespace:

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh" report
```
