variable "project_id" {
  description = "The Google Cloud project ID"
  type        = string
}

variable "db_instance_name" {
  description = "The name of the SQL database instance"
  type        = string
}

variable "db_name" {
  description = "The name of the SQL database"
  type        = string
}

variable "database_version" {
  description = "The database version"
  type        = string
  default     = "POSTGRES_15"
}

variable "region" {
  description = "The region where the database instance will be created"
  type        = string
}

variable "db_tier" {
  description = "The tier (machine type) of the database instance"
  type        = string
  default     = "db-f1-micro"
}

variable "db_edition" {
  description = "The edition of the database"
  type        = string
  default     = "STANDARD"
}

variable "private_network" {
  description = "The self-link of the VPC network to which the instance will be connected"
  type        = string
}

variable "db_user_name" {
  description = "The name of the SQL user"
  type        = string
}

variable "db_user_password" {
  description = "The password for the SQL user."
  type        = string
  sensitive   = true
}

variable "db_root_password" {
  description = "The root password for the SQL instance."
  type        = string
  sensitive   = true
}

variable "vpc_network_id" {
  description = "ID of the created VPC network"
  type        = string
}
