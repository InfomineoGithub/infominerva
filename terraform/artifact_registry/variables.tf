variable "project_id" {
  description = "The GCP project ID where the Artifact Registry will be created."
  type        = string
  # No default, as this should be explicitly provided.
}

variable "region" {
  description = "The region for the Artifact Registry repository (e.g., 'us-central1')."
  type        = string
  # No default, as this should be explicitly provided.
}

variable "repository_name" {
  description = "The desired name for the Artifact Registry Docker repository (e.g., 'my-docker-repo')."
  type        = string
  # No default, as this should be explicitly provided.
}

variable "repository_description" {
  description = "A description for the Artifact Registry repository."
  type        = string
  default     = "Docker repository for application images"
}

variable "repository_labels" {
  description = "A map of labels to assign to the repository."
  type        = map(string)
  default     = {}
}