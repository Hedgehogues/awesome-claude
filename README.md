<div align="center">

# awesome-claude

**Engineering rules & skills for Claude Code.**

Battle-tested conventions that turn Claude into a senior engineer on your team.

</div>

---

## Install

**For Claude Code:** Run this command:
```bash
git clone --depth 1 --branch main https://github.com/Hedgehogues/awesome-claude /tmp/ac && cp -r /tmp/ac/.claude . && rm -rf /tmp/ac
```

Or ask Claude: "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"

---

## How It Works

```
You ask Claude → .claude/ detected → Rules loaded (by file path)
                                   → Skills available (/tdd, /commit, ...)
                                   → Claude writes code following YOUR conventions
```

---

## Skills

Type `/namespace:skill` to run a full workflow.

**dev:** `/dev:tdd` `/dev:fix-bug` `/dev:commit` `/dev:deploy` `/dev:test-all`

**sdd:** `/sdd:propose` `/sdd:apply` `/sdd:archive` `/sdd:audit`

**report:** `/report:describe`

**research:** `/research:triz`

See [docs/README_DETAILED.md](docs/README_DETAILED.md) for all 16 skills.

---

## Rules

Automatically load based on file paths:
- **Architecture:** DDD contracts, state ownership, visual cohesion
- **Workflow:** Git discipline, testing conventions, monorepo structure
- **Quality:** Security, unit tests, never silently fix broken tests

---

## Philosophy

- **Tests are specs** — no red test, no requirement
- **Backend owns state** — frontend is stateless projection  
- **Stop on red** — never silently fix broken tests
- **DDD layers** — domain → application → infrastructure → presentation
- **Commits tell a story** — What / Why / Details

---

## Customize

Edit `CLAUDE.md` in your project root to override awesome-claude rules.

Adapt skills to your stack by editing `.claude/skills/dev/deploy.md`, `.claude/skills/dev/test-all.md` after install.

---

## Details

Full documentation: [docs/README_DETAILED.md](docs/README_DETAILED.md)

Installation guide: [CLAUDE_INSTALL.md](CLAUDE_INSTALL.md)

---

[MIT](LICENSE)
