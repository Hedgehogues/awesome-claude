output "ip" {
  description = "External IP of the web VM"
  value       = google_compute_address.web.address
}

output "nameservers" {
  description = "Google Cloud DNS nameservers — set these at reg.ru once"
  value       = google_dns_managed_zone.web.name_servers
}

output "region" {
  description = "GCP region"
  value       = var.region
}

output "deploy_user" {
  description = "OS login user for deployment"
  value       = var.deploy_user
}
