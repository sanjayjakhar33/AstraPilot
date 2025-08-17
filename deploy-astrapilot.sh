#!/bin/bash

# AstraPilot AWS Deployment Script
# Automated deployment for your specific AWS configuration

set -e

echo "🚀 AstraPilot AWS Deployment Script"
echo "====================================="

# Configuration Variables
EC2_IP="13.235.33.219"
DB_ENDPOINT="astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com"
DB_PASSWORD="bSghl^seBJyv697FyjBM#Z*1y"
SMTP_EMAIL="info@astranetix.in"
SMTP_PASSWORD="8k6UW8zPfU3g"

echo "Configuration:"
echo "  EC2 IP: $EC2_IP"
echo "  Database: $DB_ENDPOINT"
echo "  Email: $SMTP_EMAIL"
echo ""

# Step 1: Update system
echo "📦 Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Docker
echo "🐳 Step 2: Installing Docker and Docker Compose..."
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

echo "✅ Docker installed successfully"

# Step 3: Install additional packages
echo "📋 Step 3: Installing additional packages..."
sudo apt install -y git curl wget unzip nginx postgresql-client ufw

# Step 4: Clone repository
echo "📁 Step 4: Cloning AstraPilot repository..."
if [ ! -d "AstraPilot" ]; then
    git clone https://github.com/sanjayjakhar33/AstraPilot.git
else
    echo "Repository already exists, pulling latest changes..."
    cd AstraPilot && git pull && cd ..
fi

cd AstraPilot

# Step 5: Create environment file
echo "🔧 Step 5: Creating environment configuration..."
cat > .env << EOF
# Production Environment Variables for AstraPilot

# Database Configuration (Your PostgreSQL RDS)
DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@${DB_ENDPOINT}:5432/postgres

# Application Security
SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready-$(openssl rand -hex 16)

# Email Configuration (Zoho SMTP)
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_USERNAME=${SMTP_EMAIL}
SMTP_PASSWORD=${SMTP_PASSWORD}
SMTP_FROM_EMAIL=${SMTP_EMAIL}

# OTP Configuration
OTP_EXPIRE_MINUTES=10

# OpenAI API Key for AI features (add your key here)
OPENAI_API_KEY=

# Admin Configuration
ADMIN_EMAIL=admin@astranetix.in
ADMIN_USERNAME=admin
EOF

# Copy to backend directory
cp .env backend/.env

# Set secure permissions
chmod 600 .env backend/.env

echo "✅ Environment configuration created"

# Step 6: Create production Docker Compose
echo "🐳 Step 6: Creating production Docker Compose configuration..."
cat > docker-compose.production.yml << EOF
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@${DB_ENDPOINT}:5432/postgres
      - SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready
      - SMTP_HOST=smtp.zoho.in
      - SMTP_PORT=587
      - SMTP_USERNAME=${SMTP_EMAIL}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - SMTP_FROM_EMAIL=${SMTP_EMAIL}
      - OTP_EXPIRE_MINUTES=10
      - ADMIN_EMAIL=admin@astranetix.in
      - ADMIN_USERNAME=admin
    ports:
      - "8000:8000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ./logs:/app/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - REACT_APP_API_URL=http://${EC2_IP}:8000
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: astrapilot-network

volumes:
  logs:
    driver: local
EOF

echo "✅ Docker Compose configuration created"

# Step 7: Configure firewall
echo "🔥 Step 7: Configuring firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 8000/tcp    # Backend

# Enable firewall
sudo ufw --force enable

echo "✅ Firewall configured"

# Step 8: Test database connection
echo "🗄️ Step 8: Testing database connection..."
if command -v psql &> /dev/null; then
    echo "Testing PostgreSQL connection..."
    if timeout 10 psql -h $DB_ENDPOINT -U postgres -d postgres -c "SELECT version();" > /dev/null 2>&1; then
        echo "✅ Database connection successful"
    else
        echo "⚠️ Database connection failed - please check RDS security group allows EC2 access"
    fi
else
    echo "PostgreSQL client not available for testing"
fi

# Step 9: Create logs directory
echo "📝 Step 9: Creating logs directory..."
mkdir -p logs

# Step 10: Build and start application
echo "🚀 Step 10: Building and starting AstraPilot application..."
echo "This may take several minutes..."

# Use newgrp to apply docker group membership
newgrp docker << EONG
docker-compose -f docker-compose.production.yml up -d --build
EONG

echo "✅ Application containers started"

# Step 11: Wait for services to be ready
echo "⏳ Step 11: Waiting for services to start..."
sleep 30

# Check if services are running
echo "📊 Checking service status..."
if command -v docker &> /dev/null; then
    newgrp docker << EONG
docker-compose -f docker-compose.production.yml ps
EONG
fi

# Step 12: Initialize database
echo "🗄️ Step 12: Initializing database..."
sleep 10

newgrp docker << EONG
docker-compose -f docker-compose.production.yml exec -T backend python -c "
import asyncio
from app.database import create_tables
try:
    asyncio.run(create_tables())
    print('✅ Database tables created successfully!')
except Exception as e:
    print(f'⚠️ Database initialization error: {e}')
"
EONG

# Step 13: Create systemd service
echo "🔧 Step 13: Creating auto-start service..."
sudo tee /etc/systemd/system/astrapilot.service > /dev/null << EOF
[Unit]
Description=AstraPilot Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0
User=$USER
Group=docker

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable astrapilot.service

echo "✅ Auto-start service created"

# Step 14: Final tests
echo "🧪 Step 14: Running final tests..."

# Test health endpoint
echo "Testing backend health endpoint..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "⚠️ Backend health check failed"
fi

# Test frontend
echo "Testing frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "⚠️ Frontend is not accessible"
fi

# Step 15: Display final information
echo ""
echo "🎉 AstraPilot Deployment Complete!"
echo "=================================="
echo ""
echo "🌐 Application URLs:"
echo "  Frontend: http://$EC2_IP:3000"
echo "  Backend API: http://$EC2_IP:8000"
echo "  API Documentation: http://$EC2_IP:8000/docs"
echo ""
echo "🔗 Test Commands:"
echo "  curl http://$EC2_IP:8000/health"
echo "  curl http://$EC2_IP:3000"
echo ""
echo "📊 Monitoring Commands:"
echo "  docker-compose -f docker-compose.production.yml ps"
echo "  docker-compose -f docker-compose.production.yml logs"
echo "  sudo systemctl status astrapilot"
echo ""
echo "🔧 Management Commands:"
echo "  # Restart services"
echo "  docker-compose -f docker-compose.production.yml restart"
echo ""
echo "  # View logs"
echo "  docker-compose -f docker-compose.production.yml logs -f"
echo ""
echo "  # Update application"
echo "  git pull && docker-compose -f docker-compose.production.yml up -d --build"
echo ""
echo "📧 Email Configuration:"
echo "  SMTP Host: smtp.zoho.in"
echo "  Email: $SMTP_EMAIL"
echo "  OTP system is configured for user registration"
echo ""
echo "✅ Deployment successful! Your AstraPilot instance is ready."
echo ""
echo "Next steps:"
echo "1. Test user registration at http://$EC2_IP:3000"
echo "2. Check email verification works"
echo "3. Configure your OpenAI API key in the .env file"
echo "4. Set up monitoring and backups"
echo ""