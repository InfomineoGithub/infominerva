resource "google_project_service" "service_networking" {
  project = var.project_id
  service = "servicenetworking.googleapis.com"
}

resource "google_project_service" "cloud_sql_admin" {
  project = var.project_id
  service = "sqladmin.googleapis.com"
}

resource "google_project_service" "gke" {
  project = var.project_id
  service = "container.googleapis.com"
}

resource "google_project_service" "serviceusage" {
  provider = google-beta
  project = var.project_id
  service = "serviceusage.googleapis.com"
}

resource "google_project_service" "firebase" {
  provider = google-beta
  project = var.project_id
  service = "firebase.googleapis.com"
}

resource "google_project_service" "auth" {
  provider = google-beta
  project  = var.project_id
  service =  "identitytoolkit.googleapis.com"
}
