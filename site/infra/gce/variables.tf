variable "project_id" {
  description = "GCP project ID"
}

variable "region" {
  description = "GCP region"
  default     = "us-central1"
}

variable "deploy_user" {
  description = "OS login user for deployment"
  default     = "urvanov"
}

variable "deploy_ssh_public_key" {
  description = "SSH public key for deploy user"
  sensitive   = true
}

variable "ssh_source_ranges" {
  description = "CIDR ranges allowed to reach port 22"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
