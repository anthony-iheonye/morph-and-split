# First Stage: Build stage
FROM python:3.10-slim AS builder

# Set environmental variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirments files first to leverage Docker cache
COPY requirments.txt .

# Install python dependencies inside the build stage
RUN pip install --no-cache-dir -r requirments.txt

# Second stage: Runtime Stage
FROM python:3.10-slim

# Set environmental variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory for the Runtime stage
WORKDIR /app

# Copy the dependencies installed in the builder stage to the Runtime stage
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# Copy the application code the Runtime image
COPY . .

# Set Flask environment variable
ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV PYTHONPATH=/app

# Expose port 5000 (default Flask port)
EXPOSE 5000

# Use Python to run Flask
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]