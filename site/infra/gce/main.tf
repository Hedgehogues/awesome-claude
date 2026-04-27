resource "google_project_service" "dns" {
  service            = "dns.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_iam_member.sa_serviceusage_admin]
}

resource "google_dns_managed_zone" "web" {
  name     = "urvanov-com"
  dns_name = "${var.domain}."
  depends_on = [google_project_service.dns]
}

resource "google_dns_record_set" "apex" {
  name         = "${var.domain}."
  managed_zone = google_dns_managed_zone.web.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_address.web.address]
}

resource "google_dns_record_set" "www" {
  name         = "www.${var.domain}."
  managed_zone = google_dns_managed_zone.web.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_address.web.address]
}

resource "google_dns_record_set" "mx" {
  name         = "${var.domain}."
  managed_zone = google_dns_managed_zone.web.name
  type         = "MX"
  ttl          = 300
  rrdatas = [
    "1 aspmx.l.google.com.",
    "1 smtp.google.com.",
    "5 alt1.aspmx.l.google.com.",
    "5 alt2.aspmx.l.google.com.",
    "10 alt3.aspmx.l.google.com.",
    "10 alt4.aspmx.l.google.com.",
  ]
}

resource "google_dns_record_set" "google_site_verification_cname" {
  name         = "2p3q4i2lip73.${var.domain}."
  managed_zone = google_dns_managed_zone.web.name
  type         = "CNAME"
  ttl          = 300
  rrdatas      = ["gv-yeif5w3mehr3nl.dv.googlehosted.com."]
}

resource "google_dns_record_set" "google_site_verification_txt" {
  name         = "${var.domain}."
  managed_zone = google_dns_managed_zone.web.name
  type         = "TXT"
  ttl          = 300
  rrdatas      = ["\"google-site-verification=I2nwXblQdtGvoxjx-_SwPs0AawwAfN03daD9jToQ2tA\""]
}

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
