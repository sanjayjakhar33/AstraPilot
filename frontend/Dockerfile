# Frontend Production Dockerfile - Ultra-optimized for SEO and Performance
FROM node:18-alpine as build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies (including react-helmet)
RUN npm ci --only=production --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment configuration
ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL
ARG REACT_APP_ENVIRONMENT=production
ARG REACT_APP_CLOUDFRONT_DOMAIN
ARG REACT_APP_BASE_URL=https://astrapilot.com

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT
ENV REACT_APP_CLOUDFRONT_DOMAIN=$REACT_APP_CLOUDFRONT_DOMAIN
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

# Generate SEO files
RUN npm run generate-sitemap

# Build the app with optimizations
RUN npm run build

# Production stage with optimized Nginx
FROM nginx:alpine

# Install additional tools for performance
RUN apk add --no-cache gzip brotli

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers and performance optimizations
RUN echo 'server_tokens off;' >> /etc/nginx/nginx.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Compress static assets
RUN find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" -o -name "*.xml" \) -exec gzip -k {} \;

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

# Add labels for better management
LABEL maintainer="AstraPilot Team <team@astrapilot.com>" \
      version="2.0" \
      description="Ultra AI-Powered SEO Platform Frontend" \
      org.opencontainers.image.title="AstraPilot Frontend" \
      org.opencontainers.image.description="Production-ready React frontend for AstraPilot SEO platform" \
      org.opencontainers.image.vendor="AstraPilot" \
      org.opencontainers.image.version="2.0"

CMD ["nginx", "-g", "daemon off;"]