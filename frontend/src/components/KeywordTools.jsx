import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Search, TrendingUp, BarChart3, Target } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const KeywordTools = () => {
  const [researchResult, setResearchResult] = useState(null);
  const [activeTab, setActiveTab] = useState('research');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const researchMutation = useMutation(
    (data) => axios.post('http://localhost:8000/keywords/research', data),
    {
      onSuccess: (response) => {
        setResearchResult(response.data);
        toast.success('Keyword research completed!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Research failed');
      }
    }
  );

  const onSubmit = (data) => {
    researchMutation.mutate(data);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'text-green-600 bg-green-100';
    if (difficulty < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyText = (difficulty) => {
    if (difficulty < 30) return 'Easy';
    if (difficulty < 70) return 'Medium';
    return 'Hard';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Keyword Research Tools</h1>
        <p className="text-gray-600 mt-2">
          Discover high-value keywords and analyze search opportunities
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('research')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'research'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Keyword Research
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suggestions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab('competitor')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'competitor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Competitor Analysis
          </button>
        </nav>
      </div>

      {/* Keyword Research Tab */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          {/* Research Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Research</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-gray-700">Keyword</label>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="seo optimization"
                    {...register('keyword', { 
                      required: 'Keyword is required'
                    })}
                  />
                  {errors.keyword && (
                    <p className="text-red-600 text-sm mt-1">{errors.keyword.message}</p>
                  )}
                </div>

                <div>
                  <label className="label text-gray-700">Location</label>
                  <select className="input mt-1" {...register('location')}>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={researchMutation.isLoading}
                className="btn btn-primary w-full py-3"
              >
                {researchMutation.isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Researching...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Research Keywords
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Research Results */}
          {researchResult && (
            <div className="space-y-6">
              {/* Main Keyword Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Keyword Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {researchResult.search_volume?.toLocaleString() || 0}
                    </div>
                    <p className="text-gray-600">Monthly Searches</p>
                  </div>

                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      researchResult.difficulty_score < 30 ? 'text-green-600' :
                      researchResult.difficulty_score < 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(researchResult.difficulty_score || 0)}
                    </div>
                    <p className="text-gray-600">Difficulty Score</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ${researchResult.cpc?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-gray-600">Cost Per Click</p>
                  </div>

                  <div className="text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      researchResult.competition_level === 'low' ? 'bg-green-100 text-green-800' :
                      researchResult.competition_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {researchResult.competition_level?.charAt(0).toUpperCase() + researchResult.competition_level?.slice(1)} Competition
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Keywords */}
              {researchResult.related_keywords?.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Keywords</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Keyword
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Search Volume
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CPC
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relevance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {researchResult.related_keywords.slice(0, 10).map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {keyword.keyword}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {keyword.search_volume?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                                {getDifficultyText(keyword.difficulty)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${keyword.cpc?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(keyword.relevance_score * 100)}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {Math.round(keyword.relevance_score * 100)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Long-tail Keywords */}
              {researchResult.long_tail_keywords?.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Long-tail Keywords</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researchResult.long_tail_keywords.slice(0, 8).map((keyword, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{keyword.keyword}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                            {Math.round(keyword.difficulty)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{keyword.search_volume?.toLocaleString()} searches</span>
                          <span>${keyword.cpc?.toFixed(2) || '0.00'} CPC</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Ideas */}
              {researchResult.suggested_content_topics?.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Ideas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {researchResult.suggested_content_topics.map((topic, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">{topic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {researchResult.questions?.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Questions</h3>
                  <div className="space-y-2">
                    {researchResult.questions.slice(0, 10).map((question, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 'suggestions' && (
        <div className="card">
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keyword Suggestions</h3>
            <p className="text-gray-600">Get keyword suggestions based on your seed keywords</p>
          </div>
        </div>
      )}

      {activeTab === 'competitor' && (
        <div className="card">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Competitor Analysis</h3>
            <p className="text-gray-600">Analyze your competitors' keyword strategies</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordTools;