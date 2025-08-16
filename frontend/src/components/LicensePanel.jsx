import React from 'react';
import { useQuery, useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { Crown, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LicensePanel = () => {
  // Fetch subscription plans
  const { data: plans } = useQuery(
    'subscriptionPlans',
    () => axios.get('http://localhost:8000/license/plans').then(res => res.data)
  );

  // Fetch license status
  const { data: licenseStatus, refetch } = useQuery(
    'licenseStatus',
    () => axios.get('http://localhost:8000/license/status?user_id=1').then(res => res.data)
  );

  // Subscribe mutation
  const subscribeMutation = useMutation(
    (planData) => axios.post('http://localhost:8000/license/subscribe', planData),
    {
      onSuccess: () => {
        toast.success('Successfully subscribed!');
        refetch();
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Subscription failed');
      }
    }
  );

  const handleSubscribe = (planId) => {
    subscribeMutation.mutate({
      plan_id: planId,
      billing_cycle: 'monthly',
      user_id: 1
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">License & Subscription</h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Current Status */}
      {licenseStatus && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize flex items-center">
                {licenseStatus.plan}
                {licenseStatus.plan !== 'free' && (
                  <Crown className="w-5 h-5 text-yellow-500 ml-2" />
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                licenseStatus.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {licenseStatus.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Valid Until</p>
              <p className="text-lg font-medium text-gray-900">
                {licenseStatus.valid_until 
                  ? new Date(licenseStatus.valid_until).toLocaleDateString()
                  : 'Forever'
                }
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage This Month</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">SEO Analyses</span>
                  <span className="text-lg font-bold text-gray-900">
                    {licenseStatus.usage_stats?.seo_analyses || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Limit: {licenseStatus.limits?.seo_analyses_per_month || 'Unlimited'}
                </div>
                {licenseStatus.limits?.seo_analyses_per_month && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-blue-600 h-1 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (licenseStatus.usage_stats.seo_analyses / licenseStatus.limits.seo_analyses_per_month) * 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Keyword Research</span>
                  <span className="text-lg font-bold text-gray-900">
                    {licenseStatus.usage_stats?.keyword_research || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Daily Limit: {licenseStatus.limits?.keyword_research_per_day || 'Unlimited'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Competitor Analyses</span>
                  <span className="text-lg font-bold text-gray-900">
                    {licenseStatus.usage_stats?.competitor_analyses || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Limit: {licenseStatus.limits?.competitor_analyses_per_month || 'Unlimited'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">API Calls</span>
                  <span className="text-lg font-bold text-gray-900">
                    {licenseStatus.usage_stats?.api_calls || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Daily Limit: {licenseStatus.limits?.api_calls_per_day || 'Unlimited'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      {plans && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.plan_id}
                className={`card relative ${
                  plan.is_popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${
                  licenseStatus?.plan === plan.plan_id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {licenseStatus?.plan === plan.plan_id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price_monthly}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {licenseStatus?.plan === plan.plan_id ? (
                    <button className="w-full btn bg-green-600 text-white py-3" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.plan_id)}
                      disabled={subscribeMutation.isLoading}
                      className={`w-full btn py-3 ${
                        plan.is_popular ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {subscribeMutation.isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Processing...
                        </div>
                      ) : plan.price_monthly === 0 ? (
                        'Get Started'
                      ) : (
                        'Upgrade Plan'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Link */}
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need to Update Payment Method?
        </h3>
        <p className="text-gray-600 mb-4">
          Manage your payment details and billing information
        </p>
        <Link to="/payment" className="btn btn-outline">
          <ArrowRight className="w-4 h-4 mr-2" />
          Payment Settings
        </Link>
      </div>
    </div>
  );
};

export default LicensePanel;