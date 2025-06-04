output "repository_url" {
  description = "The URL of the Artifact Registry Docker repository."
  value       = "${google_artifact_registry_repository.docker_repository.location}-docker.pkg.dev/${google_artifact_registry_repository.docker_repository.project}/${google_artifact_registry_repository.docker_repository.repository_id}"
}

output "repository_name" {
  description = "The name of the Artifact Registry repository."
  value       = google_artifact_registry_repository.docker_repository.name
}

output "repository_id_output" {
  description = "The ID of the Artifact Registry repository."
  value       = google_artifact_registry_repository.docker_repository.repository_id
}
