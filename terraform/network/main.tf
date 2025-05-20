resource "google_compute_network" "vpc_network" {
  name                    = var.network_name
  project                 = var.project_id
  auto_create_subnetworks = var.auto_create_subnetworks
}

resource "google_compute_subnetwork" "subnet" {
  name                     = var.subnet_name
  ip_cidr_range            = var.subnet_ip_cidr_range
  region                   = var.region
  network                  = google_compute_network.vpc_network.id
  project                  = var.project_id
  private_ip_google_access = var.private_ip_google_access

  secondary_ip_range {
    range_name    = var.pods_range_name
    ip_cidr_range = var.pods_ip_cidr_range
  }

  secondary_ip_range {
    range_name    = var.svc_range_name
    ip_cidr_range = var.svc_ip_cidr_range
  }

  depends_on = [google_compute_network.vpc_network]
}

# Reserve an IP range for Google Services (e.g., Cloud SQL Private IP)
resource "google_compute_global_address" "private_service_access_range" {
  name          = "google-services-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16 # Or another appropriate size that doesn't overlap
  network       = google_compute_network.vpc_network.id
  project       = var.project_id

  depends_on = [google_compute_network.vpc_network]
}

# Establish the peering connection for Private Services Access
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_access_range.name]

  depends_on = [google_compute_global_address.private_service_access_range]
}

resource "google_compute_firewall" "allow_egress_to_sql_private" {
  name      = "${var.network_name}-allow-egress-sql-private"
  network   = google_compute_network.vpc_network.id
  project   = var.project_id
  direction = "EGRESS"
  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }
  # Destination is the range reserved for services
  destination_ranges = ["${google_compute_global_address.private_service_access_range.address}/${google_compute_global_address.private_service_access_range.prefix_length}"]
  # Source can be specific GKE ranges or tags
  source_ranges = [var.subnet_ip_cidr_range, var.pods_ip_cidr_range]
  # Or use source_tags = ["your-gke-node-tag"] if applicable
}
