resource "google_artifact_registry_repository" "docker_repository" {
  project       = var.project_id
  location      = var.region
  repository_id = var.repository_name
  description   = var.repository_description
  format        = "DOCKER"

  # Optional: Add labels
  labels = var.repository_labels

  # Optional: Configure cleanup policies
  cleanup_policies {
    id     = "delete-untagged-images-after-30-days"
    action = "DELETE"
    condition {
      tag_state    = "UNTAGGED"
      older_than   = "2592000s" # 30 days in seconds
    }
  }
}
