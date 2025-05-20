variable "cluster_name" {
  type        = string
  description = "Base name for the GKE cluster"
}

variable "cluster_name_suffix" {
  type        = string
  description = "Suffix to append to the cluster name"
}

variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  description = "Region where GKE cluster will be created"
}

variable "network_name" {
  type        = string
  description = "VPC network name"
}

variable "subnet_name" {
  type        = string
  description = "Subnetwork name"
}

variable "pods_range_name" {
  type        = string
  description = "Secondary IP range for pods"
}

variable "svc_range_name" {
  type        = string
  description = "Secondary IP range for services"
}

variable "deletion_protection" {
  type        = bool
  description = "Whether deletion protection is enabled"
}

variable "enable_autopilot" {
  type        = bool
  description = "Whether gke_autopilot is enabled"
}
