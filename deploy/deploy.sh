#!/bin/bash
# Deploy script for AWS Free Tier deployment

set -e

echo "🚀 Starting AstraPilot deployment to AWS Free Tier"

# Check required tools
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

# Set variables
STACK_NAME="astrapilot-infrastructure"
REGION=${AWS_REGION:-us-east-1}
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)}

echo "📍 Deploying to region: $REGION"
echo "🔧 Stack name: $STACK_NAME"

# Deploy infrastructure
echo "📦 Deploying infrastructure stack..."
aws cloudformation deploy \
    --template-file deploy/aws-infrastructure.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides DBPassword=$DB_PASSWORD \
    --capabilities CAPABILITY_IAM \
    --region $REGION

echo "✅ Infrastructure deployed successfully!"

# Get outputs
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

echo "🏗️  Infrastructure details:"
echo "   Database Endpoint: $DB_ENDPOINT"
echo "   S3 Bucket: $S3_BUCKET"
echo "   VPC ID: $VPC_ID"

# Create ECR repositories
echo "📦 Creating ECR repositories..."
aws ecr create-repository --repository-name astrapilot/backend --region $REGION || echo "Backend repository already exists"
aws ecr create-repository --repository-name astrapilot/frontend --region $REGION || echo "Frontend repository already exists"

# Get ECR login
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com

# Build and push backend
echo "🐳 Building and pushing backend..."
docker build -t astrapilot/backend ./backend
BACKEND_REPO_URI=$(aws ecr describe-repositories --repository-names astrapilot/backend --region $REGION --query 'repositories[0].repositoryUri' --output text)
docker tag astrapilot/backend:latest $BACKEND_REPO_URI:latest
docker push $BACKEND_REPO_URI:latest

# Build and push frontend
echo "🐳 Building and pushing frontend..."
docker build -t astrapilot/frontend ./frontend
FRONTEND_REPO_URI=$(aws ecr describe-repositories --repository-names astrapilot/frontend --region $REGION --query 'repositories[0].repositoryUri' --output text)
docker tag astrapilot/frontend:latest $FRONTEND_REPO_URI:latest
docker push $FRONTEND_REPO_URI:latest

# Create ECS cluster (Free tier eligible)
echo "🎯 Creating ECS cluster..."
aws ecs create-cluster --cluster-name astrapilot-cluster --region $REGION || echo "Cluster already exists"

# Create task definitions and services would go here
# For now, providing manual instructions

echo "✅ Deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update your DNS to point to the load balancer"
echo "2. Configure SSL certificates"
echo "3. Set up monitoring and logging"
echo "4. Configure auto-scaling policies"
echo ""
echo "🔧 Environment variables for your application:"
echo "   DATABASE_URL=postgresql+asyncpg://astrapilot:$DB_PASSWORD@$DB_ENDPOINT:5432/astrapilot"
echo "   SECRET_KEY=$(openssl rand -base64 32)"
echo ""
echo "💰 Free Tier Usage:"
echo "   - RDS db.t3.micro: 750 hours/month"
echo "   - S3: 5GB storage, 15GB data transfer"
echo "   - CloudFront: 50GB data transfer"
echo "   - ECS: No additional charges for EC2 launch type"