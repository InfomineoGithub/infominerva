module "services" {
  source = "./services"
  project_id = var.project_id
}

module "network" {
  source                      = "./network"
  project_id                  = var.project_id
  region                      = var.region
  network_name                = var.network_name
  auto_create_subnetworks     = var.auto_create_subnetworks
  subnet_name                 = var.subnet_name
  subnet_ip_cidr_range        = var.subnet_ip_cidr_range
  private_ip_google_access    = var.private_ip_google_access
  pods_range_name             = var.pods_range_name
  pods_ip_cidr_range          = var.pods_ip_cidr_range
  svc_range_name              = var.svc_range_name
  svc_ip_cidr_range           = var.svc_ip_cidr_range

  depends_on = [module.services]
}

module "sql-instance" {
  source            = "./sql"
  project_id        = var.project_id
  db_instance_name  = var.db_instance_name
  db_name           = var.db_name
  database_version  = var.database_version
  region            = var.region
  db_tier           = var.sql_instance_tier
  db_edition        = var.sql_instance_edition
  private_network   = module.network.vpc_network_name
  db_user_name      = var.db_user_name
  db_user_password  = var.db_user_password
  vpc_network_id    = module.network.vpc_network_id
  db_root_password  = var.db_root_password


  depends_on = [module.network]
}

module "gke" {
  source              = "./gke_autopilot"
  cluster_name        = var.cluster_name
  cluster_name_suffix = var.cluster_name_suffix
  project_id          = var.project_id
  region              = var.region
  network_name        = var.network_name
  subnet_name         = var.subnet_name
  pods_range_name     = var.pods_range_name
  svc_range_name      = var.svc_range_name
  deletion_protection = var.deletion_protection
  enable_autopilot    = var.enable_autopilot
  
  depends_on = [module.network]
}

module "firebase" {
  source                    = "./firebase"
  project_id                = var.project_id
  oauth_client_id           = var.oauth_client_id
  oauth_client_secret       = var.oauth_client_secret

  depends_on = [module.services]
}

module "artifact_registry" {
  source                            = "./artifact_registry"
  project_id                        = var.project_id
  region                            = var.region
  repository_name                   = var.artifact_registry_repository_name
  repository_description            = var.artifact_registry_repository_description
}