import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  BarChart3, TrendingUp, Search, Users, ArrowUpRight, ArrowDownRight, 
  Globe, Target, Zap, Award, Activity, RefreshCw, Eye, Clock,
  AlertCircle, CheckCircle, Star
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced analytics data with more depth
  const analyticsData = [
    { name: 'Jan', score: 65, analyses: 12, traffic: 1200, conversions: 24, competitors: 5 },
    { name: 'Feb', score: 71, analyses: 18, traffic: 1580, conversions: 32, competitors: 7 },
    { name: 'Mar', score: 68, analyses: 15, traffic: 1450, conversions: 28, competitors: 6 },
    { name: 'Apr', score: 75, analyses: 22, traffic: 1890, conversions: 41, competitors: 9 },
    { name: 'May', score: 82, analyses: 28, traffic: 2340, conversions: 58, competitors: 11 },
    { name: 'Jun', score: 79, analyses: 25, traffic: 2180, conversions: 52, competitors: 10 },
    { name: 'Jul', score: 85, analyses: 32, traffic: 2650, conversions: 67, competitors: 12 },
  ];

  const seoDistribution = [
    { name: 'Technical SEO', value: 35, color: '#3B82F6' },
    { name: 'Content Quality', value: 25, color: '#10B981' },
    { name: 'Keywords', value: 20, color: '#F59E0B' },
    { name: 'Backlinks', value: 15, color: '#EF4444' },
    { name: 'Performance', value: 5, color: '#8B5CF6' }
  ];

  const realTimeMetrics = [
    { label: 'Live Visitors', value: 847, change: '+12%', trend: 'up' },
    { label: 'Page Views', value: 1234, change: '+8%', trend: 'up' },
    { label: 'Bounce Rate', value: '32%', change: '-5%', trend: 'down' },
    { label: 'Avg. Session', value: '3:45', change: '+15%', trend: 'up' }
  ];

  const topIssues = [
    { category: 'Missing Meta Descriptions', count: 45, priority: 'high', trend: 'up' },
    { category: 'Image Alt Tags', count: 32, priority: 'medium', trend: 'down' },
    { category: 'Slow Page Speed', count: 28, priority: 'high', trend: 'up' },
    { category: 'Broken Links', count: 15, priority: 'low', trend: 'down' },
    { category: 'Duplicate Content', count: 12, priority: 'medium', trend: 'stable' },
  ];

  const competitorData = [
    { name: 'You', score: 85, color: '#3B82F6' },
    { name: 'Competitor A', score: 78, color: '#EF4444' },
    { name: 'Competitor B', score: 82, color: '#F59E0B' },
    { name: 'Competitor C', score: 71, color: '#8B5CF6' },
    { name: 'Industry Avg', score: 68, color: '#6B7280' }
  ];

  // Real-time data simulation
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setRealTimeData({
          visitors: Math.floor(Math.random() * 100) + 800,
          pageViews: Math.floor(Math.random() * 200) + 1200,
          bounceRate: (Math.random() * 10 + 25).toFixed(1),
          avgSession: `${Math.floor(Math.random() * 2 + 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
        setLastUpdated(new Date());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isRealTimeEnabled]);

  // Fetch license status
  const { data: licenseStatus, refetch: refetchLicense } = useQuery(
    'licenseStatus',
    () => axios.get('http://localhost:8000/license/status?user_id=1').then(res => res.data),
    { 
      refetchInterval: isRealTimeEnabled ? 30000 : false,
      staleTime: 30000
    }
  );

  // Fetch SEO analytics
  const { data: seoAnalytics, refetch: refetchAnalytics } = useQuery(
    'seoAnalytics',
    () => axios.get('http://localhost:8000/seo/analytics?user_id=1').then(res => res.data),
    { 
      refetchInterval: isRealTimeEnabled ? 30000 : false,
      staleTime: 30000
    }
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Enhanced Header with Real-time Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Dashboard
          </h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Real-time SEO performance monitoring & insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          
          <button
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isRealTimeEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRealTimeEnabled ? 'animate-spin' : ''}`} />
            <span>{isRealTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}</span>
          </button>
          
          <button
            onClick={() => {
              refetchLicense();
              refetchAnalytics();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      {isRealTimeEnabled && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Live Analytics
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">LIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {realTimeMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {realTimeData ? realTimeData[metric.label.toLowerCase().replace(/[^a-z]/g, '')] || metric.value : metric.value}
                </p>
                <div className="flex items-center justify-center space-x-1">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Stats Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Analyses</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {seoAnalytics?.total_analyses || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">SEO Audits Complete</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-blue-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-blue-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">SEO Score</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {seoAnalytics?.avg_score ? `${seoAnalytics.avg_score}` : '0'}
                <span className="text-lg text-green-600">/100</span>
              </p>
              <p className="text-xs text-green-600 mt-1">Average Performance</p>
            </div>
            <div className="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-green-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-green-600 ml-1">improvement</span>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Current Plan</p>
              <p className="text-3xl font-bold text-purple-900 mt-1 capitalize">
                {licenseStatus?.plan || 'Free'}
              </p>
              <p className="text-xs text-purple-600 mt-1">Subscription Tier</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-xl flex items-center justify-center">
              <Star className="w-7 h-7 text-purple-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              licenseStatus?.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {licenseStatus?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Monthly Usage</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {licenseStatus?.usage_stats?.seo_analyses || 0}
              </p>
              <p className="text-xs text-orange-600 mt-1">API Calls Used</p>
            </div>
            <div className="w-14 h-14 bg-orange-200 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-orange-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-orange-600 font-medium">Limit</span>
              <span className="text-orange-900 font-bold">
                {licenseStatus?.limits?.seo_analyses_per_month || 'Unlimited'}
              </span>
            </div>
            {licenseStatus?.limits?.seo_analyses_per_month && (
              <div className="w-full bg-orange-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, (licenseStatus.usage_stats.seo_analyses / licenseStatus.limits.seo_analyses_per_month) * 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* SEO Score Trend - Takes 2 columns */}
        <div className="xl:col-span-2 card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              SEO Performance Trend
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Score</span>
              <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
              <span className="text-sm text-gray-600">Traffic</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                fillOpacity={1}
                fill="url(#scoreGradient)"
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#10B981" 
                fillOpacity={1}
                fill="url(#trafficGradient)"
                strokeWidth={3}
                yAxisId="right"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SEO Distribution Pie Chart */}
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            SEO Focus Areas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={seoDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {seoDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {seoDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Analysis & Monthly Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Competitor Comparison */}
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-red-600" />
            Competitor Benchmark
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitorData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analysis Volume */}
        <div className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
            Monthly Analysis Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="analyses" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Top Issues with Priority */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
            Critical SEO Issues
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {(seoAnalytics?.top_issues || topIssues).length} Issues Found
          </span>
        </div>
        <div className="space-y-4">
          {(seoAnalytics?.top_issues || topIssues).map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-red-400">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{issue.category}</h4>
                  <p className="text-sm text-gray-600">{issue.count} issues detected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                  {issue.priority?.toUpperCase() || 'MEDIUM'}
                </span>
                {getTrendIcon(issue.trend)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
            View Detailed Report
          </button>
        </div>
      </div>

      {/* Enhanced Recent Activity with Timeline */}
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  SEO Analysis Completed
                </h4>
                <span className="text-xs text-gray-500">2 hrs ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive audit for <strong>example.com</strong> - Score: 87/100
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Excellent
                </span>
                <span className="text-xs text-gray-500">3 issues found</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Keyword Research Completed
                </h4>
                <span className="text-xs text-gray-500">5 hrs ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Found <strong>47 high-value keywords</strong> for "AI SEO tools"
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  High Volume
                </span>
                <span className="text-xs text-gray-500">Low competition</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Plan Upgraded
                </h4>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Successfully upgraded to <strong>Pro Plan</strong>
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Pro Features Unlocked
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Competitor Analysis
                </h4>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Analyzed <strong>5 competitors</strong> in your industry
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  Market Insights
                </span>
                <span className="text-xs text-gray-500">New opportunities found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;