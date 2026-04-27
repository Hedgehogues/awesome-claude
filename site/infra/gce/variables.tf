variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "domain" {
  type        = string
  description = "Primary domain name"
}

variable "region" {
  type        = string
  description = "GCP region"
  default     = "us-central1"
}

variable "machine_type" {
  type        = string
  description = "GCE machine type"
  default     = "e2-small"
}

variable "deploy_user" {
  type        = string
  description = "OS login user for deployment"
}

variable "deploy_ssh_public_key" {
  type        = string
  description = "SSH public key for deploy user"
  sensitive   = true
}

variable "ssh_source_ranges" {
  type        = list(string)
  description = "CIDR ranges allowed to reach port 22"
  default     = ["0.0.0.0/0"]
}
