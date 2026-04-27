terraform {
  backend "gcs" {
    bucket = "tf-state-awesome-claude"
    prefix = "gce"
  }
  # renovate: datasource=terraform-provider
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
