import React from 'react';
import { Shield, Eye, Lock, Users, Database, Globe, Mail, Phone } from 'lucide-react';
import SEOHead from './SEOHead';

const Privacy = () => {
  const lastUpdated = 'December 1, 2024';

  const dataTypes = [
    {
      icon: Users,
      title: 'Personal Information',
      description: 'Name, email address, phone number, and billing information when you create an account or make a purchase.'
    },
    {
      icon: Globe,
      title: 'Website Data',
      description: 'URLs you analyze, SEO metrics, and website performance data submitted through our platform.'
    },
    {
      icon: Database,
      title: 'Usage Analytics',
      description: 'How you interact with our platform, features used, and technical performance data.'
    },
    {
      icon: Eye,
      title: 'Technical Information',
      description: 'IP address, browser type, device information, and cookies for platform functionality.'
    }
  ];

  const protectionMeasures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data transmission is protected with industry-standard SSL/TLS encryption.'
    },
    {
      icon: Shield,
      title: 'Secure Infrastructure',
      description: 'Our servers are hosted on secure, SOC 2 compliant cloud infrastructure.'
    },
    {
      icon: Database,
      title: 'Regular Backups',
      description: 'Your data is regularly backed up and stored in multiple secure locations.'
    },
    {
      icon: Users,
      title: 'Access Controls',
      description: 'Strict employee access controls with multi-factor authentication requirements.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title="Privacy Policy - AstraPilot AI SEO Platform"
        description="Learn how AstraPilot protects your privacy and data. Our comprehensive privacy policy explains how we collect, use, and safeguard your information."
        keywords="privacy policy, data protection, AstraPilot privacy, SEO data security"
      />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we protect and handle your data with transparency and care.
          </p>
          <p className="text-sm text-blue-200 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Data Collection Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Information We Collect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collect only the information necessary to provide you with the best possible SEO analysis and platform experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Protect Your Data */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How We Protect Your Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement industry-leading security measures to ensure your data remains safe and secure at all times.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {protectionMeasures.map((measure, index) => {
              const Icon = measure.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{measure.title}</h3>
                  <p className="text-gray-600 text-sm">{measure.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Detailed Privacy Policy</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Information Collection and Use</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">
                      AstraPilot collects information to provide and improve our AI-powered SEO services. We collect information when you:
                    </p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Create an account and provide registration information</li>
                      <li>• Use our SEO analysis tools and submit website URLs</li>
                      <li>• Make payments for premium features</li>
                      <li>• Contact our support team</li>
                      <li>• Interact with our platform and website</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">We use collected information to:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Provide SEO analysis and recommendations</li>
                      <li>• Process payments and manage subscriptions</li>
                      <li>• Send important service updates and notifications</li>
                      <li>• Improve our AI algorithms and platform features</li>
                      <li>• Provide customer support and respond to inquiries</li>
                      <li>• Comply with legal obligations and prevent fraud</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">
                      We do not sell, trade, or otherwise transfer your personal information to third parties except:
                    </p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• With your explicit consent</li>
                      <li>• To trusted service providers who assist in platform operations</li>
                      <li>• When required by law or to protect our rights</li>
                      <li>• In connection with a business transfer or acquisition</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h3>
                  <p className="text-gray-600">
                    We retain your personal information only as long as necessary to provide our services and fulfill legal obligations. 
                    SEO analysis data is typically retained for 2 years to enable historical tracking and trend analysis. 
                    You can request deletion of your data at any time by contacting our support team.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">You have the right to:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Access and review your personal information</li>
                      <li>• Update or correct inaccurate data</li>
                      <li>• Request deletion of your data (right to be forgotten)</li>
                      <li>• Opt-out of marketing communications</li>
                      <li>• Data portability (receive your data in a machine-readable format)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h3>
                  <p className="text-gray-600">
                    We use cookies and similar technologies to enhance your experience, remember your preferences, 
                    and analyze platform usage. You can control cookie settings through your browser preferences. 
                    Essential cookies required for platform functionality cannot be disabled.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h3>
                  <p className="text-gray-600">
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data according to applicable data protection laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h3>
                  <p className="text-gray-600">
                    We may update this privacy policy periodically. We will notify you of significant changes via email 
                    or through prominent notices on our platform. Your continued use constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're here to help. Contact our privacy team for any questions or concerns about how we handle your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@astrapilot.com"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-300"
            >
              <Mail className="mr-2 w-5 h-5" />
              privacy@astrapilot.com
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors duration-300"
            >
              <Phone className="mr-2 w-5 h-5" />
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;