# Enhanced AI Service for Ultra AI-Powered SEO Analysis

import os
import asyncio
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
import openai
from app.schemas.seo import SEOAnalysisResult, SEORecommendation
from app.schemas.keyword import KeywordSuggestion
import logging

logger = logging.getLogger(__name__)

class UltraAIAnalyzer:
    """
    Ultra AI-Powered SEO Analysis Engine
    Uses advanced GPT models for intelligent SEO insights
    """
    
    def __init__(self):
        # Initialize OpenAI client
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY", "your-openai-api-key")
        )
        self.model = "gpt-4o-mini"  # Use the latest efficient model
        
    async def enhance_seo_analysis(self, basic_analysis: SEOAnalysisResult, content: str) -> SEOAnalysisResult:
        """
        Enhance basic SEO analysis with AI-powered insights
        """
        try:
            # Generate AI-powered recommendations
            ai_recommendations = await self._generate_ai_recommendations(basic_analysis, content)
            
            # Generate competitor insights
            ai_competitor_insights = await self._generate_competitor_insights(basic_analysis)
            
            # Generate content optimization suggestions
            content_suggestions = await self._generate_content_suggestions(content, basic_analysis.technical_seo)
            
            # Predict SEO trends and opportunities
            trend_predictions = await self._predict_seo_trends(basic_analysis)
            
            # Enhanced analysis result
            enhanced_analysis = basic_analysis.model_copy()
            
            # Add AI-generated recommendations
            if ai_recommendations:
                enhanced_analysis.recommendations.extend(ai_recommendations)
            
            # Add AI insights as metadata
            enhanced_analysis.ai_insights = {
                "competitor_insights": ai_competitor_insights,
                "content_suggestions": content_suggestions,
                "trend_predictions": trend_predictions,
                "ai_score_adjustment": await self._calculate_ai_score_adjustment(basic_analysis, content),
                "generated_at": datetime.utcnow().isoformat()
            }
            
            return enhanced_analysis
            
        except Exception as e:
            logger.error(f"AI enhancement failed: {str(e)}")
            # Return original analysis if AI fails
            return basic_analysis
    
    async def _generate_ai_recommendations(self, analysis: SEOAnalysisResult, content: str) -> List[SEORecommendation]:
        """Generate intelligent SEO recommendations using AI"""
        
        prompt = f"""
        You are an expert SEO consultant analyzing a website. Based on the following SEO analysis data and content, 
        provide 3-5 high-impact, actionable SEO recommendations.

        Current SEO Score: {analysis.overall_score}/100
        
        Technical Issues:
        - SSL Enabled: {analysis.technical_seo.ssl_enabled}
        - Meta Tags: {json.dumps(analysis.technical_seo.meta_tags_present)}
        - Images without Alt: {analysis.technical_seo.images_without_alt}
        - Mobile Friendly: {analysis.technical_seo.mobile_friendly}
        
        Content Analysis:
        - Word Count: {analysis.content_analysis.word_count}
        - Readability Score: {analysis.content_analysis.readability_score}
        - Keyword Density Issues: {len([k for k in analysis.content_analysis.keyword_analysis if k.density < 0.5 or k.density > 3])}
        
        Website Content Preview: {content[:500]}...

        Generate recommendations in JSON format:
        {{
            "recommendations": [
                {{
                    "category": "technical|content|keywords|performance",
                    "priority": "high|medium|low", 
                    "issue": "specific issue description",
                    "recommendation": "actionable solution",
                    "impact": "expected impact description",
                    "effort": "low|medium|high",
                    "ai_confidence": 0.0-1.0
                }}
            ]
        }}
        
        Focus on recommendations that will have the highest impact on search rankings.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert SEO consultant with 10+ years of experience."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            ai_response = response.choices[0].message.content
            recommendations_data = json.loads(ai_response)
            
            ai_recommendations = []
            for rec_data in recommendations_data.get("recommendations", []):
                ai_recommendations.append(SEORecommendation(
                    category=rec_data["category"],
                    priority=rec_data["priority"],
                    issue=rec_data["issue"],
                    recommendation=rec_data["recommendation"],
                    impact=rec_data["impact"],
                    effort=rec_data["effort"]
                ))
            
            return ai_recommendations
            
        except Exception as e:
            logger.error(f"Failed to generate AI recommendations: {str(e)}")
            return []
    
    async def _generate_competitor_insights(self, analysis: SEOAnalysisResult) -> Dict[str, Any]:
        """Generate AI-powered competitor insights"""
        
        prompt = f"""
        As an SEO expert, analyze this website's competitive landscape and provide strategic insights.
        
        Website URL: {analysis.url}
        Current SEO Score: {analysis.overall_score}/100
        
        Based on the URL and domain, provide competitive insights in JSON format:
        {{
            "industry_analysis": "industry description and trends",
            "competitive_strengths": ["strength1", "strength2"],
            "competitive_weaknesses": ["weakness1", "weakness2"], 
            "market_opportunities": ["opportunity1", "opportunity2"],
            "recommended_keywords": ["keyword1", "keyword2", "keyword3"],
            "content_gaps": ["gap1", "gap2"],
            "backlink_opportunities": ["opportunity1", "opportunity2"]
        }}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a competitive intelligence expert specializing in SEO."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=800
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Failed to generate competitor insights: {str(e)}")
            return {}
    
    async def _generate_content_suggestions(self, content: str, technical_seo) -> Dict[str, Any]:
        """Generate AI-powered content optimization suggestions"""
        
        prompt = f"""
        Analyze the following website content and provide specific content optimization suggestions.
        
        Content: {content[:1000]}...
        
        Technical Context:
        - Has proper heading structure: {technical_seo.heading_structure}
        - Mobile friendly: {technical_seo.mobile_friendly}
        
        Provide suggestions in JSON format:
        {{
            "content_quality_score": 0-100,
            "writing_improvements": ["improvement1", "improvement2"],
            "keyword_opportunities": ["keyword1", "keyword2"],
            "content_structure_suggestions": ["suggestion1", "suggestion2"],
            "engagement_improvements": ["improvement1", "improvement2"],
            "semantic_keywords": ["keyword1", "keyword2", "keyword3"]
        }}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a content strategist and SEO expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=600
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Failed to generate content suggestions: {str(e)}")
            return {}
    
    async def _predict_seo_trends(self, analysis: SEOAnalysisResult) -> Dict[str, Any]:
        """Predict SEO trends and opportunities using AI"""
        
        prompt = f"""
        Based on current SEO best practices and emerging trends, predict the SEO outlook for this website.
        
        Current State:
        - SEO Score: {analysis.overall_score}/100
        - URL: {analysis.url}
        - Analysis Date: {analysis.analysis_date}
        
        Provide predictions in JSON format:
        {{
            "3_month_outlook": {{
                "predicted_score_change": "+/-X points",
                "key_opportunities": ["opportunity1", "opportunity2"],
                "emerging_risks": ["risk1", "risk2"]
            }},
            "trending_keywords": ["keyword1", "keyword2", "keyword3"],
            "algorithm_impact": "low|medium|high risk from algorithm updates",
            "voice_search_readiness": 0-100,
            "mobile_first_score": 0-100,
            "core_web_vitals_priority": ["metric1", "metric2"]
        }}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an SEO trend analyst and future-focused consultant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=700
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Failed to predict SEO trends: {str(e)}")
            return {}
    
    async def _calculate_ai_score_adjustment(self, analysis: SEOAnalysisResult, content: str) -> float:
        """Calculate AI-based score adjustment"""
        
        prompt = f"""
        As an SEO expert, provide a score adjustment (-10 to +10 points) for this website's SEO score.
        
        Current Score: {analysis.overall_score}/100
        Content Quality: {len(content)} characters
        Technical Issues: {len(analysis.recommendations)} found
        
        Consider modern SEO factors like:
        - Content quality and user intent
        - E-A-T (Expertise, Authoritativeness, Trustworthiness)
        - User experience signals
        - Semantic relevance
        
        Respond with just a number between -10 and +10 representing the adjustment.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an SEO scoring expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=50
            )
            
            adjustment = float(response.choices[0].message.content.strip())
            return max(-10, min(10, adjustment))
            
        except Exception as e:
            logger.error(f"Failed to calculate AI score adjustment: {str(e)}")
            return 0.0

class RealTimeKeywordAnalyzer:
    """
    Real-time keyword analysis with AI enhancement
    """
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY", "your-openai-api-key")
        )
        self.model = "gpt-4o-mini"
    
    async def generate_smart_keywords(self, seed_keyword: str, business_context: str = "") -> List[KeywordSuggestion]:
        """Generate intelligent keyword suggestions using AI"""
        
        prompt = f"""
        Generate 10 high-value SEO keyword suggestions for the seed keyword: "{seed_keyword}"
        
        Business Context: {business_context}
        
        Focus on:
        - Commercial intent keywords
        - Long-tail variations
        - Question-based keywords
        - Semantic variations
        
        Provide results in JSON format:
        {{
            "keywords": [
                {{
                    "keyword": "specific keyword phrase",
                    "search_volume": estimated_monthly_searches,
                    "difficulty": 1-100_difficulty_score,
                    "relevance_score": 0.0-1.0,
                    "intent": "informational|commercial|navigational|transactional",
                    "cpc": estimated_cost_per_click
                }}
            ]
        }}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert keyword researcher with deep understanding of search intent."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=1200
            )
            
            keywords_data = json.loads(response.choices[0].message.content)
            
            suggestions = []
            for kw_data in keywords_data.get("keywords", []):
                suggestions.append(KeywordSuggestion(
                    keyword=kw_data["keyword"],
                    search_volume=kw_data["search_volume"],
                    difficulty=kw_data["difficulty"],
                    relevance_score=kw_data["relevance_score"],
                    cpc=kw_data["cpc"]
                ))
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Failed to generate smart keywords: {str(e)}")
            return []

