# AWS Deployment Guide for AstraPilot v2.0
## Ultra AI-Powered SEO Platform - Production Ready

> **Complete step-by-step guide for deploying AstraPilot on AWS Free Tier**

## 📋 Prerequisites

### 1. AWS Account Setup
- Create an AWS account at [aws.amazon.com](https://aws.amazon.com)
- Verify your email and add a payment method
- Enable AWS Free Tier benefits

### 2. Required Tools Installation

#### AWS CLI
```bash
# On Linux/macOS
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# On Windows (PowerShell)
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -Outfile "AWSCLIV2.msi"
Start-Process msiexec.exe -Wait -ArgumentList '/I AWSCLIV2.msi /quiet'

# Verify installation
aws --version
```

#### Docker
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# On Amazon Linux 2
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# On macOS
brew install docker docker-compose

# On Windows
# Download and install Docker Desktop from docker.com
```

#### Git
```bash
# On Linux
sudo apt install git  # Ubuntu/Debian
sudo yum install git  # CentOS/RHEL

# On macOS
brew install git

# On Windows
# Download from git-scm.com
```

### 3. AWS Configuration

#### Configure AWS CLI
```bash
aws configure
```

**Required Information:**
- **AWS Access Key ID**: Get from IAM console
- **AWS Secret Access Key**: Get from IAM console  
- **Default region name**: `us-east-1` (recommended for free tier)
- **Default output format**: `json`

#### Create EC2 Key Pair
```bash
# Create a new key pair for SSH access
aws ec2 create-key-pair \
    --key-name astrapilot-key \
    --region us-east-1 \
    --query 'KeyMaterial' \
    --output text > astrapilot-key.pem

# Set proper permissions
chmod 400 astrapilot-key.pem
```

### 4. OpenAI API Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and save the key securely

## 🚀 Deployment Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/sanjayjakhar33/AstraPilot.git
cd AstraPilot
```

### Step 2: Set Environment Variables
```bash
# Required environment variables
export OPENAI_API_KEY="your-openai-api-key-here"
export KEY_PAIR_NAME="astrapilot-key"
export AWS_REGION="us-east-1"
export ENVIRONMENT="production"

# Optional variables
export DOMAIN_NAME="yourdomain.com"  # Leave empty to use ALB DNS
export STACK_NAME="astrapilot-v2-production"
```

### Step 3: Run Enhanced Deployment Script
```bash
./deploy/deploy-enhanced.sh
```

**Expected Output:**
```
🚀 Starting AstraPilot v2.0 deployment to AWS Free Tier
Ultra AI-Powered SEO Platform - Production Ready

⚙️ Checking required tools...
✅ All required tools are available

🤖 Validating OpenAI API key...
✅ OpenAI API key is valid

⚙️ Running pre-deployment checks...
✅ Pre-deployment checks passed

☁️ Deploying infrastructure stack...
✅ Infrastructure stack deployed successfully
```

### Step 4: Monitor Deployment Progress
The script will:
1. ✅ Deploy AWS infrastructure (VPC, subnets, security groups, RDS, S3, CloudFront, ALB)
2. ✅ Create ECR repositories for Docker images
3. ✅ Build and push backend Docker container
4. ✅ Build and push frontend Docker container
5. ✅ Launch EC2 instances via Auto Scaling Group
6. ✅ Configure load balancer and health checks

**Deployment time**: 15-20 minutes

### Step 5: Verify Deployment
After successful deployment, you'll see:

```
✅ Deployment completed successfully!

🚀 AstraPilot v2.0 - Ultra AI-Powered SEO Platform
Production Deployment Summary:

🌐 Application URLs:
  Frontend: http://astrapilot-v2-production-alb-123456789.us-east-1.elb.amazonaws.com
  API: http://astrapilot-v2-production-alb-123456789.us-east-1.elb.amazonaws.com/api/v1
  API Docs: http://astrapilot-v2-production-alb-123456789.us-east-1.elb.amazonaws.com/docs
  Health Check: http://astrapilot-v2-production-alb-123456789.us-east-1.elb.amazonaws.com/health
  WebSocket: ws://astrapilot-v2-production-alb-123456789.us-east-1.elb.amazonaws.com/ws/realtime

☁️ Infrastructure:
  CloudFront CDN: https://d1234567890.cloudfront.net
  S3 Bucket: astrapilot-v2-production-assets-123456789012
  Database: astrapilot-v2-production-postgres-db.xyz.us-east-1.rds.amazonaws.com
  Region: us-east-1
```

## 🔧 Post-Deployment Configuration

### 1. DNS Setup (Optional)
If you have a custom domain:

```bash
# Create Route 53 hosted zone
aws route53 create-hosted-zone \
    --name yourdomain.com \
    --caller-reference $(date +%s)

# Create A record pointing to ALB
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1234567890 \
    --change-batch file://dns-record.json
```

### 2. SSL Certificate Setup
```bash
# Request ACM certificate
aws acm request-certificate \
    --domain-name yourdomain.com \
    --subject-alternative-names www.yourdomain.com \
    --validation-method DNS \
    --region us-east-1

# Update ALB listener to use HTTPS
aws elbv2 modify-listener \
    --listener-arn arn:aws:elasticloadbalancing:... \
    --certificates CertificateArn=arn:aws:acm:...
```

### 3. Monitoring Setup
```bash
# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
    --alarm-name "AstraPilot-HighCPU" \
    --alarm-description "High CPU utilization" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold
```

## 🔍 Accessing Your Application

### Frontend Access
Open your browser and navigate to the ALB DNS name provided in the deployment output.

### API Documentation
Visit `/docs` endpoint for interactive API documentation (Swagger UI).

### Database Access
Connect using the provided database endpoint:
```bash
psql -h astrapilot-v2-production-postgres-db.xyz.us-east-1.rds.amazonaws.com \
     -U astrapilot \
     -d astrapilot \
     -p 5432
```

### SSH Access to EC2 Instances
```bash
# Get instance IDs
aws autoscaling describe-auto-scaling-groups \
    --auto-scaling-group-names astrapilot-v2-production-ASG \
    --query 'AutoScalingGroups[0].Instances[].InstanceId'

# SSH to instance
ssh -i astrapilot-key.pem ec2-user@<instance-public-ip>
```

## 📊 Monitoring and Logs

### CloudWatch Logs
- Application logs: `/aws/ec2/astrapilot`
- Database logs: `/aws/rds/instance/astrapilot-v2-production-postgres-db/postgresql`

### Health Checks
- Frontend: `http://<alb-dns>/`
- Backend: `http://<alb-dns>/health`
- Database: Monitored via RDS CloudWatch metrics

### Performance Monitoring
- CPU Utilization: EC2 instances
- Memory Usage: CloudWatch agent
- Database Performance: RDS Performance Insights
- Load Balancer Metrics: Target group health

## 💰 Cost Optimization

### Free Tier Limits
- **EC2**: 750 hours/month of t2.micro instances
- **RDS**: 750 hours/month of db.t3.micro
- **S3**: 5GB storage + 15GB data transfer
- **CloudFront**: 50GB data transfer
- **Data Transfer**: 15GB out per month

### Cost Monitoring
```bash
# Enable cost monitoring
aws budgets create-budget \
    --account-id $(aws sts get-caller-identity --query Account --output text) \
    --budget file://budget.json
```

### Auto Scaling Configuration
The deployment includes cost-optimized auto scaling:
- **Min instances**: 1
- **Max instances**: 2
- **Desired capacity**: 1

## 🛠️ Troubleshooting

### Common Issues

#### 1. Deployment Fails
```bash
# Check CloudFormation events
aws cloudformation describe-stack-events \
    --stack-name astrapilot-v2-production

# Check logs
aws logs describe-log-groups
aws logs get-log-events --log-group-name /aws/cloudformation/...
```

#### 2. Application Not Accessible
```bash
# Check target group health
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:...

# Check security groups
aws ec2 describe-security-groups \
    --group-ids sg-1234567890
```

#### 3. Database Connection Issues
```bash
# Test database connectivity
telnet <db-endpoint> 5432

# Check security group rules
aws ec2 describe-security-groups \
    --group-ids <rds-security-group-id>
```

#### 4. Docker Container Issues
```bash
# SSH to EC2 instance
ssh -i astrapilot-key.pem ec2-user@<instance-ip>

# Check container status
docker ps -a
docker logs <container-id>

# Restart containers
docker-compose -f docker-compose.prod.yml restart
```

### Log Analysis
```bash
# View application logs
docker logs astrapilot_backend_1
docker logs astrapilot_frontend_1

# CloudWatch logs
aws logs filter-log-events \
    --log-group-name /aws/ec2/astrapilot \
    --start-time $(date -d '1 hour ago' +%s)000
```

## 🔄 Updates and Scaling

### Application Updates
```bash
# Update application code
git pull origin main

# Rebuild and redeploy
./deploy/deploy-enhanced.sh
```

### Scaling
```bash
# Update Auto Scaling Group
aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name astrapilot-v2-production-ASG \
    --min-size 2 \
    --max-size 4 \
    --desired-capacity 2
```

### Database Scaling
```bash
# Modify RDS instance
aws rds modify-db-instance \
    --db-instance-identifier astrapilot-v2-production-postgres-db \
    --allocated-storage 40 \
    --apply-immediately
```

## 🔐 Security Best Practices

### 1. Security Group Rules
- Only allow necessary ports (80, 443, 22)
- Restrict SSH access to specific IP ranges
- Use security group references instead of CIDR blocks

### 2. IAM Roles
- Use least privilege principle
- Create specific roles for each service
- Enable CloudTrail for API logging

### 3. Secrets Management
- Use AWS Secrets Manager for sensitive data
- Rotate secrets regularly
- Enable encryption at rest

### 4. Network Security
- Use private subnets for database and application
- Enable VPC Flow Logs
- Configure NACLs for additional security

## 📞 Support

### Getting Help
- **GitHub Issues**: [Create an issue](https://github.com/sanjayjakhar33/AstraPilot/issues)
- **AWS Support**: Use AWS Support Center for infrastructure issues
- **OpenAI Support**: Check OpenAI documentation for AI-related issues

### Useful AWS Resources
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Cost Calculator](https://calculator.aws/)

---

## ✅ Deployment Checklist

- [ ] AWS account created and verified
- [ ] AWS CLI installed and configured
- [ ] Docker installed and running
- [ ] Git installed
- [ ] OpenAI API key obtained
- [ ] EC2 key pair created
- [ ] Environment variables set
- [ ] Repository cloned
- [ ] Deployment script executed
- [ ] Application accessible via ALB DNS
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] SSL certificate requested (if using custom domain)
- [ ] DNS configured (if using custom domain)

**🎉 Congratulations! Your ultra AI-powered SEO platform is now live and ready to dominate search rankings!**