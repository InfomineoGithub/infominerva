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
}

module "sql-instance" {
  source            = "./sql"
  project_id        = var.project_id
  db_instance_name  = var.db_instance_name
  db_name           = var.db_name
  database_version  = var.database_version
  region            = var.region
  tier              = var.sql_instance_tier
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

module "odoo-deployment" {
  source = "./deployment"
  k8s_namespace = var.k8s_namespace
  depends_on = [
    module.gke,
    module.sql-instance
   ]
}
