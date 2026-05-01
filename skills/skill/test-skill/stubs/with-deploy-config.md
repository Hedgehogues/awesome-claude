---
name: with-deploy-config
description: Fresh repo with Makefile and mock docker command for deploy testing

git:
  branch: main
  commits:
    - "initial commit"

files:
  Makefile: |
    .PHONY: deploy
    deploy:
    	@echo "== Deploying to staging =="
    	docker push my-app:latest
    	@echo "Deploy complete"

mock_commands:
  docker: |
    #!/bin/bash
    # Mock docker command
    if [[ "$1" == "push" ]]; then
      echo "Mock docker push: $2"
      exit 0
    fi
    echo "Mock docker: $@"
    exit 0

env:
  DEPLOY_ENV: "staging"
  DEPLOY_TOKEN: "fake-token-12345"
