#!/bin/bash

# AstraPilot EC2 Quick Deploy Script
# Run this script on your EC2 instance: ./quick-deploy.sh

set -e

echo "🚀 AstraPilot Quick Deploy Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as ec2-user
if [ "$USER" != "ec2-user" ]; then
    echo -e "${RED}Please run this script as ec2-user${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Installing Docker...${NC}"
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
    echo -e "${YELLOW}Please logout and login again, then re-run this script${NC}"
    exit 0
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Installing...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git not found. Installing Git...${NC}"
    sudo yum install -y git
fi

echo -e "${GREEN}✅ Prerequisites check complete${NC}"

echo -e "${YELLOW}Step 2: Cloning AstraPilot repository...${NC}"

# Clone or update repository
if [ -d "AstraPilot" ]; then
    echo "Repository exists, updating..."
    cd AstraPilot
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/sanjayjakhar33/AstraPilot.git
    cd AstraPilot
fi

echo -e "${GREEN}✅ Repository ready${NC}"

echo -e "${YELLOW}Step 3: Setting up environment configuration...${NC}"

# Copy production environment file
if [ ! -f ".env" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ Environment configuration copied${NC}"
else
    echo -e "${YELLOW}Environment file already exists${NC}"
fi

echo -e "${YELLOW}Step 4: Building and starting AstraPilot...${NC}"

# Stop any existing containers
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

# Build and start services
docker-compose -f docker-compose.production.yml up -d --build

echo -e "${GREEN}✅ AstraPilot containers started${NC}"

echo -e "${YELLOW}Step 5: Waiting for services to be ready...${NC}"
sleep 30

# Check if services are running
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose -f docker-compose.production.yml ps

# Test API endpoint
echo -e "${YELLOW}Testing API endpoint...${NC}"
if curl -s http://localhost:8000/docs > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API not responding${NC}"
fi

# Test frontend
echo -e "${YELLOW}Testing frontend...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend not responding${NC}"
fi

echo ""
echo -e "${GREEN}🎉 AstraPilot Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "📱 Access your application:"
echo "  Frontend: http://13.234.117.175:3000"
echo "  Backend:  http://13.234.117.175:8000"
echo "  API Docs: http://13.234.117.175:8000/docs"
echo ""
echo "🔐 Authentication features:"
echo "  ✅ User registration with email verification"
echo "  ✅ OTP email sending via Zoho SMTP"
echo "  ✅ Secure login with verified email requirement"
echo ""
echo "🗄️ Database: Connected to PostgreSQL RDS"
echo "📧 Email: Configured with info@astranetix.in"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose -f docker-compose.production.yml logs"
echo "  Restart:   docker-compose -f docker-compose.production.yml restart"
echo "  Stop:      docker-compose -f docker-compose.production.yml down"
echo ""
echo -e "${GREEN}Your AstraPilot deployment is ready for production use!${NC}"