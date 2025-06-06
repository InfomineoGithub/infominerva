variable "credentials_path" {
  description = "The path to the GCP credentials file."
  type        = string
  default     = "./infomineo-b952e1ca199d.json"
}

variable "project_id" {
  description = "The project ID for the GCP resources."
  type        = string
  default     = "my-gcp-project"
}

variable "region" {
  description = "The region where the GCP resources will be located."
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone where the resources will be located."
  type        = string
  default     = "us-central1-a"
}

variable "network_name" {
  description = "The name of the VPC network."
  type        = string
  default     = "my-vpc-network"
}

variable "auto_create_subnetworks" {
  description = "Whether to auto-create subnetworks in the VPC."
  type        = bool
  default     = false
}

variable "subnet_name" {
  description = "The name of the subnet in the VPC network."
  type        = string
  default     = "my-subnet"
}

variable "subnet_ip_cidr_range" {
  description = "The CIDR block for the subnet IP range."
  type        = string
  default     = "10.0.0.0/17"
}

variable "private_ip_google_access" {
  description = "Whether to enable private Google access."
  type        = bool
  default     = true
}

variable "pods_range_name" {
  description = "The name of the IP range for pods in the VPC network."
  type        = string
  default     = "pods-range"
}

variable "pods_ip_cidr_range" {
  description = "The CIDR block for pods IP range."
  type        = string
  default     = "192.168.0.0/18"
}

variable "svc_range_name" {
  description = "The name of the IP range for services in the VPC network."
  type        = string
  default     = "services-range"
}

variable "svc_ip_cidr_range" {
  description = "The CIDR block for services IP range."
  type        = string
  default     = "192.168.64.0/18"
}

variable "db_instance_name" {
  description = "The name of the SQL instance."
  type        = string
  default     = "odoo-postgres"
}

variable "database_version" {
  description = "The version of the SQL database."
  type        = string
  default     = "POSTGRES_15"
}

variable "sql_instance_tier" {
  description = "The tier for the SQL instance."
  type        = string
  default     = "db-f1-micro"
}

variable "sql_instance_edition" {
  description = "The edition for the SQL instance."
  type        = string
  default     = "STANDARD"
}

variable "cluster_name" {
  description = "The name of the GKE cluster."
  type        = string
  default     = "my-app-prod"
}

variable "cluster_name_suffix" {
  description = "The suffix to be added to the cluster name."
  type        = string
  default     = "-prod"
}

variable "deletion_protection" {
  description = "Whether deletion protection is enabled for the GKE cluster."
  type        = bool
  default     = true
}

variable "enable_autopilot" {
  description = "Whether the GKE cluster should be autopilot."
  type        = bool
  default     = true
}

variable "db_name" {
  description = "The name of the database to be created for the SQL instance."
  type        = string
  default     = "odoo"
}

variable "db_user_name" {
  description = "The name of the user to be created for the SQL instance."
  type        = string
  # No default - value should come from tfvars or environment
}

variable "db_user_password" {
  description = "The password for the SQL user."
  type        = string
  sensitive   = true
  # No default - value should come from tfvars or environment
}

# Added Missing Variable Declaration:
variable "k8s_namespace" {
  description = "The Kubernetes namespace for the Odoo deployment."
  type        = string
  default     = "odoo"
}

variable "db_root_password" {
  description = "The root password for the SQL instance."
  type        = string
  sensitive   = true
}

variable "oauth_client_id" {
  type = string
  description = "OAuth client ID"
}

variable "oauth_client_secret" {
  type = string
  description = "OAuth client secret. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_secret. In a real app, you should use a secret manager service."
  sensitive = true
}


# Artifact Registry Variables
variable "artifact_registry_repository_name" {
  description = "The desired name for the Artifact Registry Docker repository (e.g., 'my-docker-repo')."
  type        = string
  # No default, as this should be explicitly provided.
}

variable "artifact_registry_repository_description" {
  description = "A description for the Artifact Registry repository."
  type        = string
  default     = "Docker repository for application images"
}
