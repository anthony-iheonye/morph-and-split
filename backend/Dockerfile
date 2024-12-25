# First Stage: Build Stage
FROM python:3.10-slim AS builder

# Set environmental variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies inside this stage
RUN pip install --no-cache-dir -r requirements.txt

# Second Stage: Runtime Stage
FROM python:3.10-slim

# Set environmental variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory for the runtime stage
WORKDIR /app

# Copy the dependencies installed in the builder stage to the runtime image
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# Copy the application code to the runtime image
COPY . .

# Set Flask environment variables
ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV PYTHONPATH=/app

# Expose port 5000 (default Flask port)
EXPOSE 5000

# Use Python to run Flask
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
