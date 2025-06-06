# GKE Private Autopilot Cluster Deployment

This project automates the deployment of a **GKE Autopilot Private Cluster** on **Google Cloud Platform** using **Terraform**.

## Prerequisites

- **Terraform** >= 1.3.0
- **Google Cloud SDK** (gcloud) >= 450.0.0
- A GCP project with billing enabled
- Required IAM permissions (e.g., `roles/container.admin`, `roles/compute.networkAdmin`)

---

## 1. Install Terraform

Follow the [official Terraform installation guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli):

```bash
# For MacOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# For Ubuntu
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install terraform

# Verify installation
terraform version
```

---

## 2. Install and Authenticate Google Cloud SDK (gcloud)

Follow the [gcloud installation instructions](https://cloud.google.com/sdk/docs/install):

```bash
# For MacOS
brew install --cask google-cloud-sdk

# For Ubuntu
sudo apt-get install google-cloud-sdk

# Initialize gcloud
gcloud init

# Authenticate
gcloud auth login
gcloud auth application-default login
```

Set the project and region:

```bash
gcloud config set project <your-project-id>
gcloud config set compute/region <your-region>
```

---

## 3. Using Terraform for This Project

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### Step 2: Configure Variables

Edit the `terraform.tfvars` file with your project-specific values:

```hcl
project_id  = "your-gcp-project-id"
region      = "your-region"
network_name = "your-network-name"
subnet_name  = "your-subnet-name"
pods_range_name = "your-pods-ip-range"
svc_range_name  = "your-services-ip-range"
cluster_name = "your-cluster-name"
deletion_protection = false
enable_vertical_pod_autoscaling = true
enable_private_endpoint = true
enable_private_nodes = true
insecure_kubelet_readonly_port_enabled = false
```

### Step 3: Initialize Terraform

```bash
terraform init
```

This downloads the necessary modules and providers.

### Step 4: Preview the Changes

```bash
terraform plan
```

This shows what Terraform will create, update, or destroy.

### Step 5: Apply the Infrastructure

```bash
terraform apply
```

Confirm with `yes` when prompted.

---

## 4. Clean Up

To destroy all resources created by Terraform:

```bash
terraform destroy
```

Confirm with `yes` when prompted.

---

## Notes

- Make sure your service account has sufficient IAM permissions.
- Private clusters have restricted access; configure your bastion host or VPN accordingly if needed.
- Ensure secondary IP ranges are created in your VPC if not using default.
