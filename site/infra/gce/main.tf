resource "google_compute_address" "web" {
  name   = "awesome-claude-ip"
  region = var.region
}

resource "google_compute_instance" "web" {
  name         = "awesome-claude"
  machine_type = var.machine_type
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 20
    }
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.web.address
    }
  }

  metadata = {
    ssh-keys = "${var.deploy_user}:${var.deploy_ssh_public_key}"
  }

  tags = ["http-server", "https-server"]
}
