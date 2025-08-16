# AstraPilot - AI-Powered SEO Optimization Platform

> **Transform your SEO strategy with intelligent analysis, keyword research, and automated recommendations.**

AstraPilot is a comprehensive AI-driven SEO optimization tool designed to help businesses automatically optimize their web pages, analyze SEO performance, and improve search rankings through intelligent insights and recommendations.

## 🌟 Features

### 🤖 AI-Powered SEO Analysis
- **Technical SEO Audit**: Comprehensive analysis of SSL, meta tags, heading structure, and mobile responsiveness
- **Content Quality Analysis**: Readability scoring, keyword density analysis, and content optimization suggestions
- **Real-time Recommendations**: Actionable insights with priority levels and effort estimates
- **Performance Tracking**: Monitor SEO improvements over time with detailed analytics

### 🔍 Advanced Keyword Research
- **Search Volume Analysis**: Real-time search volume and difficulty scoring
- **Keyword Suggestions**: AI-powered related and long-tail keyword discovery
- **Competitor Analysis**: Analyze competitor keyword strategies and find opportunities
- **Content Ideas**: Generate content topics based on keyword research

### 💼 Subscription Management
- **Multi-tier Plans**: Free, Basic, Pro, and Enterprise subscription options
- **Usage Tracking**: Monitor API usage and feature access limits
- **Flexible Billing**: Monthly and yearly billing cycles with cost savings
- **License Validation**: Real-time license status and feature access control

### 💳 Payment Integration
- **Secure Payments**: Integration with Stripe for secure payment processing
- **Subscription Management**: Automatic renewals and plan upgrades
- **Payment History**: Complete transaction history and billing management
- **Free Trial**: Risk-free trial with no credit card required

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **FastAPI Framework**: High-performance async API with automatic OpenAPI documentation
- **SQLAlchemy ORM**: Async database operations with PostgreSQL support
- **Pydantic Validation**: Type-safe API validation and serialization
- **Beautiful Soup**: Web scraping for content analysis
- **JWT Authentication**: Secure user authentication and authorization

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe frontend development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Query**: Server state management and caching
- **React Router**: Client-side routing and navigation
- **Recharts**: Interactive charts and data visualization

### Database
- **PostgreSQL**: Robust relational database with JSON support
- **Async Operations**: Non-blocking database operations for better performance
- **Migrations**: Alembic for database schema management
- **Connection Pooling**: Efficient database connection management

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sanjayjakhar33/AstraPilot.git
   cd AstraPilot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set environment variables
   export DATABASE_URL="sqlite+aiosqlite:///./app.db"
   export SECRET_KEY="your-secret-key"
   
   # Create database tables
   python -c "
   import asyncio
   from app.database import create_tables
   asyncio.run(create_tables())
   "
   
   # Start the server
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Docker Setup

1. **Using Docker Compose**
   ```bash
   # Set environment variables
   export POSTGRES_PASSWORD=your-db-password
   export SECRET_KEY=your-secret-key
   
   # Start all services
   docker-compose up -d
   ```

2. **Access Services**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - PostgreSQL: localhost:5432

## 🌐 API Documentation

### SEO Analysis
```bash
# Analyze a website
curl -X POST "http://localhost:8000/seo/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "keywords": ["seo", "optimization"],
    "analyze_competitors": false
  }'
```

### Keyword Research
```bash
# Research keywords
curl -X POST "http://localhost:8000/keywords/research" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "seo optimization",
    "location": "United States"
  }'
```

### Subscription Management
```bash
# Get available plans
curl "http://localhost:8000/license/plans"

# Subscribe to a plan
curl -X POST "http://localhost:8000/license/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "pro",
    "billing_cycle": "monthly",
    "user_id": 1
  }'
```

## 🚀 AWS Deployment

### Free Tier Deployment

AstraPilot is optimized for AWS Free Tier deployment with the following services:

- **RDS PostgreSQL** (db.t3.micro): 750 hours/month
- **S3**: 5GB storage + 15GB data transfer
- **CloudFront**: 50GB data transfer
- **ECS**: Container orchestration
- **ECR**: Container registry

### Deployment Steps

1. **Prerequisites**
   ```bash
   # Install AWS CLI
   aws configure
   
   # Install Docker
   docker --version
   ```

2. **Deploy Infrastructure**
   ```bash
   cd deploy
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Environment Configuration**
   ```bash
   # Set these environment variables in your deployment
   export DATABASE_URL="postgresql+asyncpg://user:pass@rds-endpoint:5432/astrapilot"
   export SECRET_KEY="your-production-secret-key"
   ```

## 📊 Subscription Plans

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| **Price** | $0/month | $29.99/month | $79.99/month | $199.99/month |
| **Websites** | 1 | 5 | 25 | Unlimited |
| **SEO Analyses/month** | 10 | 100 | 500 | Unlimited |
| **Keyword Research** | 5/day | Unlimited | Unlimited | Unlimited |
| **Competitor Analysis** | ❌ | 5/month | 25/month | Unlimited |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **White-label Reports** | ❌ | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ | ✅ |
| **Phone Support** | ❌ | ❌ | ✅ | ✅ |

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test SEO analysis
curl -X POST "http://localhost:8000/seo/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "keywords": ["test"]}'
```

## 🔧 Configuration

### Environment Variables

#### Backend
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
# or for SQLite
DATABASE_URL=sqlite+aiosqlite:///./app.db

# Security
SECRET_KEY=your-super-secret-key-change-in-production

# Optional: External API Keys
GOOGLE_API_KEY=your-google-api-key
SEMRUSH_API_KEY=your-semrush-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

#### Frontend
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📈 Monitoring and Scaling

### Performance Monitoring
- **Application Metrics**: Built-in health checks and performance monitoring
- **Database Monitoring**: Connection pooling and query performance tracking
- **Error Tracking**: Comprehensive error logging and reporting

### Scaling Recommendations
- **Horizontal Scaling**: Use AWS ECS with auto-scaling groups
- **Database Scaling**: Implement read replicas for high-traffic scenarios
- **Caching**: Redis for session management and API response caching
- **CDN**: CloudFront for static asset delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [API Docs](http://localhost:8000/docs)
- **Support**: support@astrapilot.com
- **Website**: https://astrapilot.com

## 🏆 Roadmap

- [ ] **Q1 2024**: Competitor analysis with real API integrations
- [ ] **Q1 2024**: Backlink tracking and analysis
- [ ] **Q2 2024**: Advanced on-page SEO audit features
- [ ] **Q2 2024**: Real-time reporting dashboard
- [ ] **Q3 2024**: AI-powered content optimization
- [ ] **Q3 2024**: Multi-language support
- [ ] **Q4 2024**: Mobile app for iOS and Android

---

**Built with ❤️ by the AstraPilot Team**