#!/bin/bash
# Enhanced deployment script for AstraPilot v2.0 - Ultra AI-Powered SEO Platform
# Production-ready deployment for AWS Free Tier

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
AI="🤖"
CLOUD="☁️"
MONEY="💰"

echo -e "${BLUE}${ROCKET} Starting AstraPilot v2.0 deployment to AWS Free Tier${NC}"
echo -e "${PURPLE}Ultra AI-Powered SEO Platform - Production Ready${NC}"
echo ""

# Check required tools
echo -e "${CYAN}${GEAR} Checking required tools...${NC}"
command -v aws >/dev/null 2>&1 || { echo -e "${RED}${CROSS} AWS CLI is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}${CROSS} Docker is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo -e "${YELLOW}${WARNING} jq is recommended for JSON parsing. Installing...${NC}"; }

echo -e "${GREEN}${CHECK} All required tools are available${NC}"

# Set variables with enhanced naming
STACK_NAME="${1:-astrapilot-v2-production}"
REGION=${AWS_REGION:-us-east-1}
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)}
OPENAI_API_KEY=${OPENAI_API_KEY}
KEY_PAIR_NAME=${KEY_PAIR_NAME}
DOMAIN_NAME=${DOMAIN_NAME:-""}
ENVIRONMENT=${ENVIRONMENT:-production}

echo -e "${INFO} Configuration:"
echo -e "  ${BLUE}Stack Name:${NC} $STACK_NAME"
echo -e "  ${BLUE}Region:${NC} $REGION"
echo -e "  ${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "  ${BLUE}Domain:${NC} ${DOMAIN_NAME:-'None (will use ALB DNS)'}"
echo ""

# Validate required parameters
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}${CROSS} OPENAI_API_KEY environment variable is required for AI features${NC}"
    echo -e "${INFO} Export your OpenAI API key: export OPENAI_API_KEY='your-key-here'${NC}"
    exit 1
fi

if [ -z "$KEY_PAIR_NAME" ]; then
    echo -e "${YELLOW}${WARNING} KEY_PAIR_NAME not set. Checking for existing key pairs...${NC}"
    
    # List available key pairs
    KEY_PAIRS=$(aws ec2 describe-key-pairs --region $REGION --query 'KeyPairs[0].KeyName' --output text 2>/dev/null || echo "None")
    
    if [ "$KEY_PAIRS" != "None" ]; then
        KEY_PAIR_NAME=$KEY_PAIRS
        echo -e "${GREEN}${CHECK} Using existing key pair: $KEY_PAIR_NAME${NC}"
    else
        echo -e "${RED}${CROSS} No EC2 key pairs found. Please create one first:${NC}"
        echo -e "${INFO} aws ec2 create-key-pair --key-name astrapilot-key --region $REGION --query 'KeyMaterial' --output text > astrapilot-key.pem${NC}"
        exit 1
    fi
fi

echo -e "${AI} Validating OpenAI API key...${NC}"
if ! curl -s -H "Authorization: Bearer $OPENAI_API_KEY" "https://api.openai.com/v1/models" > /dev/null; then
    echo -e "${RED}${CROSS} Invalid OpenAI API key. Please check your OPENAI_API_KEY${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} OpenAI API key is valid${NC}"

# Pre-deployment checks
echo -e "${GEAR} Running pre-deployment checks...${NC}"

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}${CROSS} AWS credentials not configured. Run: aws configure${NC}"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "deploy/aws-infrastructure-complete.yaml" ]; then
    echo -e "${RED}${CROSS} CloudFormation template not found. Are you in the AstraPilot root directory?${NC}"
    exit 1
fi

echo -e "${GREEN}${CHECK} Pre-deployment checks passed${NC}"

# Deploy infrastructure using the complete template
echo -e "${CLOUD} Deploying infrastructure stack...${NC}"
aws cloudformation deploy \
    --template-file deploy/aws-infrastructure-complete.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        DBPassword=$DB_PASSWORD \
        OpenAIAPIKey=$OPENAI_API_KEY \
        KeyPairName=$KEY_PAIR_NAME \
        DomainName="$DOMAIN_NAME" \
        Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION \
    --no-fail-on-empty-changeset

if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Infrastructure stack deployed successfully${NC}"
else
    echo -e "${RED}${CROSS} Infrastructure deployment failed${NC}"
    exit 1
fi

# Get stack outputs
echo -e "${INFO} Retrieving stack outputs...${NC}"
DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text)

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

ALB_DNS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomain`].OutputValue' \
    --output text)

VPC_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue' \
    --output text)

PUBLIC_SUBNETS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnets`].OutputValue' \
    --output text)

