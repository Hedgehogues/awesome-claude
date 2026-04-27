resource "google_compute_project_metadata_item" "ssh_keys" {
  key   = "ssh-keys"
  value = "${var.deploy_user}:${var.deploy_ssh_public_key}"
}

resource "google_compute_firewall" "allow_http" {
  name     = "default-allow-http"
  network  = "default"
  priority = 65534
  allow {
    protocol = "tcp"
    ports    = ["80"]
  }
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_https" {
  name     = "default-allow-https"
  network  = "default"
  priority = 65534
  allow {
    protocol = "tcp"
    ports    = ["443"]
  }
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_ssh" {
  name     = "default-allow-ssh"
  network  = "default"
  priority = 65534
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = var.ssh_source_ranges
}

resource "google_compute_firewall" "allow_icmp" {
  name     = "default-allow-icmp"
  network  = "default"
  priority = 65534
  allow {
    protocol = "icmp"
  }
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_internal" {
  name     = "default-allow-internal"
  network  = "default"
  priority = 65534
  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "icmp"
  }
  source_ranges = ["10.128.0.0/9"]
}
