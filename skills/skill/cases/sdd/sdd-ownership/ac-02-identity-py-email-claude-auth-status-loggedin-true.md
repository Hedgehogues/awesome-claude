# Test: sdd:sdd-ownership (ac-02-identity-py-email-claude-auth-status-loggedin-true)

## Case: ac-02-identity-py-email-claude-auth-status-loggedin-true
stub: fresh-repo
semantic:
  - acceptance: identity.py возвращает email из claude auth status при loggedIn=true; fallback на git config; exit≠0 при недоступности обоих
