# Setting up Google Cloud Authentication

## Table of Contents

- [Setting up Google Cloud Authentication](#setting-up-google-cloud-authentication)
  - [Table of Contents](#table-of-contents)
  - [1. Activate your Google Cloud Account](#1-activate-your-google-cloud-account)
  - [2. Install gcloud SDK (if not already installed)](#2-install-gcloud-sdk-if-not-already-installed)
  - [3. Log in with your Gmail account](#3-log-in-with-your-gmail-account)
  - [4. Verify your login](#4-verify-your-login)
  - [5. Create a new project](#5-create-a-new-project)
  - [6. Link project to billing](#6-link-project-to-billing)
  - [7. Set the project as default](#7-set-the-project-as-default)
  - [8. Enable Required APIs](#8-enable-required-apis)
  - [9. Create a Service Account](#9-create-a-service-account)
  - [10. Assign roles to service account](#10-assign-roles-to-service-account)
  - [11. Assign roles to your email](#11-assign-roles-to-your-email)
    - [a. Allow impersonation](#a-allow-impersonation)
    - [b. Manage and access GCS resources](#b-manage-and-access-gcs-resources)
    - [c. Manage and access secrets](#c-manage-and-access-secrets)
    - [d. Use Workload Identity Federation (WIF)](#d-use-workload-identity-federation-wif)
  - [12. Allow impersonation of Service Account](#12-allow-impersonation-of-service-account)
  - [13. Create Workload Identity Pool](#13-create-workload-identity-pool)
  - [14. Create Workload Identity Provider](#14-create-workload-identity-provider)
  - [15. Grant WIF access to service account](#15-grant-wif-access-to-service-account)
  - [16. Authenticate locally using WIF](#16-authenticate-locally-using-wif)
  - [17. Update the GoogleCloudStorageConfig class](#17-update-the-googlecloudstorageconfig-class)

## 1. Activate your Google Cloud Account

Visit [Google Cloud Platform](https://cloud.google.com/) to activate your Google Cloud account.
You will need a Gmail account to complete this task.

Don't worry about the cost: once you sign up, Google Cloud provides you with $300 of free credit to get started.

## 2. Install gcloud SDK (if not already installed)

```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-448.0.0-linux-x86_64.tar.gz
tar -xf google-cloud-sdk-*.tar.gz
./google-cloud-sdk/install.sh
```

Initialize the CLI:

```bash
gcloud init
```

## 3. Log in with your Gmail account

Follow the browser prompt to authenticate:

```bash
gcloud auth login
gcloud auth application-default login
```

## 4. Verify your login

Ensure you are logged in with the correct account:

```bash
gcloud auth list
```

The output will be similar to this. The active account will have an asterix place to it's left:

```text
* iheonyeanthony@gmail.com
```

## 5. Create a new project

```bash
gcloud projects create YOUR_PROJECT_NAME \
  --name="Morph and Split app"
```

Use a unique project name.

---

## 6. Link project to billing

First, find your billing account ID:

```bash
gcloud beta billing accounts list
```

Example output:

```text
ACCOUNT_ID            NAME                OPEN  MASTER_ACCOUNT_ID
01AECF-1110A2-1E1B26  My Billing Account  True
```

Next, link your project to billing by replacing YOUR_PROJECT_NAME and YOUR_BILLING_ACCOUNT_ID
in the command below:

```bash
gcloud beta billing projects link YOUR_PROJECT_NAME \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

## 7. Set the project as default

By setting the project as default, when you run the backend on your local machine using workload identity federation,
this authentication mechanism will automatically use the credential associated with this project (stored on your machine)
to connect to Google Cloud resources, including your storage buckets.

```bash
gcloud config set project YOUR_PROJECT_NAME
```

## 8. Enable Required APIs

```bash
gcloud services enable \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  run.googleapis.com \
  cloudresourcemanager.googleapis.com
```

## 9. Create a Service Account

```bash
gcloud iam service-accounts create YOUR_SERVICE_ACCONT_NAME \
  --description="Service account for Morph and Split" \
  --display-name="Morph and Split SA"
```

Twick the service account name (e.g., _**'morph-split-sa'**_) , description and display-name, as you wish.

## 10. Assign roles to service account

```bash
gcloud projects add-iam-policy-binding morph-and-split-toolkit \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding morph-and-split-toolkit \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 11. Assign roles to your email

These are needed for local development access and impersonation.

### a. Allow impersonation

This role allows your email identity (used locally) to act as the service account,
which is needed when you're developing locally and want your backend to behave exactly
like it would in production (Cloud Run).

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME \
  --member="user:YOUR_GMAIL_ADDRESS" \
  --role="roles/iam.serviceAccountTokenCreator"
```

### b. Manage and access GCS resources

This lets your local dev environment create buckets,
upload/download files, etc. via the service account it's impersonating.

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME \
  --member="user:YOUR_GMAIL_ADDRESS" \
  --role="roles/storage.admin"
```

### c. Manage and access secrets

You need this to read/write secrets (e.g., signed URL credentials) in Secret Manager,
especially if you're handling them during local development or rotation.

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME \
  --member="user:YOUR_GMAIL_ADDRESS" \
  --role="roles/secretmanager.admin"
```

### d. Use Workload Identity Federation (WIF)

This lets your local ADC (Application Default Credentials) use Workload Identity Federation
to authenticate securely without storing a key file.

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME \
  --member="user:YOUR_GMAIL_ADDRESS" \
  --role="roles/iam.workloadIdentityUser"
```

## 12. Allow impersonation of Service Account

Even after assigning '**roles/iam.serviceAccountTokenCreator**' to the Gmail account at the project level,
it's best practice (and sometimes required) to also grant it directly on the service account, especially
when using:

- Workload Identity Federation
- Impersonated Credentials (**impersonated_credentials.Credentials**)

```bash
gcloud iam service-accounts add-iam-policy-binding YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com \
  --member="user:YOUR_GMAIL_ADDRESS" \
  --role="roles/iam.serviceAccountTokenCreator"
```

## 13. Create Workload Identity Pool

A Workload Identity Pool (WIP) is a secure gateway that allows external identities (like your local machine,
GitHub Actions, or other third-party providers) to authenticate to Google Cloud without using a service account key file.

It is the first step when setting up Workload Identity Federation (WIF).

```bash
gcloud iam workload-identity-pools create YOUR_WORKLOAD_IDENTITY_POOL_NAME \
  --project="YOUR_PROJECT_NAME" \
  --location="global" \
  --display-name="Morph and Split App WIF"
```

The command above creates a Workload Identity Pool in your project (e.g., morph-split-app), named **"morph-split-app-wif"**, for instance.
It will be globally accessible (not tied to any specific region), and will be shown in the Cloud Console as
**"Morph and Split App WIF"**

## 14. Create Workload Identity Provider

This is the second step in creating a WIF. Replace YOUR_WORKLOAD_IDENTITY_PROVIDER_NAME with the name
of your workload provider (e.g. morph-and-split-provider)

```bash
gcloud iam workload-identity-pools providers create-oidc YOUR_WORKLOAD_IDENTITY_PROVIDER_NAME \
  --project="YOUR_PROJECT_NAME" \
  --location="global" \
  --workload-identity-pool="YOUR_WORKLOAD_IDENTITY_POOL_NAME" \
  --display-name="Morph and Split Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.email=assertion.email" \
  --issuer-uri="https://accounts.google.com"
```

## 15. Grant WIF access to service account

To grant WIF access to your service account, you will need the project number. Let us retrieve it:

```bash
gcloud projects describe YOUR_PROJECT_NAME --format="value(projectNumber)"
```

Replace PROJECT_NUMBER with the actual project number you just retrieved. Also replace:

- YOUR_SERVICE_ACCOUNT_NAME
- YOUR_PROJECT_NAME
- YOUR_WORKLOAD_IDENTITY_POOL_NAME, and
- YOUR_GMAIL_ADDRESS

```bash
gcloud iam service-accounts add-iam-policy-binding YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/YOUR_WORKLOAD_IDENTITY_POOL_NAME/attribute.email/YOUR_GMAIL_ADDRESS"
```

## 16. Authenticate locally using WIF

Create a credentials JSON file (let's name it **morph-and-split-key.json**) for Workload Identity Federation,
so our local backend could impersonate our service account.

```bash
gcloud iam service-accounts keys create morph-and-split-key.json \
  --iam-account=YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com
```

Place the file inside your backend directory, as indicted in the project tree.

```text
├── backend
│   ├── app
│   │   ├── aug_config.py
│   │   ├── config
│   │   ├── config.py
│   │   ├── __init__.py
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   ├── cors.json
│   ├── Dockerfile
│   ├── morph-and-split-key.json     # The configuration file
│   ├── requirements.txt
├── docker-compose.yml
├── frontend
```

If the plan is to run your backend on Cloud Run, the service account key must be injected into the service securely. To do this, we store the key as a secret in Secret Manager, which will later be exposed to the service as an environment variable (e.g., GCS_SIGNED_URL_KEY).

Let’s create the secret:

```bash
gcloud secrets create GCS_SIGNED_URL_KEY \
  --data-file=morph-and-split-engine-key.json \
  --project=YOUR_PROJECT_NAME
```

> You can rename the environment variable to suit your use case. I named mine GCS_SIGNED_URL_KEY because the service account key is used to generate signed download and upload URLs for Google Cloud Storage.

To allow Cloud Run to access the secret at runtime, we need to grant the deployed service account permission to read the secret from Secret Manager.

```bash
gcloud secrets add-iam-policy-binding GCS_SIGNED_URL_KEY \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_NAME@YOUR_PROJECT_NAME.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=YOUR_PROJECT_NAME
```

Replace `YOUR_SERVICE_ACCOUNT_NAME` and `YOUR_PROJECT_NAME` with your actual values.

## 17. Update the GoogleCloudStorageConfig class

At this point, you should have the names of your Google Cloud project, your service account, and
the service account key file (the JSON file generated in step 16). The **GoogleCloudStorageConfig** class
in **backend/config/google_cloud_storage.py** contains instance attributes that must be updated
to reflect these values.

Update the following three attributes:

- project_name
- service_account_name
- service_account_key_file_name

**Note**: The value of service_account_key_file_name must match the filename of the JSON key
file you generated earlier.

```python
@attr.s
class GoogleCloudStorageConfig:
    # Google Cloud Project
    project_name: str = attr.ib(default='YOUR_PROJECT_NAME')

    # Service Account
    service_account_name: str = attr.ib(default='YOUR_SERVICE_ACCOUNT_NAME')
    service_account_key_file_name: str = attr.ib(default='morph-and-split-key.json')
    service_account_key_file_path: Optional[str] = attr.ib(init=False, default=None)
    ....
```

---

You’re now ready to run Morph and Split locally with full Google Cloud authentication!

Return to [Running the backend](README.md#running-the-backend) section.