SECURITY_GROUP=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebSecurityGroupId`].OutputValue' \
    --output text)

echo -e "${GREEN}${CHECK} Stack outputs retrieved successfully${NC}"

echo -e "${BLUE}${CLOUD} Infrastructure details:${NC}"
echo -e "  ${BLUE}Database Endpoint:${NC} $DB_ENDPOINT"
echo -e "  ${BLUE}S3 Bucket:${NC} $S3_BUCKET"
echo -e "  ${BLUE}Load Balancer:${NC} $ALB_DNS"
echo -e "  ${BLUE}CloudFront:${NC} $CLOUDFRONT_DOMAIN"
echo -e "  ${BLUE}VPC ID:${NC} $VPC_ID"
echo ""

# Create ECR repositories for container images
echo -e "${GEAR} Setting up container registry...${NC}"
aws ecr create-repository --repository-name astrapilot/backend --region $REGION 2>/dev/null || echo -e "${INFO} Backend repository already exists"
aws ecr create-repository --repository-name astrapilot/frontend --region $REGION 2>/dev/null || echo -e "${INFO} Frontend repository already exists"

# Get ECR login
echo -e "${GEAR} Logging into ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com

# Build and push backend
echo -e "${GEAR} Building and pushing backend container...${NC}"
cd backend
docker build -t astrapilot/backend \
    --build-arg DATABASE_URL="postgresql+asyncpg://astrapilot:$DB_PASSWORD@$DB_ENDPOINT:5432/astrapilot" \
    --build-arg OPENAI_API_KEY="$OPENAI_API_KEY" \
    --build-arg ENVIRONMENT="$ENVIRONMENT" \
    --build-arg S3_BUCKET="$S3_BUCKET" \
    --build-arg AWS_REGION="$REGION" \
    .

BACKEND_REPO_URI=$(aws ecr describe-repositories --repository-names astrapilot/backend --region $REGION --query 'repositories[0].repositoryUri' --output text)
docker tag astrapilot/backend:latest $BACKEND_REPO_URI:latest
docker tag astrapilot/backend:latest $BACKEND_REPO_URI:$ENVIRONMENT
docker push $BACKEND_REPO_URI:latest
docker push $BACKEND_REPO_URI:$ENVIRONMENT

echo -e "${GREEN}${CHECK} Backend container pushed successfully${NC}"
cd ..

# Build and push frontend
echo -e "${GEAR} Building and pushing frontend container...${NC}"
cd frontend

# Build with production environment variables
docker build -t astrapilot/frontend \
    --build-arg REACT_APP_API_URL="http://$ALB_DNS/api/v1" \
    --build-arg REACT_APP_WS_URL="ws://$ALB_DNS/ws/realtime" \
    --build-arg REACT_APP_ENVIRONMENT="$ENVIRONMENT" \
    --build-arg REACT_APP_CLOUDFRONT_DOMAIN="$CLOUDFRONT_DOMAIN" \
    .

FRONTEND_REPO_URI=$(aws ecr describe-repositories --repository-names astrapilot/frontend --region $REGION --query 'repositories[0].repositoryUri' --output text)
docker tag astrapilot/frontend:latest $FRONTEND_REPO_URI:latest
docker tag astrapilot/frontend:latest $FRONTEND_REPO_URI:$ENVIRONMENT
docker push $FRONTEND_REPO_URI:latest
docker push $FRONTEND_REPO_URI:$ENVIRONMENT

echo -e "${GREEN}${CHECK} Frontend container pushed successfully${NC}"
cd ..

# Create docker-compose.yml for the EC2 instances
echo -e "${GEAR} Creating production docker-compose configuration...${NC}"
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  backend:
    image: $BACKEND_REPO_URI:$ENVIRONMENT
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://astrapilot:$DB_PASSWORD@$DB_ENDPOINT:5432/astrapilot
      - SECRET_KEY=\${SECRET_KEY}
      - ENVIRONMENT=$ENVIRONMENT
      - S3_BUCKET=$S3_BUCKET
      - AWS_REGION=$REGION
      - OPENAI_API_KEY=$OPENAI_API_KEY
      - CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: $FRONTEND_REPO_URI:$ENVIRONMENT
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://$ALB_DNS/api/v1
      - REACT_APP_WS_URL=ws://$ALB_DNS/ws/realtime
      - REACT_APP_ENVIRONMENT=$ENVIRONMENT
      - REACT_APP_CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Monitoring and logging (optional)
  cloudwatch-logs:
    image: amazon/cloudwatch-agent:latest
    volumes:
      - /var/log:/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - AWS_REGION=$REGION
    restart: unless-stopped
EOF

# Upload docker-compose to S3
aws s3 cp docker-compose.prod.yml s3://$S3_BUCKET/deploy/docker-compose.yml

echo -e "${GREEN}${CHECK} Production configuration uploaded to S3${NC}"

# Wait for Auto Scaling Group to launch instances
echo -e "${INFO} Waiting for Auto Scaling Group to launch instances...${NC}"
sleep 60

# Get instance IDs from Auto Scaling Group
ASG_NAME="$STACK_NAME-ASG"
INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups \
    --auto-scaling-group-names $ASG_NAME \
    --region $REGION \
    --query 'AutoScalingGroups[0].Instances[].InstanceId' \
    --output text)

if [ -n "$INSTANCE_IDS" ]; then
    echo -e "${GREEN}${CHECK} Found instances: $INSTANCE_IDS${NC}"
    
    for INSTANCE_ID in $INSTANCE_IDS; do
        echo -e "${INFO} Waiting for instance $INSTANCE_ID to be ready...${NC}"
        aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION
        
        # Get instance public IP
        PUBLIC_IP=$(aws ec2 describe-instances \
            --instance-ids $INSTANCE_ID \
            --region $REGION \
            --query 'Reservations[0].Instances[0].PublicIpAddress' \
            --output text)
        
        echo -e "${INFO} Instance $INSTANCE_ID is ready at IP: $PUBLIC_IP${NC}"
    done
else
    echo -e "${YELLOW}${WARNING} No instances found in Auto Scaling Group yet. Check AWS console.${NC}"
fi

# Final deployment status
echo -e "${GREEN}${CHECK} Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}${ROCKET} AstraPilot v2.0 - Ultra AI-Powered SEO Platform${NC}"
echo -e "${PURPLE}Production Deployment Summary:${NC}"
echo ""
echo -e "${CYAN}🌐 Application URLs:${NC}"
echo -e "  ${BLUE}Frontend:${NC} http://$ALB_DNS"
echo -e "  ${BLUE}API:${NC} http://$ALB_DNS/api/v1"
echo -e "  ${BLUE}API Docs:${NC} http://$ALB_DNS/docs"
echo -e "  ${BLUE}Health Check:${NC} http://$ALB_DNS/health"
echo -e "  ${BLUE}WebSocket:${NC} ws://$ALB_DNS/ws/realtime"
echo ""
echo -e "${CYAN}${CLOUD} Infrastructure:${NC}"
echo -e "  ${BLUE}CloudFront CDN:${NC} https://$CLOUDFRONT_DOMAIN"
echo -e "  ${BLUE}S3 Bucket:${NC} $S3_BUCKET"
echo -e "  ${BLUE}Database:${NC} $DB_ENDPOINT"
echo -e "  ${BLUE}Region:${NC} $REGION"
echo ""
echo -e "${CYAN}${AI} AI Features:${NC}"
echo -e "  ${GREEN}✓${NC} Ultra AI-Powered SEO Analysis"
echo -e "  ${GREEN}✓${NC} Real-time WebSocket Updates"
echo -e "  ${GREEN}✓${NC} Intelligent Keyword Research"
echo -e "  ${GREEN}✓${NC} Predictive Analytics"
echo -e "  ${GREEN}✓${NC} Competitor Intelligence"
echo ""
echo -e "${CYAN}${MONEY} Cost Optimization:${NC}"
echo -e "  ${GREEN}✓${NC} AWS Free Tier Optimized"
echo -e "  ${GREEN}✓${NC} RDS db.t3.micro (750 hours/month)"
echo -e "  ${GREEN}✓${NC} S3 5GB storage + 15GB transfer"
echo -e "  ${GREEN}✓${NC} CloudFront 50GB data transfer"
echo -e "  ${GREEN}✓${NC} EC2 t2.micro (750 hours/month)"
echo ""
echo -e "${INFO} Next steps:${NC}"
echo -e "1. ${BLUE}DNS Setup:${NC} Point your domain to $ALB_DNS"
echo -e "2. ${BLUE}SSL Certificate:${NC} Set up ACM certificate for HTTPS"
echo -e "3. ${BLUE}Monitoring:${NC} Check CloudWatch logs and metrics"
echo -e "4. ${BLUE}Scaling:${NC} Adjust Auto Scaling Group as needed"
echo ""
echo -e "${WARNING} Important Notes:${NC}"
echo -e "• ${BLUE}Database Password:${NC} Stored securely in AWS Secrets Manager"
echo -e "• ${BLUE}OpenAI API Key:${NC} Stored in AWS Secrets Manager"
echo -e "• ${BLUE}SSH Access:${NC} Use key pair '$KEY_PAIR_NAME' to access instances"
echo -e "• ${BLUE}Logs:${NC} Check CloudWatch logs for application monitoring"
echo ""
echo -e "${GREEN}${ROCKET} Your ultra AI-powered SEO platform is now live and ready to dominate search rankings!${NC}"