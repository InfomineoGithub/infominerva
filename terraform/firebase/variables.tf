variable "project_id" {
  description = "The project ID for the GCP resources."
  type        = string
  default     = "my-gcp-project"
}

variable "oauth_client_secret" {
  type = string
  description = "OAuth client secret. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_secret. In a real app, you should use a secret manager service."
  sensitive = true
}

variable "oauth_client_id" {
  type = string
  description = "OAuth client ID"
}