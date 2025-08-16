import React from 'react';
import { useQuery } from 'react-query';
import { BarChart3, TrendingUp, Search, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  // Mock data for analytics
  const analyticsData = [
    { name: 'Jan', score: 65, analyses: 12 },
    { name: 'Feb', score: 71, analyses: 18 },
    { name: 'Mar', score: 68, analyses: 15 },
    { name: 'Apr', score: 75, analyses: 22 },
    { name: 'May', score: 82, analyses: 28 },
    { name: 'Jun', score: 79, analyses: 25 },
  ];

  const topIssues = [
    { category: 'Technical', count: 45, trend: 'up' },
    { category: 'Content', count: 32, trend: 'down' },
    { category: 'Keywords', count: 28, trend: 'up' },
    { category: 'Links', count: 15, trend: 'down' },
  ];

  // Fetch license status
  const { data: licenseStatus } = useQuery(
    'licenseStatus',
    () => axios.get('http://localhost:8000/license/status?user_id=1').then(res => res.data),
    { refetchInterval: 30000 }
  );

  // Fetch SEO analytics
  const { data: seoAnalytics } = useQuery(
    'seoAnalytics',
    () => axios.get('http://localhost:8000/seo/analytics?user_id=1').then(res => res.data),
    { refetchInterval: 30000 }
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your SEO performance and track improvements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">
                {seoAnalytics?.total_analyses || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {seoAnalytics?.avg_score ? `${seoAnalytics.avg_score}/100` : '0/100'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+5.2%</span>
            <span className="text-gray-500 ml-1">improvement</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {licenseStatus?.plan || 'Free'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              licenseStatus?.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {licenseStatus?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usage This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {licenseStatus?.usage_stats?.seo_analyses || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Limit</span>
              <span className="text-gray-900">
                {licenseStatus?.limits?.seo_analyses_per_month || 'Unlimited'}
              </span>
            </div>
            {licenseStatus?.limits?.seo_analyses_per_month && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, (licenseStatus.usage_stats.seo_analyses / licenseStatus.limits.seo_analyses_per_month) * 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO Score Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Analysis Volume */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Analyses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="analyses" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Issues */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top SEO Issues</h3>
        <div className="space-y-4">
          {(seoAnalytics?.top_issues || topIssues).map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{issue.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{issue.count} issues</span>
                {issue.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
            <Search className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                SEO analysis completed for example.com
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Keyword research completed for "seo tools"
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Plan upgraded to Pro
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;