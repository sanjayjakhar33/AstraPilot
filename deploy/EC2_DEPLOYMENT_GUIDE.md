# AstraPilot - Simple AWS EC2 Deployment Guide

## 🚀 Ready-to-Deploy Configuration

This guide will help you deploy AstraPilot on your AWS EC2 instance with the provided infrastructure.

### 📋 Prerequisites

Your AWS infrastructure is already set up:
- **EC2 Instance**: `13.234.117.175`
- **PostgreSQL RDS**: `astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com`
- **Email SMTP**: Zoho configured with `info@astranetix.in`

### 🔧 Step-by-Step Deployment

#### Step 1: Connect to Your EC2 Instance

```bash
# Replace 'your-key.pem' with your actual SSH key file
ssh -i your-key.pem ec2-user@13.234.117.175
```

#### Step 2: Install Required Software

```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git

# Logout and login again for docker group to take effect
exit
```

#### Step 3: Clone and Deploy AstraPilot

```bash
# Reconnect to EC2
ssh -i your-key.pem ec2-user@13.234.117.175

# Clone the repository
git clone https://github.com/sanjayjakhar33/AstraPilot.git
cd AstraPilot

# Copy production environment configuration
cp .env.production .env

# Build and start the application
docker-compose -f docker-compose.production.yml up -d --build
```

#### Step 4: Verify Deployment

```bash
# Check if containers are running
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f

# Test the API
curl http://localhost:8000/docs
```

### 🌐 Access Your Application

- **Frontend**: `http://13.234.117.175:3000`
- **Backend API**: `http://13.234.117.175:8000`
- **API Documentation**: `http://13.234.117.175:8000/docs`

### 🔐 Authentication Flow

1. **Register**: Users register with email
2. **OTP Email**: Automatic OTP sent to user's email via Zoho SMTP
3. **Verify**: Users enter OTP to verify email
4. **Login**: Only verified users can login

### 📧 Email Configuration

The system is pre-configured with:
- **SMTP Server**: `smtp.zoho.in`
- **Email**: `info@astranetix.in`
- **Authentication**: Configured with provided credentials

### 🗄️ Database Information

- **Type**: PostgreSQL 17.4
- **Endpoint**: `astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres`

### 🔧 Maintenance Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs

# Restart services
docker-compose -f docker-compose.production.yml restart

# Update application
git pull
docker-compose -f docker-compose.production.yml up -d --build

# Stop services
docker-compose -f docker-compose.production.yml down
```

### 🛡️ Security Considerations

1. **SSH Key**: Keep your SSH key secure
2. **Database**: RDS instance has encryption enabled
3. **Environment Variables**: Never commit real credentials to git
4. **Firewall**: Ensure only necessary ports are open

### 🎯 API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (requires verified email)
- `POST /auth/verify-email` - Verify email with OTP
- `POST /auth/resend-otp` - Resend OTP code

#### Example Registration Flow

```bash
# 1. Register user
curl -X POST "http://13.234.117.175:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "user@example.com", "password": "securepassword"}'

# Response: {"message": "User registered successfully. Please check your email for verification code.", "user_id": 1, "email_verified": false}

# 2. User receives OTP via email

# 3. Verify email
curl -X POST "http://13.234.117.175:8000/auth/verify-email" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "otp_code": "123456"}'

# 4. Login
curl -X POST "http://13.234.117.175:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepassword"
```

### ✅ Verification Checklist

- [ ] EC2 instance accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] AstraPilot cloned and running
- [ ] Frontend accessible on port 3000
- [ ] Backend API accessible on port 8000
- [ ] User registration sends OTP emails
- [ ] Email verification works
- [ ] Login requires verified email

### 🆘 Troubleshooting

1. **Can't connect to EC2**: Check security group settings
2. **Database connection issues**: Verify RDS security group allows EC2 access
3. **Email not sending**: Check SMTP credentials and Zoho settings
4. **Docker issues**: Ensure user is in docker group

### 📞 Support

Your AstraPilot deployment is now ready for production use with full OTP email verification!