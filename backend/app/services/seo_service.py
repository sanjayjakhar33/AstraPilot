# backend/app/services/seo_service.py

import requests
from bs4 import BeautifulSoup
import textstat
import re
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.seodata import SeoData
from app.schemas.seo import (
    SEOAnalysisRequest, SEOAnalysisResult, TechnicalSEO, 
    ContentAnalysis, KeywordAnalysis, SEORecommendation,
    CompetitorData
)
from datetime import datetime
import asyncio
import ssl
import socket

class SEOAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    async def analyze_website(self, request: SEOAnalysisRequest) -> SEOAnalysisResult:
        """Perform comprehensive SEO analysis of a website"""
        url = str(request.url)
        
        # Fetch and parse the webpage
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            raise ValueError(f"Failed to fetch website: {str(e)}")
        
        # Perform all analyses
        technical_seo = await self._analyze_technical_seo(url, soup, response)
        content_analysis = await self._analyze_content(soup, request.keywords or [])
        recommendations = await self._generate_recommendations(technical_seo, content_analysis)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(technical_seo, content_analysis)
        
        # Analyze competitors if requested
        competitors = None
        if request.analyze_competitors:
            competitors = await self._analyze_competitors(url, soup)
        
        return SEOAnalysisResult(
            url=url,
            overall_score=overall_score,
            technical_seo=technical_seo,
            content_analysis=content_analysis,
            recommendations=recommendations,
            competitors=competitors,
            analysis_date=datetime.utcnow()
        )
    
    async def _analyze_technical_seo(self, url: str, soup: BeautifulSoup, response) -> TechnicalSEO:
        """Analyze technical SEO aspects"""
        parsed_url = urlparse(url)
        
        # Check SSL
        ssl_enabled = parsed_url.scheme == 'https'
        
        # Meta tags analysis
        meta_tags = {
            'title': bool(soup.find('title')),
            'description': bool(soup.find('meta', attrs={'name': 'description'})),
            'keywords': bool(soup.find('meta', attrs={'name': 'keywords'})),
            'viewport': bool(soup.find('meta', attrs={'name': 'viewport'})),
            'robots': bool(soup.find('meta', attrs={'name': 'robots'})),
            'canonical': bool(soup.find('link', attrs={'rel': 'canonical'})),
            'og_title': bool(soup.find('meta', attrs={'property': 'og:title'})),
            'og_description': bool(soup.find('meta', attrs={'property': 'og:description'})),
            'og_image': bool(soup.find('meta', attrs={'property': 'og:image'}))
        }
        
        # Heading structure
        heading_structure = {}
        for i in range(1, 7):
            heading_structure[f'h{i}'] = len(soup.find_all(f'h{i}'))
        
        # Image analysis
        images = soup.find_all('img')
        images_with_alt = len([img for img in images if img.get('alt')])
        images_without_alt = len(images) - images_with_alt
        
        # Link analysis
        links = soup.find_all('a', href=True)
        internal_links = 0
        external_links = 0
        broken_links = []
        
        for link in links:
            href = link['href']
            if href.startswith('#'):
                continue
            elif href.startswith('/') or parsed_url.netloc in href:
                internal_links += 1
            else:
                external_links += 1
        
        # Check for sitemap and robots.txt
        has_sitemap = await self._check_sitemap(url)
        has_robots_txt = await self._check_robots_txt(url)
        
        return TechnicalSEO(
            ssl_enabled=ssl_enabled,
            meta_tags_present=meta_tags,
            heading_structure=heading_structure,
            images_with_alt=images_with_alt,
            images_without_alt=images_without_alt,
            internal_links=internal_links,
            external_links=external_links,
            broken_links=broken_links,
            has_sitemap=has_sitemap,
            has_robots_txt=has_robots_txt,
            mobile_friendly=self._check_mobile_friendly(soup)
        )
    
    async def _analyze_content(self, soup: BeautifulSoup, target_keywords: List[str]) -> ContentAnalysis:
        """Analyze content quality and keyword usage"""
        # Extract text content
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text()
        text = ' '.join(text.split())  # Clean whitespace
        
        # Basic text statistics
        word_count = len(text.split())
        sentence_count = textstat.sentence_count(text)
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Readability analysis
        readability_score = textstat.flesch_reading_ease(text)
        reading_level = textstat.flesch_kincaid_grade(text)
        
        # Keyword analysis
        keyword_analysis = []
        text_lower = text.lower()
        
        for keyword in target_keywords:
            keyword_lower = keyword.lower()
            frequency = text_lower.count(keyword_lower)
            density = (frequency * len(keyword.split()) / word_count) * 100 if word_count > 0 else 0
            
            # Simple placement scoring (higher score for keywords in title, headings)
            placement_score = 0
            title = soup.find('title')
            if title and keyword_lower in title.get_text().lower():
                placement_score += 30
            
            h1_tags = soup.find_all('h1')
            for h1 in h1_tags:
                if keyword_lower in h1.get_text().lower():
                    placement_score += 20
            
            h2_tags = soup.find_all('h2')
            for h2 in h2_tags:
                if keyword_lower in h2.get_text().lower():
                    placement_score += 10
            
            # Recommended frequency (1-3% density is generally good)
            recommended_frequency = max(1, int(word_count * 0.02 / len(keyword.split())))
            
            keyword_analysis.append(KeywordAnalysis(
                keyword=keyword,
                density=density,
                frequency=frequency,
                placement_score=placement_score,
                recommended_frequency=recommended_frequency
            ))
        
        # Content quality score (0-100)
        content_quality_score = self._calculate_content_quality_score(
            word_count, readability_score, keyword_analysis
        )
        
        return ContentAnalysis(
            word_count=word_count,
            readability_score=readability_score,
            reading_level=str(reading_level),
            sentence_count=sentence_count,
            avg_sentence_length=avg_sentence_length,
            keyword_analysis=keyword_analysis,
            content_quality_score=content_quality_score
        )
    
    async def _generate_recommendations(self, technical_seo: TechnicalSEO, content_analysis: ContentAnalysis) -> List[SEORecommendation]:
        """Generate SEO recommendations based on analysis"""
        recommendations = []
        
        # Technical SEO recommendations
        if not technical_seo.ssl_enabled:
            recommendations.append(SEORecommendation(
                category="technical",
                priority="high",
                issue="Website is not using HTTPS",
                recommendation="Enable SSL certificate and redirect all HTTP traffic to HTTPS",
                impact="Security and search ranking improvement",
                effort="medium"
            ))
        
        if not technical_seo.meta_tags_present.get('title'):
            recommendations.append(SEORecommendation(
                category="technical",
                priority="high",
                issue="Missing title tag",
                recommendation="Add a unique, descriptive title tag (50-60 characters)",
                impact="Major impact on search rankings",
                effort="low"
            ))
        
        if not technical_seo.meta_tags_present.get('description'):
            recommendations.append(SEORecommendation(
                category="technical",
                priority="high",
                issue="Missing meta description",
                recommendation="Add a compelling meta description (150-160 characters)",
                impact="Improves click-through rates from search results",
                effort="low"
            ))
        
        if technical_seo.heading_structure.get('h1', 0) == 0:
            recommendations.append(SEORecommendation(
                category="content",
                priority="high",
                issue="Missing H1 tag",
                recommendation="Add a single, descriptive H1 tag with your main keyword",
                impact="Important for search engine understanding",
                effort="low"
            ))
        
        if technical_seo.heading_structure.get('h1', 0) > 1:
            recommendations.append(SEORecommendation(
                category="content",
                priority="medium",
                issue="Multiple H1 tags found",
                recommendation="Use only one H1 tag per page",
                impact="Better content structure for search engines",
                effort="low"
            ))
        
        if technical_seo.images_without_alt > 0:
            recommendations.append(SEORecommendation(
                category="technical",
                priority="medium",
                issue=f"{technical_seo.images_without_alt} images missing alt text",
                recommendation="Add descriptive alt text to all images",
                impact="Improves accessibility and image search rankings",
                effort="medium"
            ))
        
        # Content recommendations
        if content_analysis.word_count < 300:
            recommendations.append(SEORecommendation(
                category="content",
                priority="medium",
                issue="Content is too short",
                recommendation="Expand content to at least 300 words for better SEO",
                impact="More content gives search engines more context",
                effort="high"
            ))
        
        if content_analysis.readability_score < 30:
            recommendations.append(SEORecommendation(
                category="content",
                priority="medium",
                issue="Content is difficult to read",
                recommendation="Simplify language and use shorter sentences",
                impact="Better user experience and engagement",
                effort="medium"
            ))
        
        # Keyword recommendations
        for keyword_data in content_analysis.keyword_analysis:
            if keyword_data.density < 0.5:
                recommendations.append(SEORecommendation(
                    category="keywords",
                    priority="medium",
                    issue=f"Low keyword density for '{keyword_data.keyword}'",
                    recommendation=f"Increase usage of '{keyword_data.keyword}' to 1-2%",
                    impact="Better keyword relevance",
                    effort="medium"
                ))
            elif keyword_data.density > 3:
                recommendations.append(SEORecommendation(
                    category="keywords",
                    priority="medium",
                    issue=f"Keyword stuffing detected for '{keyword_data.keyword}'",
                    recommendation=f"Reduce usage of '{keyword_data.keyword}' to avoid over-optimization",
                    impact="Avoid search engine penalties",
                    effort="low"
                ))
        
        return recommendations
    
    async def _analyze_competitors(self, url: str, soup: BeautifulSoup) -> List[CompetitorData]:
        """Analyze competitors (simplified version)"""
        # This is a placeholder - in a real implementation, you'd use
        # APIs like SEMrush, Ahrefs, or implement web scraping
        competitors = []
        
        # Extract potential competitors from external links
        # This is a basic implementation
        domain = urlparse(url).netloc
        
        # For now, return mock competitor data
        competitors.append(CompetitorData(
            domain="competitor1.com",
            title="Competitor 1 - Similar Service",
            meta_description="High-quality service similar to yours",
            keywords=["seo", "optimization", "ranking"],
            content_length=1200,
            backlinks_estimate=150
        ))
        
        return competitors
    
    def _calculate_overall_score(self, technical_seo: TechnicalSEO, content_analysis: ContentAnalysis) -> float:
        """Calculate overall SEO score (0-100)"""
        score = 0
        
        # Technical SEO scoring (40% of total)
        technical_score = 0
        if technical_seo.ssl_enabled:
            technical_score += 10
        if technical_seo.meta_tags_present.get('title'):
            technical_score += 15
        if technical_seo.meta_tags_present.get('description'):
            technical_score += 10
        if technical_seo.heading_structure.get('h1', 0) == 1:
            technical_score += 5
        
        # Content scoring (60% of total)
        content_score = content_analysis.content_quality_score * 0.6
        
        score = technical_score + content_score
        return min(100, max(0, score))
    
    def _calculate_content_quality_score(self, word_count: int, readability_score: float, keyword_analysis: List[KeywordAnalysis]) -> float:
        """Calculate content quality score"""
        score = 0
        
        # Word count scoring
        if word_count >= 300:
            score += 25
        elif word_count >= 150:
            score += 15
        else:
            score += 5
        
        # Readability scoring
        if readability_score >= 60:
            score += 25
        elif readability_score >= 30:
            score += 15
        else:
            score += 5
        
        # Keyword optimization scoring
        if keyword_analysis:
            avg_density = sum(k.density for k in keyword_analysis) / len(keyword_analysis)
            if 1 <= avg_density <= 3:
                score += 20
            elif 0.5 <= avg_density <= 4:
                score += 15
            else:
                score += 5
        
        return min(100, score)
    
    def _check_mobile_friendly(self, soup: BeautifulSoup) -> bool:
        """Check if the page has mobile-friendly viewport meta tag"""
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        return bool(viewport)
    
    async def _check_sitemap(self, url: str) -> bool:
        """Check if sitemap.xml exists"""
        try:
            sitemap_url = urljoin(url, '/sitemap.xml')
            response = self.session.get(sitemap_url, timeout=5)
            return response.status_code == 200
        except:
            return False
    
    async def _check_robots_txt(self, url: str) -> bool:
        """Check if robots.txt exists"""
        try:
            robots_url = urljoin(url, '/robots.txt')
            response = self.session.get(robots_url, timeout=5)
            return response.status_code == 200
        except:
            return False

