---
name: research:bump-version
description: >
  Update research: namespace to latest version from awesome-claude.
  Checks dependencies and updates them if needed.
---

Before bumping, read `.claude/rules/index.md` to determine which rules belong to the `research` namespace:

```bash
python3 -c "
import re, yaml
txt = open('.claude/rules/index.md').read()
m = re.search(r'\`\`\`yaml\n(.*?)\`\`\`', txt, re.DOTALL)
data = yaml.safe_load(m.group(1))
rules = data.get('rules', {})
research_rules = [r['file'] for r in rules.get('always',[]) + rules.get('path_scoped',[]) if r.get('namespace') == 'research']
print('research rules:', research_rules if research_rules else '(none — all rules are core)')
" 2>/dev/null || echo "index.md not found or no YAML block — skipping rules check"
```

Run the bump-namespace script for the research namespace:

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh" research
```
