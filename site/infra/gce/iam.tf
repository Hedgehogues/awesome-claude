locals {
  sa_member = "serviceAccount:${var.sa_email}"
}

resource "google_project_iam_member" "sa_compute_admin" {
  project = var.project_id
  role    = "roles/compute.admin"
  member  = local.sa_member
}

resource "google_project_iam_member" "sa_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = local.sa_member
}

resource "google_project_iam_member" "sa_dns_admin" {
  project = var.project_id
  role    = "roles/dns.admin"
  member  = local.sa_member
}

resource "google_project_iam_member" "sa_serviceusage_admin" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageAdmin"
  member  = local.sa_member
}

resource "google_project_iam_member" "sa_iam_admin" {
  project = var.project_id
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = local.sa_member
}
