import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart3, TrendingUp, Zap, Shield, Users } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered SEO Analysis',
      description: 'Advanced algorithms analyze your website for technical SEO issues, content quality, and optimization opportunities.',
    },
    {
      icon: BarChart3,
      title: 'Keyword Research',
      description: 'Discover high-value keywords with search volume data, difficulty scores, and competitor analysis.',
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your SEO progress with detailed analytics, trend tracking, and comprehensive reporting.',
    },
    {
      icon: Zap,
      title: 'Real-time Recommendations',
      description: 'Get instant, actionable recommendations to improve your search engine rankings.',
    },
    {
      icon: Shield,
      title: 'Competitor Analysis',
      description: 'Analyze competitor strategies and discover keyword gaps and opportunities.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team with shared reports and collaborative SEO campaigns.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic SEO analysis',
        '5 keyword searches/day',
        'Basic reporting',
        'Email support',
      ],
    },
    {
      name: 'Basic',
      price: '$29.99',
      period: 'per month',
      features: [
        'Advanced SEO analysis',
        'Unlimited keyword research',
        '5 competitor analyses/month',
        'Custom reporting',
        'Priority support',
      ],
    },
    {
      name: 'Pro',
      price: '$79.99',
      period: 'per month',
      popular: true,
      features: [
        'All Basic features',
        'White-label reporting',
        'Advanced competitor analysis',
        'API access',
        'Team collaboration',
        'Phone support',
      ],
    },
    {
      name: 'Enterprise',
      price: '$199.99',
      period: 'per month',
      features: [
        'All Pro features',
        'Unlimited everything',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise option',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered SEO
              <span className="block text-blue-200">Optimization Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Boost your search rankings with intelligent SEO analysis, 
              keyword research, and automated recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/seo-tools" 
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Try SEO Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful SEO Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to dominate search rankings and drive organic traffic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your SEO needs. All plans include core features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`card relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/payment"
                  className={`w-full btn ${
                    plan.popular ? 'btn-primary' : 'btn-outline'
                  } py-3`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your SEO?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of businesses already improving their search rankings with AstraPilot.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;