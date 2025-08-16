import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Search, Globe, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SeoTools = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const analysisMutation = useMutation(
    (data) => axios.post('http://localhost:8000/seo/analyze', data),
    {
      onSuccess: (response) => {
        setAnalysisResult(response.data);
        toast.success('SEO analysis completed!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Analysis failed');
      }
    }
  );

  const onSubmit = (data) => {
    const requestData = {
      url: data.url,
      keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()) : [],
      analyze_competitors: data.analyze_competitors || false
    };
    analysisMutation.mutate(requestData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Analysis Tools</h1>
        <p className="text-gray-600 mt-2">
          Analyze your website's SEO performance and get actionable recommendations
        </p>
      </div>

      {/* Analysis Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Website Analysis</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label text-gray-700">Website URL</label>
            <input
              type="url"
              className="input mt-1"
              placeholder="https://example.com"
              {...register('url', { 
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL'
                }
              })}
            />
            {errors.url && (
              <p className="text-red-600 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>

          <div>
            <label className="label text-gray-700">Target Keywords (optional)</label>
            <input
              type="text"
              className="input mt-1"
              placeholder="seo, optimization, ranking (comma separated)"
              {...register('keywords')}
            />
            <p className="text-gray-500 text-sm mt-1">
              Enter keywords you want to optimize for, separated by commas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="analyze_competitors"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('analyze_competitors')}
            />
            <label htmlFor="analyze_competitors" className="text-gray-700">
              Include competitor analysis
            </label>
          </div>

          <button
            type="submit"
            disabled={analysisMutation.isLoading}
            className="btn btn-primary w-full py-3"
          >
            {analysisMutation.isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Analyze Website
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
              <button className="btn btn-outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.overall_score)}`}>
                  {Math.round(analysisResult.overall_score)}/100
                </div>
                <p className="text-gray-600">Overall SEO Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {analysisResult.recommendations?.length || 0}
                </div>
                <p className="text-gray-600">Issues Found</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analysisResult.content_analysis?.word_count || 0}
                </div>
                <p className="text-gray-600">Words Analyzed</p>
              </div>
            </div>
          </div>

          {/* Technical SEO */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {analysisResult.technical_seo?.ssl_enabled ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-700">HTTPS/SSL</span>
              </div>

              <div className="flex items-center space-x-3">
                {analysisResult.technical_seo?.meta_tags_present?.title ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-700">Title Tag</span>
              </div>

              <div className="flex items-center space-x-3">
                {analysisResult.technical_seo?.meta_tags_present?.description ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-700">Meta Description</span>
              </div>

              <div className="flex items-center space-x-3">
                {analysisResult.technical_seo?.mobile_friendly ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-700">Mobile Friendly</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.technical_seo?.images_with_alt || 0}
                </div>
                <p className="text-sm text-gray-600">Images with Alt Text</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.technical_seo?.internal_links || 0}
                </div>
                <p className="text-sm text-gray-600">Internal Links</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.technical_seo?.external_links || 0}
                </div>
                <p className="text-sm text-gray-600">External Links</p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {analysisResult.technical_seo?.heading_structure?.h1 || 0}
                </div>
                <p className="text-sm text-gray-600">H1 Tags</p>
              </div>
            </div>
          </div>

          {/* Content Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Readability Score</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(analysisResult.content_analysis?.readability_score || 0)}
                  </div>
                  <span className="text-gray-500 ml-1">/100</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Content Quality</p>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(analysisResult.content_analysis?.content_quality_score || 0)}
                  </div>
                  <span className="text-gray-500 ml-1">/100</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Average Sentence Length</p>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analysisResult.content_analysis?.avg_sentence_length || 0)}
                </div>
              </div>
            </div>

            {/* Keyword Analysis */}
            {analysisResult.content_analysis?.keyword_analysis?.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Keyword Analysis</h4>
                <div className="space-y-3">
                  {analysisResult.content_analysis.keyword_analysis.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{keyword.keyword}</span>
                        <p className="text-sm text-gray-600">
                          Density: {keyword.density.toFixed(2)}% | Frequency: {keyword.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Placement Score</div>
                        <div className="text-lg font-bold text-gray-900">{keyword.placement_score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recommendations ({analysisResult.recommendations?.length || 0})
            </h3>
            <div className="space-y-4">
              {analysisResult.recommendations?.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">{rec.category}</span>
                    </div>
                    <span className="text-xs text-gray-500">{rec.effort} effort</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{rec.issue}</h4>
                  <p className="text-gray-600 text-sm mb-2">{rec.recommendation}</p>
                  <p className="text-blue-600 text-sm"><strong>Impact:</strong> {rec.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoTools;