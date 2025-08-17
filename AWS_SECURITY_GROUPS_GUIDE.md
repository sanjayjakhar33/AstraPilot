# AWS Security Groups Configuration for AstraPilot

## 🔒 Complete Security Groups Setup Guide

This document provides detailed security group configurations required for AstraPilot deployment on AWS.

---

## Security Groups Overview

### Required Security Groups:
1. **EC2 Security Group** - For application server
2. **RDS Security Group** - For PostgreSQL database
3. **ALB Security Group** - For Application Load Balancer (optional)

---

## 1. EC2 Security Group Configuration

### Group Details
- **Name**: `astrapilot-ec2-sg`
- **Description**: Security group for AstraPilot EC2 application server
- **VPC**: Your VPC ID

### Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | YOUR_IP/32 | SSH access from your IP only |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP access from anywhere |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS access from anywhere |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | React frontend application |
| Custom TCP | TCP | 8000 | 0.0.0.0/0 | FastAPI backend application |

### Outbound Rules

| Type | Protocol | Port Range | Destination | Description |
|------|----------|------------|-------------|-------------|
| All Traffic | All | All | 0.0.0.0/0 | All outbound traffic |

### AWS CLI Commands to Create EC2 Security Group

```bash
# Create security group
aws ec2 create-security-group \
    --group-name astrapilot-ec2-sg \
    --description "Security group for AstraPilot EC2 instance" \
    --vpc-id vpc-xxxxxxxxx

# Get the security group ID
export EC2_SG_ID=$(aws ec2 describe-security-groups \
    --group-names astrapilot-ec2-sg \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

# Add SSH rule (replace YOUR_IP with your public IP)
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP/32

# Add HTTP rule
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Add HTTPS rule  
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Add Frontend rule (port 3000)
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

# Add Backend rule (port 8000)
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0
```

---

## 2. RDS Security Group Configuration

### Group Details
- **Name**: `astrapilot-rds-sg`
- **Description**: Security group for AstraPilot PostgreSQL RDS instance
- **VPC**: Your VPC ID

### Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| PostgreSQL | TCP | 5432 | astrapilot-ec2-sg | PostgreSQL access from EC2 instances only |

### Outbound Rules

| Type | Protocol | Port Range | Destination | Description |
|------|----------|------------|-------------|-------------|
| All Traffic | All | All | 0.0.0.0/0 | All outbound traffic |

### AWS CLI Commands to Create RDS Security Group

```bash
# Create RDS security group
aws ec2 create-security-group \
    --group-name astrapilot-rds-sg \
    --description "Security group for AstraPilot PostgreSQL RDS" \
    --vpc-id vpc-xxxxxxxxx

# Get the RDS security group ID
export RDS_SG_ID=$(aws ec2 describe-security-groups \
    --group-names astrapilot-rds-sg \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

# Add PostgreSQL rule (from EC2 security group)
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $EC2_SG_ID
```

---

## 3. Application Load Balancer Security Group (Optional)

### Group Details
- **Name**: `astrapilot-alb-sg`
- **Description**: Security group for AstraPilot Application Load Balancer
- **VPC**: Your VPC ID

### Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP access from anywhere |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS access from anywhere |

### Outbound Rules

| Type | Protocol | Port Range | Destination | Description |
|------|----------|------------|-------------|-------------|
| All Traffic | All | All | 0.0.0.0/0 | All outbound traffic |

### AWS CLI Commands to Create ALB Security Group

```bash
# Create ALB security group
aws ec2 create-security-group \
    --group-name astrapilot-alb-sg \
    --description "Security group for AstraPilot Application Load Balancer" \
    --vpc-id vpc-xxxxxxxxx

# Get the ALB security group ID
export ALB_SG_ID=$(aws ec2 describe-security-groups \
    --group-names astrapilot-alb-sg \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

# Add HTTP rule
aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Add HTTPS rule
aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0
```

---

## Modified EC2 Security Group for ALB Setup

If using ALB, modify the EC2 security group to only allow traffic from ALB:

