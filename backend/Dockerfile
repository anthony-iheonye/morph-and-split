# First Stage: Build Stage
FROM python:3.10-slim AS builder

# Set Python environment variables globally
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install dependencies required for gcloud CLI
RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https \
    ca-certificates \
    gnupg \
    && apt-get clean

# Install gcloud CLI
RUN curl -sSL https://sdk.cloud.google.com | bash -s -- --install-dir=/usr/local --disable-prompts

# Ensure gcloud is available in the runtime environment
ENV PATH="/usr/local/google-cloud-sdk/bin:$PATH"

# check install gcloud version
RUN gcloud --version

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies inside this stage
RUN pip install --no-cache-dir -r requirements.txt


# Second Stage: Runtime Stage
FROM python:3.10-slim

# Set environmental variables for Python.
# Update the PATH to include /usr/local/bin, so flask executable is directly accessible
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/google-cloud-sdk/bin:/usr/local/bin:$PATH" \
    FLASK_APP=app:create_app \
    CLOUDSDK_CONFIG=/app/.gcloud    

# Set working directory for the runtime stage
WORKDIR /app

# Install gcloud CLI dependencies and copy it from the builder stage
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    gnupg \
    && apt-get clean

# Copy the gcloud CLI from the builder stage
COPY --from=builder /usr/local/google-cloud-sdk /usr/local/google-cloud-sdk

# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Ensure the custom gcloud config directory exists and is writable
RUN mkdir -p /app/.gcloud && chmod -R 770 /app/.gcloud

# Ensure gcloud is available in the runtime environment
# ENV PATH="/usr/local/google-cloud-sdk/bin:$PATH"

# Copy the dependencies installed in the builder stage to the runtime image
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code to the runtime image
COPY . .

# Copy the Google Cloud service account key file into the container
# Ensure this setp is included to enable authentication
#COPY morph-and-split-key.json /app/morph-and-split-key.json

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app /app/.gcloud

# Switch to non-root user
USER appuser

# 🔥🔥 Explicitly Authenticate gcloud inside the Container 🔥🔥
RUN gcloud auth activate-service-account --key-file=/app/morph-and-split-key.json && \
    gcloud config set project morph-and-split


# Set Flask environment variables
ENV FLASK_ENV=production \
    PYTHONPATH=/app \
    K_SERVICE=morph-and-split-backend

# Expose port 5000 (default Flask port)
EXPOSE 5000

# Use Python to run Flask
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
CMD ["gunicorn", "--timeout", "900",  "-b", "0.0.0.0:5000", "app:create_app()"]

