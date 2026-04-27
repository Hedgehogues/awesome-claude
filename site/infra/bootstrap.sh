#!/bin/bash
set -euo pipefail

# One-time setup for a new GCP project.
# Run this once from an account with roles/owner before pushing to CI.
# After this script, everything else is managed by Terraform via CI.

PROJECT=$(gcloud config get-value project)
SA="github-terraform@${PROJECT}.iam.gserviceaccount.com"

echo "Project: $PROJECT"
echo "Service account: $SA"

gcloud services enable cloudresourcemanager.googleapis.com

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$SA" \
  --role="roles/resourcemanager.projectIamAdmin"

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$SA" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$SA" \
  --role="roles/serviceusage.serviceUsageAdmin"

echo "Done. Push to CI to apply the rest."
