output "vpc_network_id" {
  description = "ID of the created VPC network"
  value       = google_compute_network.vpc_network.id
}

output "subnet_id" {
  description = "ID of the created subnet"
  value       = google_compute_subnetwork.subnet.id
}

output "vpc_network_name" {
  description = "Name of the created VPC network"
  value       = google_compute_network.vpc_network.name
}