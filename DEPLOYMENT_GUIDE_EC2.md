# AstraPilot - Complete AWS EC2 Deployment Guide

## 🚀 Production-Ready Deployment on AWS Free Tier

### Your Configuration Summary
- **EC2 Instance IP**: `13.235.33.219`
- **Database**: PostgreSQL RDS (astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com)
- **Email**: Zoho SMTP (info@astranetix.in)
- **OpenAI**: Configured with provided API key
- **Frontend**: React.js on port 3000
- **Backend**: FastAPI on port 8000

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Connect to Your EC2 Instance

```bash
# Connect via SSH (replace with your key file)
ssh -i your-key.pem ubuntu@13.235.33.219

# Or if using password authentication
ssh ubuntu@13.235.33.219
```

### Step 2: Update System and Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl nginx docker.io docker-compose nodejs npm

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Python 3.9+
sudo apt install -y python3.9 python3.9-venv python3.9-dev python3-pip
```

### Step 3: Clone AstraPilot Repository

```bash
# Clone the repository
cd /home/ubuntu
git clone https://github.com/sanjayjakhar33/AstraPilot.git
cd AstraPilot

# Set permissions
chmod +x scripts/*.sh 2>/dev/null || true
```

### Step 4: Set Up Environment Variables

```bash
# Create .env file with production settings
cat > .env << 'EOF'
# Production Environment Variables for AstraPilot

# Database Configuration (Your PostgreSQL RDS)
DATABASE_URL=postgresql+asyncpg://postgres:bSghl^seBJyv697FyjBM#Z*1y@astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com:5432/astrapilot

# Application Security
SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready

# Email Configuration (Zoho SMTP)
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_USERNAME=info@astranetix.in
SMTP_PASSWORD=8k6UW8zPfU3g
SMTP_FROM_EMAIL=info@astranetix.in

# OTP Configuration
OTP_EXPIRE_MINUTES=10

# OpenAI API Key for AI features
OPENAI_API_KEY=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

# Admin Configuration
ADMIN_EMAIL=admin@astranetix.in
ADMIN_USERNAME=admin
EOF

# Copy .env to backend directory
cp .env backend/.env
```

### Step 5: Create Production Docker Compose

```bash
# Create production docker-compose.yml
cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:bSghl^seBJyv697FyjBM#Z*1y@astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com:5432/astrapilot
      - SECRET_KEY=astrapilot-ultra-secure-key-2024-production-ready
      - SMTP_HOST=smtp.zoho.in
      - SMTP_PORT=587
      - SMTP_USERNAME=info@astranetix.in
      - SMTP_PASSWORD=8k6UW8zPfU3g
      - SMTP_FROM_EMAIL=info@astranetix.in
      - OTP_EXPIRE_MINUTES=10
      - OPENAI_API_KEY=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
      - ADMIN_EMAIL=admin@astranetix.in
      - ADMIN_USERNAME=admin
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://13.235.33.219:8000
      - REACT_APP_WS_URL=ws://13.235.33.219:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm start
    restart: always
    depends_on:
      - backend

networks:
  default:
    name: astrapilot-network
EOF
```

### Step 6: Create Backend Dockerfile (if not exists)

```bash
# Create backend Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF
```

### Step 7: Create Frontend Dockerfile (if not exists)

```bash
# Create frontend Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
EOF
```

### Step 8: Build and Deploy Application

```bash
# Build and start services
docker-compose -f docker-compose.production.yml up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
docker-compose -f docker-compose.production.yml ps
```

### Step 9: Initialize Database and Create Admin User

```bash
# Enter backend container to initialize database
docker-compose -f docker-compose.production.yml exec backend python app/database_init.py

# Or run directly if needed
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
from app.database_init import initialize_database
asyncio.run(initialize_database())
"
```

### Step 10: Configure Nginx (Optional - for production)

```bash
# Install and configure Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/astrapilot << 'EOF'
server {
    listen 80;
    server_name 13.235.33.219;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend direct access
    location /docs {
        proxy_pass http://localhost:8000;
    }

    location /admin {
        proxy_pass http://localhost:8000;
    }

    # WebSocket support
    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/astrapilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 11: Configure Firewall and Security Groups

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 3000/tcp   # Frontend
sudo ufw allow 8000/tcp   # Backend
sudo ufw --force enable
```

**AWS Security Group Settings:**
- Port 22 (SSH): Your IP only
- Port 80 (HTTP): 0.0.0.0/0
- Port 3000 (Frontend): 0.0.0.0/0
- Port 8000 (Backend): 0.0.0.0/0

### Step 12: Set Up Auto-Start on Boot

```bash
# Create systemd service for auto-start
sudo tee /etc/systemd/system/astrapilot.service << 'EOF'
[Unit]
Description=AstraPilot Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/AstraPilot
ExecStart=/usr/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.production.yml down
User=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable service
sudo systemctl enable astrapilot.service
sudo systemctl start astrapilot.service
```

---

## 🌐 Access Your Application

Once deployment is complete, you can access:

- **Frontend**: `http://13.235.33.219:3000`
- **Backend API**: `http://13.235.33.219:8000`
- **API Documentation**: `http://13.235.33.219:8000/docs`
- **Admin Dashboard**: `http://13.235.33.219:8000/admin/dashboard/overview`

### 👑 Admin Access

**Default Admin Credentials:**
- Username: `admin`
- Email: `admin@astranetix.in` 
- Password: `admin123` (⚠️ Change this immediately!)

**Admin Endpoints:**
- Dashboard Overview: `/admin/dashboard/overview`
- User Management: `/admin/users`
- Payment Management: `/admin/payments`
- System Health: `/admin/system/health`
- Revenue Analytics: `/admin/analytics/revenue`

---

## 🔐 Authentication Flow

### 1. User Registration
```bash
curl -X POST "http://13.235.33.219:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser", 
    "email": "user@example.com", 
    "password": "securepassword"
  }'
```

### 2. Email OTP Verification
- User receives OTP via Zoho SMTP
- Verify with: `POST /auth/verify-email`

### 3. Login (Only After Email Verification)
```bash
curl -X POST "http://13.235.33.219:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepassword"
```

---

## 📊 Monitoring and Maintenance

### Check Application Status
```bash
# Check Docker containers
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Check system resources
htop
df -h
free -h
```

### Database Health Check
```bash
# Test database connection
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
from app.database import async_session
async def test_db():
    async with async_session() as session:
        result = await session.execute('SELECT 1')
        print('Database connection: OK')
asyncio.run(test_db())
"
```

### Email Service Test
```bash
# Test email sending
docker-compose -f docker-compose.production.yml exec backend python -c "
import asyncio
from app.services.otp_service import send_email
asyncio.run(send_email(
    'test@example.com', 
    'Test Email', 
    'This is a test email from AstraPilot'
))
"
```

---

## 🔄 Updates and Maintenance

### Update Application
```bash
cd /home/ubuntu/AstraPilot
git pull origin main
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up --build -d
```

### Backup Database
```bash
# Create database backup
pg_dump -h astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com \
        -U postgres \
        -d astrapilot \
        -f backup_$(date +%Y%m%d).sql
```

### Monitor Logs
```bash
# Real-time logs
docker-compose -f docker-compose.production.yml logs -f

# Backend only
docker-compose -f docker-compose.production.yml logs -f backend

# Frontend only  
docker-compose -f docker-compose.production.yml logs -f frontend
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Can't connect to database**
   - Check RDS security group allows EC2 access
   - Verify database credentials in .env file

2. **Email not sending**
   - Check SMTP credentials
   - Verify Zoho settings allow app passwords

3. **Docker permission errors**
   - Ensure user is in docker group: `sudo usermod -aG docker $USER`
   - Logout and login again

4. **Port already in use**
   - Check what's using the port: `sudo netstat -tlnp | grep :8000`
   - Stop conflicting services

5. **Frontend can't reach backend**
   - Check CORS settings in backend/app/main.py
   - Verify API URLs in frontend configuration

### Performance Optimization

```bash
# Optimize Docker images
docker system prune -f

# Monitor resources
docker stats

# Check disk usage
du -sh /home/ubuntu/AstraPilot
```

---

## ✅ Deployment Checklist

- [ ] EC2 instance accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] AstraPilot repository cloned
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Application containers running
- [ ] Frontend accessible on port 3000
- [ ] Backend API accessible on port 8000
- [ ] Admin dashboard functional
- [ ] User registration with OTP working
- [ ] Email verification operational
- [ ] Login requires verified email
- [ ] Nginx configured (optional)
- [ ] Firewall rules set
- [ ] Auto-start service enabled
- [ ] Monitoring set up

---

## 🎉 Success! 

Your AstraPilot application is now live and ready for production use with:

✅ **Full OTP Email Verification**  
✅ **Comprehensive Admin Dashboard**  
✅ **AI-Powered SEO Analysis**  
✅ **PostgreSQL Database**  
✅ **Production-Ready Configuration**  
✅ **Auto-Start on Boot**  
✅ **Health Monitoring**  

**Your live application URLs:**
- Frontend: http://13.235.33.219:3000
- Backend: http://13.235.33.219:8000
- API Docs: http://13.235.33.219:8000/docs
- Admin Panel: http://13.235.33.219:8000/admin/dashboard/overview

**Remember to:**
1. Change admin password immediately
2. Set up SSL certificate for production
3. Configure regular backups
4. Monitor application performance
5. Keep system updated

🚀 **AstraPilot is now ready to dominate the SEO market!**