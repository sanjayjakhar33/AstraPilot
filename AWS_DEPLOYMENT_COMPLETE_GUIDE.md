# AstraPilot - Complete AWS Deployment Requirements & Guide

## 🚀 100% Complete AWS Free Tier Deployment Documentation

> **Comprehensive guide covering ALL AWS services, security groups, and deployment steps for AstraPilot on AWS Free Tier**

---

## 📋 Table of Contents

1. [AWS Services Required](#aws-services-required)
2. [Security Groups Configuration](#security-groups-configuration)
3. [Infrastructure Requirements](#infrastructure-requirements)
4. [Current Configuration Summary](#current-configuration-summary)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Security Best Practices](#security-best-practices)
7. [Monitoring & Backup](#monitoring--backup)
8. [Cost Optimization](#cost-optimization)
9. [Troubleshooting](#troubleshooting)
10. [Additional Recommended Services](#additional-recommended-services)

---

## 🛡️ AWS Services Required

### Core Services (Already Configured)

#### 1. **Amazon EC2** - Application Server
- **Instance Type**: `t2.micro` (Free Tier eligible)
- **Current Instance**: `13.235.33.219` (ap-south-1)
- **Operating System**: Ubuntu/Amazon Linux 2
- **Storage**: 30GB EBS (Free Tier: 30GB)
- **Purpose**: Hosts Docker containers for frontend and backend

#### 2. **Amazon RDS** - Database Service
- **Engine**: PostgreSQL 17.4
- **Instance Class**: `db.t4g.micro` (Free Tier eligible)
- **Current Endpoint**: `astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com`
- **Storage**: 20GB General Purpose SSD (gp2)
- **Multi-AZ**: No (to stay within Free Tier)
- **Backup Retention**: 7 days

#### 3. **VPC** - Virtual Private Cloud (Implied)
- **CIDR Block**: Default VPC or custom 10.0.0.0/16
- **Subnets**: Public and private subnets across AZs
- **Internet Gateway**: For public internet access
- **Route Tables**: For routing traffic

### Recommended Additional Services

#### 4. **Amazon S3** - Object Storage
- **Purpose**: Static file storage, backups, logs
- **Free Tier**: 5GB storage, 20,000 GET requests, 2,000 PUT requests
- **Use Cases**:
  - User uploaded files
  - Application logs
  - Database backups
  - Static assets

#### 5. **Amazon CloudWatch** - Monitoring
- **Purpose**: Application and infrastructure monitoring
- **Free Tier**: 10 custom metrics, 5GB log ingestion
- **Features**:
  - EC2 monitoring
  - RDS monitoring
  - Application logs
  - Custom metrics

#### 6. **AWS IAM** - Identity & Access Management
- **Purpose**: Secure access control
- **Components**:
  - IAM roles for EC2
  - IAM policies for S3 access
  - Service-linked roles

#### 7. **Application Load Balancer (ALB)** - Optional
- **Purpose**: Load balancing and SSL termination
- **Cost**: ~$16.20/month (not free tier)
- **Benefits**: High availability, SSL/TLS, health checks

---

## 🔒 Security Groups Configuration

### 1. **EC2 Security Group** (`astrapilot-ec2-sg`)

```json
{
  "GroupName": "astrapilot-ec2-sg",
  "Description": "Security group for AstraPilot EC2 instance",
  "InboundRules": [
    {
      "Type": "SSH",
      "Protocol": "TCP",
      "Port": "22",
      "Source": "YOUR_IP/32",
      "Description": "SSH access from your IP only"
    },
    {
      "Type": "HTTP",
      "Protocol": "TCP", 
      "Port": "80",
      "Source": "0.0.0.0/0",
      "Description": "HTTP access from anywhere"
    },
    {
      "Type": "HTTPS",
      "Protocol": "TCP",
      "Port": "443", 
      "Source": "0.0.0.0/0",
      "Description": "HTTPS access from anywhere"
    },
    {
      "Type": "Custom TCP",
      "Protocol": "TCP",
      "Port": "3000",
      "Source": "0.0.0.0/0",
      "Description": "React frontend"
    },
    {
      "Type": "Custom TCP", 
      "Protocol": "TCP",
      "Port": "8000",
      "Source": "0.0.0.0/0",
      "Description": "FastAPI backend"
    }
  ],
  "OutboundRules": [
    {
      "Type": "All Traffic",
      "Protocol": "All",
      "Port": "All",
      "Destination": "0.0.0.0/0",
      "Description": "All outbound traffic"
    }
  ]
}
```

### 2. **RDS Security Group** (`astrapilot-rds-sg`)

```json
{
  "GroupName": "astrapilot-rds-sg", 
  "Description": "Security group for AstraPilot RDS PostgreSQL",
  "InboundRules": [
    {
      "Type": "PostgreSQL",
      "Protocol": "TCP",
      "Port": "5432",
      "Source": "astrapilot-ec2-sg",
      "Description": "PostgreSQL access from EC2 instances only"
    }
  ],
  "OutboundRules": [
    {
      "Type": "All Traffic",
      "Protocol": "All", 
      "Port": "All",
      "Destination": "0.0.0.0/0",
      "Description": "All outbound traffic"
    }
  ]
}
```

### 3. **ALB Security Group** (`astrapilot-alb-sg`) - Optional

```json
{
  "GroupName": "astrapilot-alb-sg",
  "Description": "Security group for Application Load Balancer",
  "InboundRules": [
    {
      "Type": "HTTP",
      "Protocol": "TCP",
      "Port": "80", 
      "Source": "0.0.0.0/0",
      "Description": "HTTP access from anywhere"
    },
    {
      "Type": "HTTPS",
      "Protocol": "TCP",
      "Port": "443",
      "Source": "0.0.0.0/0", 
      "Description": "HTTPS access from anywhere"
    }
  ]
}
```

---

## 🏗️ Infrastructure Requirements

### Current Configuration Summary

```yaml
Region: ap-south-1 (Asia Pacific - Mumbai)
Availability Zones: ap-south-1a, ap-south-1b

EC2 Instance:
  - Instance ID: [Your Instance ID]
  - Public IP: 13.235.33.219
  - Instance Type: t2.micro
  - AMI: Ubuntu 22.04 LTS or Amazon Linux 2
  - Key Pair: [Your SSH Key]
  - Security Group: SSH access configured

RDS Database:
  - DB Instance ID: astrapilot
  - Engine: PostgreSQL 17.4
  - Endpoint: astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com
  - Port: 5432
  - Database Name: postgres
  - Master Username: postgres
  - Master Password: bSghl^seBJyv697FyjBM#Z*1y
  - Storage: 20GB gp2
  - Encryption: Enabled

Email Configuration:
  - Provider: Zoho SMTP
  - Host: smtp.zoho.in
  - Port: 587
  - Username: info@astranetix.in
  - App Password: 8k6UW8zPfU3g
  - From Email: info@astranetix.in

Application:
  - Frontend: React.js (Port 3000)
  - Backend: FastAPI (Port 8000)
  - Database: PostgreSQL
  - Containerization: Docker & Docker Compose
```

---

## 📝 Step-by-Step Deployment

### Phase 1: AWS Infrastructure Verification

#### 1.1 Verify EC2 Instance Access
```bash
# Test SSH connection
ssh -i your-key.pem ubuntu@13.235.33.219

# Or if using password authentication
ssh ubuntu@13.235.33.219
```

#### 1.2 Verify RDS Database Access
```bash
# Test database connection from EC2
sudo apt update && sudo apt install -y postgresql-client

# Connect to RDS instance
psql -h astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com \
     -U postgres \
     -d postgres \
     -p 5432

# If connection works, exit with \q
```

#### 1.3 Configure Security Groups

**EC2 Security Group Rules:**
```bash
# Add rules via AWS CLI (if needed)
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0
```

### Phase 2: Server Setup & Dependencies

#### 2.1 System Updates & Package Installation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y \
    git \
    curl \
    wget \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installations
docker --version
docker-compose --version
```

#### 2.2 Install Node.js & Python (if needed)
```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.9+ and pip
sudo apt install -y python3.9 python3.9-venv python3.9-dev python3-pip

# Verify installations
node --version
npm --version
python3 --version
```

### Phase 3: Application Deployment

#### 3.1 Clone AstraPilot Repository
```bash
# Clone the repository
git clone https://github.com/sanjayjakhar33/AstraPilot.git
cd AstraPilot

# Verify repository structure
ls -la
```

#### 3.2 Configure Environment Variables
```bash
# Create production environment file
cat > .env << 'EOF'
# Production Environment Variables for AstraPilot

# Database Configuration (Your PostgreSQL RDS)
DATABASE_URL=postgresql+asyncpg://postgres:bSghl^seBJyv697FyjBM#Z*1y@astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com:5432/postgres

# Application Security
SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready-$(openssl rand -hex 16)

# Email Configuration (Zoho SMTP)
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_USERNAME=info@astranetix.in
SMTP_PASSWORD=8k6UW8zPfU3g
SMTP_FROM_EMAIL=info@astranetix.in

# OTP Configuration
OTP_EXPIRE_MINUTES=10

# OpenAI API Key for AI features (if available)
OPENAI_API_KEY=your-openai-api-key-here

# Admin Configuration
ADMIN_EMAIL=admin@astranetix.in
ADMIN_USERNAME=admin
EOF

# Copy environment file to backend
cp .env backend/.env

# Set secure permissions
chmod 600 .env backend/.env
```

#### 3.3 Create Production Docker Compose
```bash
# Create production Docker Compose file
cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:bSghl^seBJyv697FyjBM#Z*1y@astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com:5432/postgres
      - SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready
      - SMTP_HOST=smtp.zoho.in
      - SMTP_PORT=587
      - SMTP_USERNAME=info@astranetix.in
      - SMTP_PASSWORD=8k6UW8zPfU3g
      - SMTP_FROM_EMAIL=info@astranetix.in
      - OTP_EXPIRE_MINUTES=10
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
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
      - REACT_APP_API_URL=http://13.235.33.219:8000
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
```

#### 3.4 Build and Deploy Application
```bash
# Create logs directory
mkdir -p logs

# Build and start services
docker-compose -f docker-compose.production.yml up -d --build

# Verify services are running
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f --tail=50
```

### Phase 4: Database Initialization
```bash
# Access backend container to initialize database
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
from app.database import create_tables
asyncio.run(create_tables())
print('Database tables created successfully!')
"

# Test database connection
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
import asyncpg
from app.settings import settings

async def test_db():
    try:
        conn = await asyncpg.connect(settings.SQLALCHEMY_DATABASE_URL.replace('postgresql+asyncpg', 'postgresql'))
        result = await conn.fetchval('SELECT version()')
        print(f'Database connected successfully: {result}')
        await conn.close()
    except Exception as e:
        print(f'Database connection failed: {e}')

asyncio.run(test_db())
"
```

### Phase 5: Configure Firewall & Security
```bash
# Configure UFW firewall
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

# Check status
sudo ufw status verbose
```

### Phase 6: Configure Auto-Start Services
```bash
# Create systemd service for AstraPilot
sudo tee /etc/systemd/system/astrapilot.service > /dev/null << 'EOF'
[Unit]
Description=AstraPilot Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/AstraPilot
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0
User=ubuntu
Group=docker

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable astrapilot.service
sudo systemctl start astrapilot.service

# Check service status
sudo systemctl status astrapilot.service
```

---

## 🌐 Application Access & Testing

### Access URLs
- **Frontend**: http://13.235.33.219:3000
- **Backend API**: http://13.235.33.219:8000
- **API Documentation**: http://13.235.33.219:8000/docs
- **Admin Panel**: http://13.235.33.219:8000/admin

### Test API Endpoints
```bash
# Health check
curl http://13.235.33.219:8000/health

# Register a test user
curl -X POST "http://13.235.33.219:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "username": "testuser"
  }'

# Check if OTP email was sent (check email)
# Then verify email with OTP
curl -X POST "http://13.235.33.219:8000/auth/verify-email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'

# Login after verification
curl -X POST "http://13.235.33.219:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

---

## 🔐 Security Best Practices

### 1. **SSH Security**
```bash
# Disable password authentication (use key-only)
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Change default SSH port (optional)
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sudo systemctl restart sshd
sudo ufw allow 2222/tcp
sudo ufw deny 22/tcp
```

### 2. **Database Security**
- ✅ Database is in private subnet (via RDS security group)
- ✅ Encryption at rest enabled
- ✅ Access only from EC2 security group
- ✅ Strong password configured

### 3. **Application Security**
```bash
# Set up log rotation
sudo tee /etc/logrotate.d/astrapilot > /dev/null << 'EOF'
/home/ubuntu/AstraPilot/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    sharedscripts
    postrotate
        docker-compose -f /home/ubuntu/AstraPilot/docker-compose.production.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF

# Set up automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. **Environment Variables Security**
```bash
# Secure environment files
sudo chown root:docker /home/ubuntu/AstraPilot/.env
sudo chmod 640 /home/ubuntu/AstraPilot/.env
sudo chown root:docker /home/ubuntu/AstraPilot/backend/.env
sudo chmod 640 /home/ubuntu/AstraPilot/backend/.env
```

---

## 📊 Monitoring & Backup

### CloudWatch Setup (Optional - Free Tier)
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure CloudWatch agent
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null << 'EOF'
{
    "metrics": {
        "namespace": "AstraPilot/Application",
        "metrics_collected": {
            "cpu": {
                "measurement": ["cpu_usage_idle", "cpu_usage_iowait"],
                "metrics_collection_interval": 300
            },
            "disk": {
                "measurement": ["used_percent"],
                "metrics_collection_interval": 300,
                "resources": ["*"]
            },
            "mem": {
                "measurement": ["mem_used_percent"],
                "metrics_collection_interval": 300
            }
        }
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/home/ubuntu/AstraPilot/logs/app.log",
                        "log_group_name": "AstraPilot/Application",
                        "log_stream_name": "{instance_id}/app.log"
                    }
                ]
            }
        }
    }
}
EOF

# Start CloudWatch agent
sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent
```

### Backup Strategy
```bash
# Create backup script
sudo tee /usr/local/bin/astrapilot-backup.sh > /dev/null << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/astrapilot-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/astrapilot-app-$DATE.tar.gz -C /home/ubuntu AstraPilot

# Backup database (if local)
docker-compose -f /home/ubuntu/AstraPilot/docker-compose.production.yml exec -T backend pg_dump \
    -h astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com \
    -U postgres \
    -d postgres > $BACKUP_DIR/astrapilot-db-$DATE.sql

# Compress database backup
gzip $BACKUP_DIR/astrapilot-db-$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

sudo chmod +x /usr/local/bin/astrapilot-backup.sh

# Set up cron job for daily backups
echo "0 2 * * * /usr/local/bin/astrapilot-backup.sh" | sudo crontab -
```

---

## 💰 Cost Optimization (AWS Free Tier)

### Current Usage Estimate
```yaml
Monthly Costs (AWS Free Tier):
  EC2 t2.micro: $0 (750 hours free)
  RDS db.t4g.micro: $0 (750 hours free)
  EBS Storage (30GB): $0 (30GB free)
  RDS Storage (20GB): $0 (20GB free)
  Data Transfer: $0 (15GB free)
  
Total Monthly Cost: $0 (within free tier limits)

Potential Additional Costs:
  ALB (if added): ~$16.20/month
  CloudWatch Logs: $0.50/GB (after 5GB free)
  S3 Storage: $0.023/GB (after 5GB free)
  Route 53 Hosted Zone: $0.50/month
```

### Free Tier Monitoring
```bash
# Set up billing alerts (via AWS CLI)
aws budgets create-budget \
    --account-id $(aws sts get-caller-identity --query Account --output text) \
    --budget '{
        "BudgetName": "AstraPilot-Free-Tier-Alert",
        "BudgetLimit": {
            "Amount": "1.00",
            "Unit": "USD"
        },
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST"
    }'
```

---

## 🆘 Troubleshooting

### Common Issues & Solutions

#### 1. **Can't Connect to EC2 Instance**
```bash
# Check security group allows SSH (port 22)
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Verify instance is running
aws ec2 describe-instances --instance-ids i-xxxxxxxxx

# Test connectivity
telnet 13.235.33.219 22
```

#### 2. **Database Connection Issues**
```bash
# Test from EC2 instance
psql -h astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com -U postgres -d postgres

# Check RDS security group allows PostgreSQL (port 5432) from EC2
aws ec2 describe-security-groups --group-ids sg-rds-xxxxxxxxx

# Verify RDS instance status
aws rds describe-db-instances --db-instance-identifier astrapilot
```

#### 3. **Docker Issues**
```bash
# Check Docker service
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check container status
docker-compose -f docker-compose.production.yml ps

# View container logs
docker-compose -f docker-compose.production.yml logs backend
docker-compose -f docker-compose.production.yml logs frontend
```

#### 4. **Email Not Sending**
```bash
# Test SMTP connection
telnet smtp.zoho.in 587

# Check backend logs for email errors
docker-compose -f docker-compose.production.yml logs backend | grep -i email

# Test email service manually
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
from app.services.email_service import send_email
asyncio.run(send_email('test@example.com', 'Test', 'Test email from AstraPilot'))
"
```

#### 5. **Application Not Accessible**
```bash
# Check if ports are open
sudo netstat -tlnp | grep -E ':(3000|8000)'

# Check firewall status
sudo ufw status

# Test local connectivity
curl http://localhost:3000
curl http://localhost:8000/health

# Check security groups allow ports 3000 and 8000
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
```

---

## 🚀 Additional Recommended Services

### 1. **Amazon S3** - File Storage
```bash
# Create S3 bucket for file uploads
aws s3 mb s3://astrapilot-files-$(date +%s)

# Set bucket policy for public read (if needed)
aws s3api put-bucket-policy \
    --bucket astrapilot-files-xxxx \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::astrapilot-files-xxxx/public/*"
            }
        ]
    }'
```

### 2. **Amazon CloudFront** - CDN (Optional)
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

### 3. **AWS Certificate Manager** - SSL Certificates
```bash
# Request SSL certificate
aws acm request-certificate \
    --domain-name yourdomain.com \
    --subject-alternative-names www.yourdomain.com \
    --validation-method DNS
```

### 4. **Amazon Route 53** - DNS Management
```bash
# Create hosted zone
aws route53 create-hosted-zone \
    --name yourdomain.com \
    --caller-reference $(date +%s)
```

### 5. **AWS Systems Manager** - Server Management
```bash
# Install SSM agent (usually pre-installed)
sudo snap install amazon-ssm-agent --classic
sudo systemctl start amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] AWS account created and configured
- [ ] EC2 instance launched (t2.micro)
- [ ] RDS PostgreSQL instance created (db.t4g.micro)
- [ ] Security groups configured properly
- [ ] SSH key pair created and configured
- [ ] Domain name configured (optional)

### Infrastructure Setup
- [ ] EC2 instance accessible via SSH
- [ ] Security groups allow necessary ports (22, 80, 443, 3000, 8000)
- [ ] RDS instance accessible from EC2
- [ ] VPC and subnets configured
- [ ] Internet Gateway attached

### Server Configuration
- [ ] System packages updated
- [ ] Docker and Docker Compose installed
- [ ] Git installed and repository cloned
- [ ] Environment variables configured
- [ ] Firewall (UFW) configured
- [ ] Log rotation configured

### Application Deployment
- [ ] Environment file created with correct credentials
- [ ] Docker Compose production file configured
- [ ] Application containers built and running
- [ ] Database tables created
- [ ] Health checks passing

### Testing & Verification
- [ ] Frontend accessible on port 3000
- [ ] Backend API accessible on port 8000
- [ ] API documentation accessible (/docs)
- [ ] User registration works with OTP email
- [ ] Email verification functional
- [ ] Login requires verified email
- [ ] Database connection working
- [ ] SMTP email sending working

### Security & Monitoring
- [ ] SSH configured with key-only authentication
- [ ] Firewall rules properly configured
- [ ] Environment variables secured
- [ ] SSL certificate configured (optional)
- [ ] CloudWatch monitoring setup (optional)
- [ ] Backup strategy implemented

### Production Readiness
- [ ] Auto-start service enabled
- [ ] Log management configured
- [ ] Error monitoring setup
- [ ] Performance monitoring active
- [ ] Security updates configured
- [ ] Backup and restore tested

---

## 🎉 Success!

Your AstraPilot application is now fully deployed on AWS Free Tier with:

- ✅ **Secure EC2 instance** with proper security groups
- ✅ **Managed PostgreSQL database** with encryption
- ✅ **Docker containerization** for easy management
- ✅ **Email verification system** with Zoho SMTP
- ✅ **Production-ready configuration** with monitoring
- ✅ **Cost-optimized** for AWS Free Tier
- ✅ **Auto-scaling ready** infrastructure

### Next Steps:
1. **Domain Setup**: Configure a custom domain with Route 53
2. **SSL Certificate**: Add HTTPS with AWS Certificate Manager
3. **CDN**: Set up CloudFront for better performance
4. **Monitoring**: Enhance monitoring with CloudWatch dashboards
5. **Backup**: Implement automated database backups to S3

---

## 📞 Support & Resources

### Documentation Links
- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [RDS User Guide](https://docs.aws.amazon.com/rds/)
- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

### Support Channels
- **AWS Support**: Use AWS Support Center for infrastructure issues
- **Application Issues**: Check logs and health endpoints
- **Email Issues**: Verify Zoho SMTP settings
- **Database Issues**: Check RDS monitoring and logs

---

**🚀 AstraPilot is now ready to dominate the SEO market on AWS!**

*Built with ❤️ for production-scale deployment on AWS Free Tier*