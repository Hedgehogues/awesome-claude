# Test: report:session-report

## Case: minimal-session
stub: fresh-repo
semantic:
  - report_template: skill outputs a session-report template with required sections
  - no_fabrication: skill does not invent activity that did not happen

## Case: with-context
stub: with-openspec
semantic:
  - context_aware: report references active changes from stub.openspec.changes
  - structured_sections: output contains discrete sections (e.g. summary, decisions, next steps)
