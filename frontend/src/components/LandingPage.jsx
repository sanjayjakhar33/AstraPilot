import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, Zap, Shield, 
  Star, CheckCircle, Target, Brain, Rocket, 
  Sparkles, Play, MousePointer
} from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Auto-rotate features for interactive demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Ultra AI-Powered Analysis',
      description: 'Advanced GPT-4 powered algorithms analyze your website with unprecedented accuracy, providing deep insights into technical SEO, content quality, and optimization opportunities.',
      highlight: '99.7% Accuracy',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Real-time Keyword Intelligence',
      description: 'Discover high-value keywords with live search volume data, difficulty scores, and AI-predicted trends. Get ahead of the competition with predictive keyword analysis.',
      highlight: '50M+ Keywords',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Live Performance Tracking',
      description: 'Monitor your SEO progress in real-time with advanced analytics, trend prediction, and comprehensive reporting that updates every minute.',
      highlight: 'Real-time Updates',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Instant AI Recommendations',
      description: 'Get lightning-fast, actionable recommendations powered by machine learning to improve your search engine rankings instantly.',
      highlight: '<1s Response',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Deep Competitor Intelligence',
      description: 'Advanced AI analyzes competitor strategies, discovers keyword gaps, and provides strategic insights to dominate your market.',
      highlight: '360° Analysis',
      gradient: 'from-red-500 to-purple-500'
    },
    {
      icon: Rocket,
      title: 'Enterprise Team Collaboration',
      description: 'Work seamlessly with your team using shared AI-powered reports, collaborative campaigns, and advanced workflow automation.',
      highlight: 'Unlimited Teams',
      gradient: 'from-indigo-500 to-blue-500'
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      popular: false,
      description: 'Perfect for getting started with AI-powered SEO',
      features: [
        'AI SEO Analysis (10/month)',
        'Basic Keyword Research (100/day)',
        'Core Performance Metrics',
        'Email Support',
        'Basic Reporting',
      ],
      ctaText: 'Start Free',
      ctaStyle: 'btn-outline'
    },
    {
      name: 'Professional',
      price: '$29.99',
      period: 'per month',
      popular: false,
      description: 'Ideal for growing businesses and agencies',
      features: [
        'Unlimited AI SEO Analysis',
        'Advanced Keyword Research (5K/day)',
        'Competitor Intelligence (10 sites)',
        'Real-time Performance Tracking',
        'Priority Support',
        'Custom Reporting',
        'API Access',
      ],
      ctaText: 'Go Pro',
      ctaStyle: 'btn-outline'
    },
    {
      name: 'Business',
      price: '$79.99',
      period: 'per month',
      popular: true,
      description: 'Most popular for serious marketers',
      features: [
        'Everything in Professional',
        'Unlimited Competitor Analysis',
        'White-label Reporting',
        'Advanced Team Collaboration',
        'Predictive AI Insights',
        'Priority Phone Support',
        'Custom Integrations',
        '24/7 Dedicated Support'
      ],
      ctaText: 'Most Popular',
      ctaStyle: 'btn-primary'
    },
    {
      name: 'Enterprise',
      price: '$199.99',
      period: 'per month',
      popular: false,
      description: 'For large organizations and agencies',
      features: [
        'Everything in Business',
        'Unlimited Everything',
        'Custom AI Model Training',
        'On-premise Deployment',
        'Dedicated Account Manager',
        '99.9% SLA Guarantee',
        'Custom Integrations',
        'White-glove Onboarding'
      ],
      ctaText: 'Contact Sales',
      ctaStyle: 'btn-outline'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'SEO Director',
      company: 'TechCorp',
      image: '/api/placeholder/64/64',
      content: 'AstraPilot increased our organic traffic by 340% in just 3 months. The AI insights are incredibly accurate.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      company: 'GrowthLab',
      image: '/api/placeholder/64/64',
      content: 'The real-time analysis and competitor intelligence gave us the edge we needed to outrank our competition.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'StartupXYZ',
      image: '/api/placeholder/64/64',
      content: 'Finally, an SEO tool that actually understands our business. The ROI has been phenomenal.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                #1 AI-Powered SEO Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Ultra AI-Powered
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                SEO Revolution
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Experience the future of SEO with real-time AI analysis, predictive insights, 
              and automated optimization that ranks you #1 on Google.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99.7%</div>
                <div className="text-blue-200 text-sm">AI Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">340%</div>
                <div className="text-blue-200 text-sm">Avg Traffic Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">&lt;1s</div>
                <div className="text-blue-200 text-sm">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50M+</div>
                <div className="text-blue-200 text-sm">Keywords Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Ultra AI-Powered Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Future of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SEO Intelligence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI technology that analyzes, predicts, and optimizes your SEO strategy 
              with unprecedented accuracy and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              return (
                <div 
                  key={index} 
                  className={`card group cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                    isActive ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Businesses
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses like yours are crushing their competition with AstraPilot
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              AWS Free Tier Optimized
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Growth Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start free and scale as you grow. All plans include our core AI-powered features 
              with no hidden costs or usage limits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`card relative transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'ring-2 ring-blue-500 shadow-xl scale-105 bg-gradient-to-br from-blue-50 to-purple-50' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/payment"
                  className={`w-full btn py-4 font-bold text-center transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                      : 'btn-outline hover:bg-gray-100'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Dominate</span> Search Rankings?
          </h2>
          <p className="text-xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses already crushing their competition with AstraPilot's 
            AI-powered SEO intelligence. Start your journey to #1 rankings today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              <Rocket className="mr-2 w-6 h-6" />
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link 
              to="/seo-tools" 
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all"
            >
              <MousePointer className="mr-2 w-5 h-5" />
              Try Live Demo
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span>Free Forever Plan</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span>Setup in 60 Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">AstraPilot Demo</h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video will be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;