```bash
# Remove direct access rules for ports 3000 and 8000
aws ec2 revoke-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

aws ec2 revoke-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0

# Add rules to allow traffic from ALB only
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --source-group $ALB_SG_ID

aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 8000 \
    --source-group $ALB_SG_ID
```

---

## Security Group Best Practices

### 1. Principle of Least Privilege
- Only open ports that are absolutely necessary
- Restrict source IPs/ranges as much as possible
- Use security group references instead of CIDR blocks when possible

### 2. SSH Access Security
```bash
# Get your current public IP
export MY_IP=$(curl -s https://checkip.amazonaws.com/)

# Update SSH rule to your current IP only
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr $MY_IP/32
```

### 3. Production Recommendations

#### For Production Environment:
1. **Remove direct port access** - Use ALB for public access
2. **Restrict SSH access** - Only from specific IP ranges
3. **Use VPN/Bastion host** - For administrative access
4. **Enable VPC Flow Logs** - For network monitoring

#### Production Security Group Rules:
```bash
# Remove public access to application ports
aws ec2 revoke-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

aws ec2 revoke-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0

# Only allow HTTP/HTTPS through ALB
# Application ports only accessible from ALB
```

---

## Current Configuration Verification

### Check Your Current Security Groups

```bash
# List all security groups
aws ec2 describe-security-groups \
    --query 'SecurityGroups[*].{Name:GroupName,ID:GroupId,Description:Description}' \
    --output table

# Check specific security group rules
aws ec2 describe-security-groups \
    --group-ids sg-xxxxxxxxx \
    --query 'SecurityGroups[0].{InboundRules:IpPermissions,OutboundRules:IpPermissionsEgress}' \
    --output json
```

### Test Connectivity

```bash
# Test SSH connectivity
telnet 13.235.33.219 22

# Test application ports
telnet 13.235.33.219 3000
telnet 13.235.33.219 8000

# Test from EC2 to RDS
telnet astrapilot.c8n5v7s8x9rk.ap-south-1.rds.amazonaws.com 5432
```

---

## Troubleshooting Security Group Issues

### Common Issues and Solutions

#### 1. Can't SSH to EC2 Instance
```bash
# Check if port 22 is open
aws ec2 describe-security-groups \
    --group-ids $EC2_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`22`]'

# Add SSH rule if missing
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr $(curl -s https://checkip.amazonaws.com/)/32
```

#### 2. Can't Access Application
```bash
# Check if application ports are open
aws ec2 describe-security-groups \
    --group-ids $EC2_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`3000` || FromPort==`8000`]'

# Add application ports if missing
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0
```

#### 3. Database Connection Issues
```bash
# Check RDS security group allows PostgreSQL
aws ec2 describe-security-groups \
    --group-ids $RDS_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`5432`]'

# Verify EC2 security group is allowed
aws ec2 describe-security-groups \
    --group-ids $RDS_SG_ID \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`5432`].UserIdGroupPairs[0].GroupId'
```

---

## Security Group Templates

### CloudFormation Template
```yaml
Resources:
  EC2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for AstraPilot EC2 instance
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0  # Restrict in production
          Description: SSH access
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
          Description: HTTP access
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
          Description: HTTPS access
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          CidrIp: 0.0.0.0/0
          Description: React frontend
        - IpProtocol: tcp
          FromPort: 8000
          ToPort: 8000
          CidrIp: 0.0.0.0/0
          Description: FastAPI backend

  RDSSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for AstraPilot RDS instance
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref EC2SecurityGroup
          Description: PostgreSQL from EC2
```

---

## Summary

✅ **EC2 Security Group**: Allows SSH (22), HTTP (80), HTTPS (443), Frontend (3000), Backend (8000)

✅ **RDS Security Group**: Allows PostgreSQL (5432) from EC2 security group only

✅ **ALB Security Group**: Allows HTTP (80) and HTTPS (443) from anywhere (optional)

✅ **Security Best Practices**: Principle of least privilege, restricted access, monitoring

This configuration ensures secure communication between all components while maintaining accessibility for users and administrators.