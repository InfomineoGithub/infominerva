resource "google_container_cluster" "gke" {
  name     = "${var.cluster_name}-cluster${var.cluster_name_suffix}"
  project  = var.project_id
  location = var.region

  network    = var.network_name
  subnetwork = var.subnet_name

  enable_autopilot = var.enable_autopilot

  ip_allocation_policy {
    cluster_secondary_range_name  = var.pods_range_name
    services_secondary_range_name = var.svc_range_name
  }

  release_channel {
    channel = "REGULAR"
  }

  deletion_protection = var.deletion_protection
}