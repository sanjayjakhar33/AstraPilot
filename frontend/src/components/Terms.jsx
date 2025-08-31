import React from 'react';
import { FileText, Scale, Users, AlertTriangle, Mail, Phone } from 'lucide-react';
import SEOHead from './SEOHead';

const Terms = () => {
  const lastUpdated = 'December 1, 2024';

  const keyTerms = [
    {
      icon: Users,
      title: 'User Accounts',
      description: 'Guidelines for creating and maintaining your AstraPilot account, including responsibilities and restrictions.'
    },
    {
      icon: FileText,
      title: 'Service Usage',
      description: 'Acceptable use policies for our AI-powered SEO analysis tools and platform features.'
    },
    {
      icon: Scale,
      title: 'Billing & Payments',
      description: 'Terms related to subscription plans, billing cycles, refunds, and payment processing.'
    },
    {
      icon: AlertTriangle,
      title: 'Limitations',
      description: 'Service limitations, disclaimers, and liability terms for using AstraPilot services.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title="Terms of Service - AstraPilot AI SEO Platform"
        description="Read AstraPilot's terms of service to understand your rights and responsibilities when using our AI-powered SEO platform."
        keywords="terms of service, AstraPilot terms, SEO platform agreement, user agreement"
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
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Clear and fair terms governing your use of AstraPilot's AI-powered SEO platform.
          </p>
          <p className="text-sm text-blue-200 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Key Terms Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Key Terms Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the main areas covered in our terms of service to help you use AstraPilot responsibly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyTerms.map((term, index) => {
              const Icon = term.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{term.title}</h3>
                  <p className="text-gray-600 text-sm">{term.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
                  <p className="text-gray-600">
                    By accessing and using AstraPilot ("the Service"), you accept and agree to be bound by the terms and 
                    provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h3>
                  <p className="text-gray-600 mb-4">
                    AstraPilot provides AI-powered SEO analysis, keyword research, and website optimization tools. The service includes:
                  </p>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• AI-powered website SEO analysis</li>
                    <li>• Keyword research and tracking tools</li>
                    <li>• Performance monitoring and reporting</li>
                    <li>• Competitor analysis features</li>
                    <li>• Real-time recommendations and insights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">To use certain features of the Service, you must register for an account. You agree to:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Provide accurate, current, and complete information</li>
                      <li>• Maintain and update your information to keep it accurate</li>
                      <li>• Maintain the security of your password and account</li>
                      <li>• Accept responsibility for all activities under your account</li>
                      <li>• Notify us immediately of any unauthorized account use</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">You agree not to use the Service to:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Violate any applicable laws or regulations</li>
                      <li>• Infringe on intellectual property rights</li>
                      <li>• Transmit harmful, offensive, or inappropriate content</li>
                      <li>• Attempt to gain unauthorized access to our systems</li>
                      <li>• Use automated tools to access the Service excessively</li>
                      <li>• Reverse engineer or attempt to extract source code</li>
                      <li>• Resell or redistribute the Service without permission</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription Plans and Billing</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">Subscription terms:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Subscriptions are billed in advance on a monthly or annual basis</li>
                      <li>• Subscription fees are non-refundable except as required by law</li>
                      <li>• You can cancel your subscription at any time</li>
                      <li>• Service continues until the end of your current billing period</li>
                      <li>• Price changes will be communicated 30 days in advance</li>
                      <li>• Free trial periods may be subject to additional terms</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h3>
                  <p className="text-gray-600">
                    The Service and its original content, features, and functionality are and will remain the exclusive 
                    property of AstraPilot and its licensors. The Service is protected by copyright, trademark, and other laws. 
                    Our trademarks and trade dress may not be used in connection with any product or service without our 
                    prior written consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. Data and Privacy</h3>
                  <p className="text-gray-600">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your 
                    information when you use our Service. By using our Service, you agree to the collection and use of 
                    information in accordance with our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h3>
                  <p className="text-gray-600">
                    While we strive for high availability, we do not guarantee that the Service will be available 100% of the time. 
                    We may experience downtime for maintenance, updates, or due to factors beyond our control. We will make 
                    reasonable efforts to minimize service interruptions.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h3>
                  <p className="text-gray-600">
                    In no event shall AstraPilot, its directors, employees, partners, agents, suppliers, or affiliates be liable 
                    for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                    loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including:</p>
                    <ul className="text-gray-600 space-y-2 ml-6">
                      <li>• Breach of the Terms of Service</li>
                      <li>• Violation of applicable laws</li>
                      <li>• Extended periods of inactivity</li>
                      <li>• Business or legal reasons</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h3>
                  <p className="text-gray-600">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                    is material, we will try to provide at least 30 days notice prior to any new terms taking effect. 
                    What constitutes a material change will be determined at our sole discretion.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h3>
                  <p className="text-gray-600">
                    These Terms shall be interpreted and governed by the laws of the State of California, United States, 
                    without regard to its conflict of law provisions. Our failure to enforce any right or provision of these 
                    Terms will not be considered a waiver of those rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h3>
                  <p className="text-gray-600">
                    If you have any questions about these Terms of Service, please contact us at legal@astrapilot.com or 
                    through our contact page.
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
            Questions About Our Terms?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our legal team is here to help clarify any questions you may have about these terms of service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@astrapilot.com"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-300"
            >
              <Mail className="mr-2 w-5 h-5" />
              legal@astrapilot.com
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

export default Terms;