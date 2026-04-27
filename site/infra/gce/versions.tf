terraform {
  backend "gcs" {
    bucket = "tf-state-awesome-claude"
    prefix = "gce"
  }
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
