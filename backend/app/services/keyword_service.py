# Keyword Analysis and Research Service

import re
import requests
from typing import List, Dict, Optional
from app.schemas.keyword import (
    KeywordRequest, KeywordResearch, KeywordSuggestion, 
    KeywordDifficulty, CompetitorAnalysis, CompetitorKeyword
)
import random
from datetime import datetime, timedelta

class KeywordAnalyzer:
    """
    Advanced keyword analysis service
    Note: In a production environment, you would integrate with real APIs like:
    - Google Keyword Planner API
    - SEMrush API  
    - Ahrefs API
    - Ubersuggest API
    
    For this demo, we'll simulate realistic data and provide a framework
    that can be easily extended with real API integrations.
    """
    
    def __init__(self):
        # In production, store these in environment variables
        self.api_keys = {
            'google': None,  # Google Ads API key
            'semrush': None,  # SEMrush API key
            'ahrefs': None,   # Ahrefs API key
        }
    
    async def research_keyword(self, request: KeywordRequest) -> KeywordResearch:
        """Perform comprehensive keyword research"""
        keyword = request.keyword.lower().strip()
        
        # Simulate keyword data (replace with real API calls)
        search_volume = self._estimate_search_volume(keyword)
        difficulty_score = self._calculate_difficulty(keyword)
        cpc = self._estimate_cpc(keyword)
        
        # Generate related keywords
        related_keywords = await self._find_related_keywords(keyword)
        long_tail_keywords = await self._find_long_tail_keywords(keyword)
        questions = await self._find_keyword_questions(keyword)
        content_topics = await self._suggest_content_topics(keyword)
        
        # Generate seasonal trends (simulated)
        seasonal_trends = self._generate_seasonal_trends()
        
        return KeywordResearch(
            main_keyword=keyword,
            search_volume=search_volume,
            difficulty_score=difficulty_score,
            cpc=cpc,
            competition_level=self._get_competition_level(difficulty_score),
            seasonal_trends=seasonal_trends,
            related_keywords=related_keywords,
            long_tail_keywords=long_tail_keywords,
            questions=questions,
            suggested_content_topics=content_topics
        )
    
    async def analyze_competitor_keywords(self, domain: str, user_keywords: List[str] = None) -> CompetitorAnalysis:
        """Analyze competitor's keyword strategy"""
        # In production, this would use real APIs like SEMrush or Ahrefs
        
        # Simulate competitor data
        organic_keywords = random.randint(500, 5000)
        paid_keywords = random.randint(50, 500)
        
        # Generate top organic keywords for competitor
        top_keywords = []
        sample_keywords = [
            "seo optimization", "keyword research", "content marketing",
            "digital marketing", "search rankings", "website traffic",
            "online marketing", "seo tools", "backlink building"
        ]
        
        for i, kw in enumerate(sample_keywords[:5]):
            top_keywords.append(CompetitorKeyword(
                keyword=kw,
                position=i + 1,
                search_volume=random.randint(1000, 10000),
                traffic_estimate=random.randint(100, 1000),
                url=f"https://{domain}/page-{i+1}"
            ))
        
        # Find keyword gaps (keywords competitor ranks for but user doesn't)
        keyword_gaps = []
        if user_keywords:
            for kw in sample_keywords:
                if kw not in user_keywords:
                    keyword_gaps.append(KeywordSuggestion(
                        keyword=kw,
                        search_volume=random.randint(500, 5000),
                        difficulty=random.uniform(20, 80),
                        relevance_score=random.uniform(0.6, 0.9),
                        cpc=random.uniform(0.5, 5.0)
                    ))
        
        content_gaps = [
            f"Complete guide to {domain.split('.')[0]}",
            f"Best practices for {domain.split('.')[0]}",
            f"How to improve {domain.split('.')[0]} results",
            f"{domain.split('.')[0]} vs competitors comparison"
        ]
        
        return CompetitorAnalysis(
            domain=domain,
            organic_keywords=organic_keywords,
            paid_keywords=paid_keywords,
            top_organic_keywords=top_keywords,
            keyword_gaps=keyword_gaps[:10],
            content_gaps=content_gaps
        )
    
    async def batch_keyword_difficulty(self, keywords: List[str]) -> List[KeywordDifficulty]:
        """Analyze difficulty for multiple keywords"""
        results = []
        
        for keyword in keywords:
            difficulty = KeywordDifficulty(
                keyword=keyword,
                difficulty_score=self._calculate_difficulty(keyword),
                search_volume=self._estimate_search_volume(keyword),
                cpc=self._estimate_cpc(keyword),
                competition=self._get_competition_level(self._calculate_difficulty(keyword)),
                trend=self._generate_trend_data()
            )
            results.append(difficulty)
        
        return results
    
    async def _find_related_keywords(self, keyword: str) -> List[KeywordSuggestion]:
        """Find related keywords (simulate Google Keyword Planner)"""
        # In production, use Google Keyword Planner API or other services
        
        # Simple keyword expansion logic
        base_words = keyword.split()
        related_terms = [
            "best", "top", "how to", "guide", "tips", "tools", 
            "services", "software", "platform", "free", "online"
        ]
        
        related_keywords = []
        
        # Generate variations
        for term in related_terms[:8]:
            new_keyword = f"{term} {keyword}"
            related_keywords.append(KeywordSuggestion(
                keyword=new_keyword,
                search_volume=random.randint(100, 2000),
                difficulty=random.uniform(10, 70),
                relevance_score=random.uniform(0.7, 0.95),
                cpc=random.uniform(0.3, 3.0)
            ))
        
        # Add some suffix variations
        suffixes = ["2024", "review", "comparison", "alternative", "pricing"]
        for suffix in suffixes[:3]:
            new_keyword = f"{keyword} {suffix}"
            related_keywords.append(KeywordSuggestion(
                keyword=new_keyword,
                search_volume=random.randint(50, 1000),
                difficulty=random.uniform(15, 60),
                relevance_score=random.uniform(0.6, 0.85),
                cpc=random.uniform(0.5, 4.0)
            ))
        
        return related_keywords
    
    async def _find_long_tail_keywords(self, keyword: str) -> List[KeywordSuggestion]:
        """Find long-tail keyword variations"""
        long_tail_patterns = [
            f"how to use {keyword}",
            f"best {keyword} for small business",
            f"{keyword} vs competitors",
            f"free {keyword} tools",
            f"{keyword} step by step guide",
            f"what is {keyword}",
            f"{keyword} for beginners",
            f"cheap {keyword} services"
        ]
        
        long_tail_keywords = []
        for pattern in long_tail_patterns:
            long_tail_keywords.append(KeywordSuggestion(
                keyword=pattern,
                search_volume=random.randint(10, 500),
                difficulty=random.uniform(5, 40),
                relevance_score=random.uniform(0.8, 0.95),
                cpc=random.uniform(0.2, 2.0)
            ))
        
        return long_tail_keywords
    
    async def _find_keyword_questions(self, keyword: str) -> List[str]:
        """Find question-based keywords (Answer The Public style)"""
        question_words = ["what", "how", "why", "when", "where", "who"]
        questions = []
        
        for q_word in question_words:
            questions.extend([
                f"{q_word} is {keyword}?",
                f"{q_word} does {keyword} work?",
                f"{q_word} to choose {keyword}?"
            ])
        
        return questions[:10]
    
    async def _suggest_content_topics(self, keyword: str) -> List[str]:
        """Suggest content topics based on keyword"""
        topics = [
            f"Ultimate Guide to {keyword.title()}",
            f"10 Best Practices for {keyword.title()}",
            f"Common {keyword.title()} Mistakes to Avoid",
            f"{keyword.title()} Case Studies and Examples",
            f"Future of {keyword.title()} in 2024",
            f"ROI of Investing in {keyword.title()}",
            f"Beginner's Guide to {keyword.title()}",
            f"{keyword.title()} Tools and Software Comparison"
        ]
        
        return topics
    
    def _estimate_search_volume(self, keyword: str) -> int:
        """Estimate search volume based on keyword characteristics"""
        # Simple heuristic (replace with real API data)
        word_count = len(keyword.split())
        base_volume = max(100, 10000 // (word_count * 2))
        
        # Adjust based on common terms
        if any(term in keyword.lower() for term in ['seo', 'marketing', 'business']):
            base_volume *= 2
        
        return random.randint(base_volume // 2, base_volume * 2)
    
    def _calculate_difficulty(self, keyword: str) -> float:
        """Calculate keyword difficulty score"""
        # Simple heuristic (replace with real API data)
        word_count = len(keyword.split())
        
        # Shorter keywords are generally more difficult
        base_difficulty = max(20, 100 - (word_count * 15))
        
        # Add some randomness
        return min(100, max(1, base_difficulty + random.uniform(-20, 20)))
    
    def _estimate_cpc(self, keyword: str) -> float:
        """Estimate cost-per-click"""
        # Business/commercial keywords typically have higher CPC
        commercial_terms = ['buy', 'price', 'cost', 'service', 'software', 'tool']
        
        base_cpc = 1.0
        if any(term in keyword.lower() for term in commercial_terms):
            base_cpc = 3.0
        
        return round(random.uniform(base_cpc * 0.3, base_cpc * 2.0), 2)
    
    def _get_competition_level(self, difficulty_score: float) -> str:
        """Convert difficulty score to competition level"""
        if difficulty_score < 30:
            return "low"
        elif difficulty_score < 70:
            return "medium"
        else:
            return "high"
    
    def _generate_seasonal_trends(self) -> List[Dict]:
        """Generate seasonal trend data"""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        trends = []
        for month in months:
            trends.append({
                "month": month,
                "search_volume": random.randint(500, 2000),
                "trend_direction": random.choice(["up", "down", "stable"])
            })
        
        return trends
    
    def _generate_trend_data(self) -> List[int]:
        """Generate 12-month trend data"""
        return [random.randint(50, 150) for _ in range(12)]

# Service functions
async def research_keywords(keyword_request: KeywordRequest) -> KeywordResearch:
    """Main keyword research function with AI enhancement"""
    try:
        # Import AI service
        from app.services.ai_service import generate_ai_keywords
        
        # Perform traditional keyword analysis
        analyzer = KeywordAnalyzer()
        basic_research = await analyzer.research_keyword(keyword_request)
        
        # Enhance with AI-generated keywords
        try:
            ai_keywords = await generate_ai_keywords(
                keyword_request.keyword, 
                getattr(keyword_request, 'business_context', '')
            )
            
            # Merge AI keywords with related keywords
            if ai_keywords:
                # Add AI keywords as high-quality suggestions
                basic_research.related_keywords.extend(ai_keywords[:5])
                # Sort by relevance score
                basic_research.related_keywords.sort(key=lambda x: x.relevance_score, reverse=True)
                # Keep top 15 to avoid overwhelming
                basic_research.related_keywords = basic_research.related_keywords[:15]
                
        except Exception as e:
            print(f"AI keyword enhancement failed: {str(e)}")
        
        return basic_research
        
    except Exception as e:
        # Fallback to basic analysis
        print(f"Enhanced keyword research failed: {str(e)}")
        analyzer = KeywordAnalyzer()
        return await analyzer.research_keyword(keyword_request)

async def analyze_competitor_keywords(domain: str, user_keywords: List[str] = None) -> CompetitorAnalysis:
    """Analyze competitor keywords"""
    analyzer = KeywordAnalyzer()
    return await analyzer.analyze_competitor_keywords(domain, user_keywords)

async def batch_analyze_keywords(keywords: List[str]) -> List[KeywordDifficulty]:
    """Analyze multiple keywords for difficulty"""
    analyzer = KeywordAnalyzer()
    return await analyzer.batch_keyword_difficulty(keywords)