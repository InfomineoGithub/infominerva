variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "Region where subnet will be created"
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
}

variable "auto_create_subnetworks" {
  description = "Whether to auto-create subnetworks"
  type        = bool
  default     = false
}

variable "subnet_name" {
  description = "Name of the primary subnet"
  type        = string
}

variable "subnet_ip_cidr_range" {
  description = "Primary subnet CIDR range"
  type        = string
  default     = "10.0.0.0/17"
}

variable "private_ip_google_access" {
  description = "Enable private Google access"
  type        = bool
  default     = true
}

variable "pods_range_name" {
  description = "Secondary range name for pods"
  type        = string
}

variable "pods_ip_cidr_range" {
  description = "CIDR range for pods secondary IP range"
  type        = string
  default     = "192.168.0.0/18"
}

variable "svc_range_name" {
  description = "Secondary range name for services"
  type        = string
}

variable "svc_ip_cidr_range" {
  description = "CIDR range for services secondary IP range"
  type        = string
  default     = "192.168.64.0/18"
}
