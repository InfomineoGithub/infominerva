resource "google_firebase_project" "firebase_project" {
  provider = google-beta
  project  = var.project_id
}

resource "google_identity_platform_config" "auth" {
  provider = google-beta
  project  = google_firebase_project.firebase_project.project

  # Auto-deletes anonymous users
  autodelete_anonymous_users = true

  # Configures local sign-in methods, like anonymous, email/password, and phone authentication.
  sign_in {
    allow_duplicate_emails = true

    anonymous {
      enabled = true
    }

    email {
      enabled = true
      password_required = false
    }

    phone_number {
      enabled = true
    }
  }

  # Configures authorized domains.
  authorized_domains = [
    "localhost",
    "infominerva.infomineo.com",
  ]
}