const fs = require('fs');
const path = require('path');

// Generate dynamic sitemap for AstraPilot
const generateSitemap = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://astrapilot.com';
  const currentDate = new Date().toISOString();

  // Define all pages with their properties
  const pages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate
    },
    {
      url: '/dashboard',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/seo-tools',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/keyword-tools',
      changefreq: 'daily',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/license',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/payment',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/docs',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: currentDate
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: currentDate
    },
    {
      url: '/privacy',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate
    },
    {
      url: '/terms',
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate
    }
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(__dirname, '../public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at:', sitemapPath);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# AI and SEO crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1

# Disallow admin and sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*?*utm_*
Disallow: /*?*session*
Disallow: /*?*token*

# Allow CSS and JS for better crawling
Allow: /static/css/
Allow: /static/js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$`;

  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  console.log('✅ Robots.txt generated successfully at:', robotsPath);

  // Generate security.txt
  const securityTxt = `Contact: security@astrapilot.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Encryption: https://astrapilot.com/pgp-key.txt
Acknowledgments: https://astrapilot.com/security/acknowledgments
Policy: https://astrapilot.com/security/policy
Hiring: https://astrapilot.com/careers`;

  const securityPath = path.join(publicDir, '.well-known', 'security.txt');
  
  // Create .well-known directory if it doesn't exist
  const wellKnownDir = path.dirname(securityPath);
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }
  
  fs.writeFileSync(securityPath, securityTxt, 'utf8');
  console.log('✅ Security.txt generated successfully at:', securityPath);

  console.log('\n🚀 SEO optimization files generated:');
  console.log('   📄 sitemap.xml - Search engine discovery');
  console.log('   🤖 robots.txt - Crawler instructions');
  console.log('   🔒 security.txt - Security contact info');
  console.log('\n🎯 Next steps:');
  console.log('   1. Submit sitemap to Google Search Console');
  console.log('   2. Submit sitemap to Bing Webmaster Tools');
  console.log('   3. Monitor crawler activity in server logs');
};

// Run the generator
generateSitemap();