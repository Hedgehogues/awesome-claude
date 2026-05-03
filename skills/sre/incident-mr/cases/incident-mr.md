## Case: positive-happy-incident-mr-base
stub: fresh-repo
contains:
  - "TODO: MR created: https://gitlab.example.com/project/-/merge_requests/7"

## Case: positive-corner-incident-mr-no-severity
stub: fresh-repo
contains:
  - "TODO: MR created without severity label"

## Case: negative-missing-input-incident-mr-no-token
stub: fresh-repo
contains:
  - "TODO: GITLAB_TOKEN is not set. Configure env before running sre:incident-mr."

## Case: negative-invalid-input-incident-mr-api-403
stub: fresh-repo
contains:
  - "TODO: Error: GitLab API returned 403 Forbidden"
