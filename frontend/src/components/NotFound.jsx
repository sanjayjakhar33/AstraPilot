import React from 'react';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const NotFound = () => {
  const suggestions = [
    { title: 'Dashboard', href: '/dashboard', description: 'View your SEO analytics and insights' },
    { title: 'SEO Tools', href: '/seo-tools', description: 'Analyze your website performance' },
    { title: 'Keyword Research', href: '/keyword-tools', description: 'Discover high-value keywords' },
    { title: 'Documentation', href: '/docs', description: 'Learn how to use AstraPilot' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <SEOHead 
        title="Page Not Found - AstraPilot"
        description="The page you're looking for doesn't exist. Navigate back to AstraPilot's main features."
      />
      
      <div className="text-center px-4 max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="relative mb-12">
          <div className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
              <Compass className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for seems to have wandered off into cyberspace. 
            Don't worry, even the best SEO tools sometimes lose their way!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="mr-2 w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 border border-gray-200 shadow-lg"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Popular Pages */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
            <Search className="mr-2 w-6 h-6 text-blue-600" />
            Popular Pages
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <Link
                key={index}
                to={suggestion.href}
                className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-left group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {suggestion.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Still can't find what you're looking for?{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;