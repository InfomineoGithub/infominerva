output "db_instance_name" {
  description = "The name of the created SQL database instance"
  value       = google_sql_database_instance.default-db.name
}

output "db_instance_self_link" {
  description = "The self link of the created SQL database instance"
  value       = google_sql_database_instance.default-db.self_link
}