# WebSocket handler for real-time analysis
class RealTimeAnalysisHandler:
    """
    Handle real-time SEO analysis updates via WebSocket
    """
    
    def __init__(self):
        self.active_connections = {}
        self.ai_analyzer = UltraAIAnalyzer()
    
    async def connect(self, websocket, user_id: str):
        """Connect user to real-time updates"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    async def disconnect(self, user_id: str):
        """Disconnect user from real-time updates"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
    
    async def send_analysis_update(self, user_id: str, analysis_data: Dict):
        """Send real-time analysis update to connected user"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_json({
                    "type": "analysis_update",
                    "data": analysis_data,
                    "timestamp": datetime.utcnow().isoformat()
                })
            except Exception as e:
                logger.error(f"Failed to send real-time update: {str(e)}")
                await self.disconnect(user_id)
    
    async def send_keyword_suggestions(self, user_id: str, keywords: List[KeywordSuggestion]):
        """Send real-time keyword suggestions"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_json({
                    "type": "keyword_suggestions",
                    "data": [kw.model_dump() for kw in keywords],
                    "timestamp": datetime.utcnow().isoformat()
                })
            except Exception as e:
                logger.error(f"Failed to send keyword suggestions: {str(e)}")
                await self.disconnect(user_id)

# Global instances
ai_analyzer = UltraAIAnalyzer()
keyword_analyzer = RealTimeKeywordAnalyzer()
realtime_handler = RealTimeAnalysisHandler()

# Service functions
async def enhance_seo_with_ai(analysis: SEOAnalysisResult, content: str) -> SEOAnalysisResult:
    """Main function to enhance SEO analysis with AI"""
    return await ai_analyzer.enhance_seo_analysis(analysis, content)

async def generate_ai_keywords(seed_keyword: str, business_context: str = "") -> List[KeywordSuggestion]:
    """Generate AI-powered keyword suggestions"""
    return await keyword_analyzer.generate_smart_keywords(seed_keyword, business_context)

async def start_realtime_analysis(user_id: str, websocket):
    """Start real-time analysis for a user"""
    await realtime_handler.connect(websocket, user_id)
    return realtime_handler