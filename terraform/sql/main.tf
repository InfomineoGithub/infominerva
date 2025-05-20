resource "google_sql_database_instance" "default-db" {
  project          = var.project_id
  name             = var.db_instance_name
  database_version = var.database_version
  root_password    = var.db_root_password
  region           = var.region
  
  deletion_protection = false

  settings {
    tier = var.tier

    ip_configuration {
      ipv4_enabled    = false # Disable public IP
      private_network = var.vpc_network_id
    }

    # Optional but recommended: Set backup configuration
    backup_configuration {
      enabled = true
      point_in_time_recovery_enabled = true
    }

    # Optional but recommended: Set maintenance window
    # maintenance_window {
    #   day  = 5 # Friday
    #   hour = 3 # 3 AM in the instance's region time zone
    # }
  }
}

# Define the database
resource "google_sql_database" "default-db" {
  project     = var.project_id
  instance    = google_sql_database_instance.default-db.name
  name        = var.db_name

  depends_on = [google_sql_database_instance.default-db]
}

# Define the user
resource "google_sql_user" "default-user" {
  project  = var.project_id
  instance = google_sql_database_instance.default-db.name
  name     = var.db_user_name
  password = var.db_user_password

  depends_on = [google_sql_database_instance.default-db]
}