# Enhanced service functions
async def perform_seo_analysis(db: AsyncSession, user_id: int, request: SEOAnalysisRequest) -> SEOAnalysisResult:
    """Perform comprehensive SEO analysis"""
    analyzer = SEOAnalyzer()
    analysis_result = await analyzer.analyze_website(request)
    
    # Convert the result to a dict with JSON serializable values
    result_dict = analysis_result.model_dump()
    
    # Convert datetime to string for JSON serialization
    if 'analysis_date' in result_dict:
        result_dict['analysis_date'] = result_dict['analysis_date'].isoformat()
    
    # Save to database
    seodata = SeoData(
        user_id=user_id,
        url=str(request.url),
        analysis_result=result_dict,
        score=analysis_result.overall_score
    )
    db.add(seodata)
    await db.commit()
    await db.refresh(seodata)
    
    return analysis_result

async def get_recent_seo_results(db: AsyncSession, user_id: int, limit: int = 10) -> List[SeoData]:
    """Get recent SEO analyses for a user"""
    result = await db.execute(
        select(SeoData)
        .where(SeoData.user_id == user_id)
        .order_by(desc(SeoData.created_at))
        .limit(limit)
    )
    return result.scalars().all()

async def get_seo_analytics(db: AsyncSession, user_id: int) -> Dict:
    """Get SEO analytics and trends for a user"""
    result = await db.execute(
        select(SeoData)
        .where(SeoData.user_id == user_id)
        .order_by(desc(SeoData.created_at))
    )
    analyses = result.scalars().all()
    
    if not analyses:
        return {
            "total_analyses": 0,
            "avg_score": 0,
            "trend": [],
            "top_issues": []
        }
    
    total_analyses = len(analyses)
    avg_score = sum(a.score for a in analyses) / total_analyses
    
    # Simple trend calculation
    trend = []
    for analysis in analyses[-10:]:  # Last 10 analyses
        trend.append({
            "date": analysis.created_at.isoformat(),
            "score": analysis.score,
            "url": analysis.url
        })
    
    # Common issues analysis
    all_recommendations = []
    for analysis in analyses:
        if 'recommendations' in analysis.analysis_result:
            all_recommendations.extend(analysis.analysis_result['recommendations'])
    
    # Count top issues
    issue_counts = {}
    for rec in all_recommendations:
        category = rec.get('category', 'other')
        issue_counts[category] = issue_counts.get(category, 0) + 1
    
    top_issues = [{"category": k, "count": v} for k, v in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)]
    
    return {
        "total_analyses": total_analyses,
        "avg_score": round(avg_score, 2),
        "trend": trend,
        "top_issues": top_issues[:5]
    }
