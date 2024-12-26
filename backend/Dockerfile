# First Stage: Build Stage
FROM python:3.10-slim AS builder

# Set Python environment variables globally
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

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
    PATH="/usr/local/bin:$PATH" \
    FLASK_APP=app:create_app

# Set working directory for the runtime stage
WORKDIR /app

# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Copy the dependencies installed in the builder stage to the runtime image
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code to the runtime image
COPY . .

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set Flask environment variables
ENV FLASK_ENV=production \
    PYTHONPATH=/app

# Expose port 5000 (default Flask port)
EXPOSE 5000

# Use Python to run Flask
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
CMD ["gunicorn", "--timeout", "900",  "-b", "0.0.0.0:5000", "app:create_app()"]
