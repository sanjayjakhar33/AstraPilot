import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "AstraPilot - Ultra AI-Powered SEO Platform", 
  description = "Transform your SEO strategy with intelligent analysis, keyword research, and automated recommendations. #1 AI-powered SEO tool for dominating search rankings.",
  keywords = "SEO tools, AI SEO, keyword research, SEO analysis, search engine optimization, SEO audit, ranking optimization, organic traffic, SERP ranking",
  canonical = "",
  image = "/images/astrapilot-og-image.jpg",
  type = "website",
  author = "AstraPilot Team",
  publishedTime = "",
  modifiedTime = "",
  schema = null
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonicalUrl = canonical || currentUrl;

  // Default structured data schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AstraPilot",
    "description": description,
    "applicationCategory": "SEO Software",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "creator": {
      "@type": "Organization",
      "name": "AstraPilot",
      "url": "https://astrapilot.com"
    },
    "featureList": [
      "AI-Powered SEO Analysis",
      "Real-time Keyword Research", 
      "Competitor Intelligence",
      "Performance Tracking",
      "Automated Recommendations",
      "WebSocket Real-time Updates"
    ]
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AstraPilot" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@AstraPilot" />
      <meta name="twitter:site" content="@AstraPilot" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="AstraPilot" />

      {/* Language and Geographic */}
      <meta name="language" content="en" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Copyright and Business */}
      <meta name="copyright" content="© 2024 AstraPilot. All rights reserved." />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="1 day" />

      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://api.openai.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>

      {/* Additional Schema for Website */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AstraPilot",
          "url": "https://astrapilot.com",
          "description": "Ultra AI-Powered SEO Platform for dominating search rankings",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://astrapilot.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AstraPilot",
          "url": "https://astrapilot.com",
          "logo": "https://astrapilot.com/images/logo.png",
          "description": "Leading provider of AI-powered SEO tools and services",
          "sameAs": [
            "https://twitter.com/AstraPilot",
            "https://www.linkedin.com/company/astrapilot",
            "https://github.com/sanjayjakhar33/AstraPilot"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-ASTRAPILOT",
            "contactType": "Customer Service",
            "areaServed": "Worldwide",
            "availableLanguage": "English"
          }
        })}
      </script>

      {/* FAQ Schema for SEO tools */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is AstraPilot?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AstraPilot is an ultra AI-powered SEO platform that provides intelligent website analysis, keyword research, and automated recommendations to help businesses dominate search rankings."
              }
            },
            {
              "@type": "Question", 
              "name": "How does AI-powered SEO analysis work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI engine uses advanced GPT models to analyze your website's technical SEO, content quality, and competitive landscape, providing actionable insights for improvement."
              }
            },
            {
              "@type": "Question",
              "name": "Is AstraPilot free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! AstraPilot offers a free tier with essential SEO analysis features. We also provide professional and enterprise plans for advanced needs."
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;