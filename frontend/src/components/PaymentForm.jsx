import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { CreditCard, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentForm = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Fetch subscription plans
  const { data: plans } = useQuery(
    'subscriptionPlans',
    () => axios.get('http://localhost:8000/license/plans').then(res => res.data)
  );

  // Fetch payment history
  const { data: paymentHistory } = useQuery(
    'paymentHistory',
    () => axios.get('http://localhost:8000/payment/history?user_id=1').then(res => res.data)
  );

  // Create checkout session
  const checkoutMutation = useMutation(
    (data) => axios.post(`http://localhost:8000/payment/create-checkout-session?plan_id=${data.plan_id}&billing_cycle=${data.billing_cycle}&user_id=1`),
    {
      onSuccess: (response) => {
        toast.success('Checkout session created!');
        // In a real app, redirect to Stripe checkout
        console.log('Checkout URL:', response.data.checkout_url);
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Checkout failed');
      }
    }
  );

  const handleCheckout = () => {
    checkoutMutation.mutate({
      plan_id: selectedPlan,
      billing_cycle: billingCycle
    });
  };

  const selectedPlanData = plans?.find(p => p.plan_id === selectedPlan);
  const price = billingCycle === 'yearly' 
    ? selectedPlanData?.price_yearly 
    : selectedPlanData?.price_monthly;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment & Billing</h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription payments and billing information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Plan</h2>
            
            {plans && (
              <div className="space-y-3">
                {plans.filter(p => p.plan_id !== 'free').map((plan) => (
                  <div
                    key={plan.plan_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === plan.plan_id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.plan_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly}
                        </div>
                        <div className="text-sm text-gray-600">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Billing Cycle */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Billing Cycle</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="billing"
                    value="monthly"
                    checked={billingCycle === 'monthly'}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Monthly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="billing"
                    value="yearly"
                    checked={billingCycle === 'yearly'}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    Yearly 
                    <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Save 16%
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">
                  {selectedPlanData?.name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium text-gray-900 capitalize">
                  {billingCycle}
                </span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${price?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutMutation.isLoading}
              className="w-full btn btn-primary py-3 mt-6"
            >
              {checkoutMutation.isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </div>
              )}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Secure payment processed by Stripe. You can cancel anytime.
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            
            {paymentHistory?.payments?.length > 0 ? (
              <div className="space-y-4">
                {paymentHistory.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'completed' ? 'bg-green-100' : 
                        payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {payment.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : payment.status === 'pending' ? (
                          <Calendar className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          ${payment.amount} {payment.currency.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No payment history yet</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Secure Payments</p>
                  <p className="text-sm text-blue-700">
                    All payments are processed securely through Stripe
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Cancel Anytime</p>
                  <p className="text-sm text-green-700">
                    No long-term contracts. Cancel your subscription anytime
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Money Back Guarantee</p>
                  <p className="text-sm text-purple-700">
                    30-day money back guarantee on all plans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;