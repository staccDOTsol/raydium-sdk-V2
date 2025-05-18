#!/bin/bash

# Function to check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    echo "Visit https://docs.docker.com/get-docker/ for installation instructions."
    exit 1
  fi

  # First check for docker compose without hyphen (newer Docker versions)
  if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo "Using docker compose (without hyphen)"
    DOCKER_COMPOSE="docker compose"
  # Then check for docker-compose with hyphen (older versions)
  elif command -v docker-compose &> /dev/null; then
    echo "Using docker-compose (with hyphen)"
    DOCKER_COMPOSE="docker-compose"
  else
    echo "Docker Compose is not installed. Please install Docker Desktop or Docker Compose."
    echo "Visit https://docs.docker.com/compose/install/ for installation instructions."
    exit 1
  fi
}

# Check for Docker and Docker Compose
check_docker

# Check if .env file exists and create it if it doesn't
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "HELIUS_API_KEY=your_helius_api_key_here" > .env
  echo "REDIS_URL=redis://redis:6379" >> .env
  echo "PORT=3000" >> .env
  
  echo ".env file created. Please edit it with your Helius API key if needed."
  echo ""
fi

# Display status message
echo "Starting Stacc CP Swap server with Docker..."
echo "This will build and start the server and Redis."
echo "The server will be available at https://ws.staccattac.fun"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Run docker-compose using the detected command
$DOCKER_COMPOSE up --build 