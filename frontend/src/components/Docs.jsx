import React, { useState } from 'react';
import { Book, Code, Zap, Search, Target, BarChart3, ExternalLink, ChevronRight, Copy, Check } from 'lucide-react';
import SEOHead from './SEOHead';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState('');

  const navigation = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      sections: [
        { id: 'quick-start', title: 'Quick Start Guide' },
        { id: 'first-analysis', title: 'Your First Analysis' },
        { id: 'dashboard-overview', title: 'Dashboard Overview' }
      ]
    },
    {
      id: 'seo-tools',
      title: 'SEO Analysis',
      icon: Search,
      sections: [
        { id: 'website-analysis', title: 'Website Analysis' },
        { id: 'technical-seo', title: 'Technical SEO' },
        { id: 'content-analysis', title: 'Content Analysis' }
      ]
    },
    {
      id: 'keyword-tools',
      title: 'Keyword Research',
      icon: Target,
      sections: [
        { id: 'keyword-discovery', title: 'Keyword Discovery' },
        { id: 'competitor-keywords', title: 'Competitor Keywords' },
        { id: 'keyword-tracking', title: 'Keyword Tracking' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      sections: [
        { id: 'authentication', title: 'Authentication' },
        { id: 'endpoints', title: 'API Endpoints' },
        { id: 'examples', title: 'Code Examples' }
      ]
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Getting Started with AstraPilot</h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to AstraPilot! This guide will help you get started with our AI-powered SEO platform and perform your first analysis.
            </p>

            <div id="quick-start" className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Quick Start Guide</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Step 1: Create Your Account</h3>
                  <p className="text-blue-800">
                    Sign up for a free AstraPilot account to access our AI-powered SEO tools. No credit card required for the free tier.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">Step 2: Verify Your Email</h3>
                  <p className="text-green-800">
                    Check your inbox for a verification email and click the confirmation link to activate your account.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">Step 3: Run Your First Analysis</h3>
                  <p className="text-purple-800">
                    Enter your website URL in the SEO Tools section and let our AI analyze your site's performance.
                  </p>
                </div>
              </div>
            </div>

            <div id="first-analysis" className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Your First Analysis</h2>
              <p className="text-gray-600 mb-6">
                Follow these steps to perform your first comprehensive SEO analysis:
              </p>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Navigate to SEO Tools:</strong> Click on "SEO Tools" in the main navigation menu.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Enter Your URL:</strong> Type your website URL in the analysis input field.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Add Keywords (Optional):</strong> Include target keywords for more specific analysis.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Start Analysis:</strong> Click the "Analyze Website" button and wait for AI processing.
                  </div>
                </li>
              </ol>
            </div>
          </div>
        );

      case 'api':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">API Reference</h1>
            <p className="text-xl text-gray-600 mb-8">
              Integrate AstraPilot's AI-powered SEO analysis into your applications using our REST API.
            </p>

            <div id="authentication" className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Authentication</h2>
              <p className="text-gray-600 mb-6">
                All API requests require authentication using an API key. Include your API key in the request headers.
              </p>
              
              <CodeBlock
                language="bash"
                id="auth-example"
                code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.astrapilot.com/v1/seo/analyze`}
              />
            </div>

            <div id="endpoints" className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">API Endpoints</h2>
              
              <div className="space-y-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">POST</span>
                    <code className="text-lg font-mono">/v1/seo/analyze</code>
                  </div>
                  <p className="text-gray-600 mb-4">Perform comprehensive SEO analysis on a website.</p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
                  <CodeBlock
                    language="json"
                    id="seo-analyze-request"
                    code={`{
  "url": "https://example.com",
  "keywords": ["seo", "optimization"],
  "analyze_competitors": true
}`}
                  />

                  <h4 className="font-semibold text-gray-900 mb-2 mt-4">Response:</h4>
                  <CodeBlock
                    language="json"
                    id="seo-analyze-response"
                    code={`{
  "overall_score": 85.5,
  "technical_seo": {
    "page_speed_score": 92,
    "mobile_friendly": true,
    "ssl_enabled": true
  },
  "content_analysis": {
    "word_count": 1250,
    "readability_score": 78.5,
    "keyword_analysis": [...]
  },
  "recommendations": [...]
}`}
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
                    <code className="text-lg font-mono">/v1/keywords/research</code>
                  </div>
                  <p className="text-gray-600 mb-4">Research keywords and get search volume data.</p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Query Parameters:</h4>
                  <CodeBlock
                    language="bash"
                    id="keyword-research-request"
                    code={`GET /v1/keywords/research?keyword=seo+tools&country=US&limit=10`}
                  />
                </div>
              </div>
            </div>

            <div id="examples" className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Code Examples</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript/Node.js</h3>
                  <CodeBlock
                    language="javascript"
                    id="js-example"
                    code={`const axios = require('axios');

async function analyzeSite(url) {
  try {
    const response = await axios.post('https://api.astrapilot.com/v1/seo/analyze', {
      url: url,
      keywords: ['seo', 'optimization']
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('SEO Score:', response.data.overall_score);
    return response.data;
  } catch (error) {
    console.error('Analysis failed:', error.response.data);
  }
}

analyzeSite('https://example.com');`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Python</h3>
                  <CodeBlock
                    language="python"
                    id="python-example"
                    code={`import requests
import json

def analyze_site(url):
    headers = {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
    
    data = {
        'url': url,
        'keywords': ['seo', 'optimization']
    }
    
    response = requests.post(
        'https://api.astrapilot.com/v1/seo/analyze',
        headers=headers,
        json=data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"SEO Score: {result['overall_score']}")
        return result
    else:
        print(f"Error: {response.status_code}")
        return None

analyze_site('https://example.com')`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Documentation</h1>
            <p className="text-xl text-gray-600 mb-8">
              Select a section from the navigation to view detailed documentation.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title="Documentation - AstraPilot AI SEO Platform"
        description="Comprehensive documentation for AstraPilot's AI-powered SEO platform. Learn how to use our tools, API, and features effectively."
        keywords="AstraPilot documentation, SEO platform guide, API docs, how to use AstraPilot"
      />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Everything you need to master AstraPilot's AI-powered SEO platform.
          </p>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Documentation</h3>
                <nav className="space-y-2">
                  {navigation.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id}>
                        <button
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{section.title}</span>
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </button>
                        {activeSection === section.id && section.sections && (
                          <div className="ml-8 mt-2 space-y-1">
                            {section.sections.map((subsection) => (
                              <a
                                key={subsection.id}
                                href={`#${subsection.id}`}
                                className="block px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {subsection.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Need More Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-300"
            >
              <ExternalLink className="mr-2 w-5 h-5" />
              Contact Support
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors duration-300"
            >
              <BarChart3 className="mr-2 w-5 h-5" />
              Go to Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;