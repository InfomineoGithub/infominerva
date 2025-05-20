output "cluster_name" {
  value       = google_container_cluster.gke.name
  description = "Name of the created GKE cluster"
}

output "endpoint" {
  value       = google_container_cluster.gke.endpoint
  description = "Endpoint of the GKE cluster"
}

output "cluster_ca_certificate" {
  value       = google_container_cluster.gke.master_auth[0].cluster_ca_certificate
  description = "Base64-encoded public CA cert of the cluster"
}