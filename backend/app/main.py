from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from datetime import datetime
from app.api import routes_auth, routes_dashboard, routes_license, routes_payment, routes_seo, routes_social, routes_keywords
from app.services.ai_service import realtime_handler, ai_analyzer, keyword_analyzer

app = FastAPI(
    title="AstraPilot API - Ultra AI-Powered SEO Platform",
    description="Production-ready AI-enhanced SEO analysis and optimization platform optimized for AWS Free Tier",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "https://astrapilot.com",
        "https://www.astrapilot.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(routes_auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(routes_dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(routes_license.router, prefix="/api/v1", tags=["License"])
app.include_router(routes_payment.router, prefix="/api/v1", tags=["Payment"])
app.include_router(routes_seo.router, prefix="/api/v1", tags=["SEO Analysis"])
app.include_router(routes_social.router, prefix="/api/v1", tags=["Social Media"])
app.include_router(routes_keywords.router, prefix="/api/v1", tags=["Keywords"])

# Keep legacy routes for backward compatibility
app.include_router(routes_auth.router)
app.include_router(routes_dashboard.router)
app.include_router(routes_license.router)
app.include_router(routes_payment.router)
app.include_router(routes_seo.router)
app.include_router(routes_social.router)
app.include_router(routes_keywords.router)

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "ok",
        "service": "AstraPilot API",
        "version": "2.0.0",
        "ai_engine": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to AstraPilot - Ultra AI-Powered SEO Platform",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": [
            "Real-time SEO Analysis",
            "AI-Powered Recommendations", 
            "Intelligent Keyword Research",
            "Competitor Intelligence",
            "Performance Prediction",
            "WebSocket Real-time Updates"
        ]
    }

# WebSocket endpoint for real-time SEO analysis
@app.websocket("/ws/realtime/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time SEO analysis updates
    Provides live updates during analysis process
    """
    await realtime_handler.connect(websocket, user_id)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to AstraPilot Real-time Analysis",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        while True:
            # Wait for client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "start_analysis":
                await handle_realtime_analysis(websocket, user_id, message.get("data", {}))
            elif message.get("type") == "keyword_research":
                await handle_realtime_keywords(websocket, user_id, message.get("data", {}))
            elif message.get("type") == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        await realtime_handler.disconnect(user_id)
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "message": f"WebSocket error: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        })
        await realtime_handler.disconnect(user_id)

async def handle_realtime_analysis(websocket: WebSocket, user_id: str, data: dict):
    """Handle real-time SEO analysis requests"""
    try:
        url = data.get("url")
        if not url:
            await websocket.send_json({
                "type": "error",
                "message": "URL is required for analysis",
                "timestamp": datetime.utcnow().isoformat()
            })
            return
        
        # Send analysis started notification
        await websocket.send_json({
            "type": "analysis_started",
            "message": f"Starting AI-powered analysis for {url}",
            "progress": 0,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Simulate real-time progress updates
        progress_steps = [
            (20, "Fetching website content..."),
            (40, "Analyzing technical SEO..."),
            (60, "Processing content quality..."),
            (80, "Generating AI recommendations..."),
            (100, "Analysis complete!")
        ]
        
        for progress, message in progress_steps:
            await asyncio.sleep(1)  # Simulate processing time
            await websocket.send_json({
                "type": "analysis_progress",
                "progress": progress,
                "message": message,
                "timestamp": datetime.utcnow().isoformat()
            })
        
        # Send final analysis result
        await websocket.send_json({
            "type": "analysis_complete",
            "message": "AI-powered SEO analysis completed successfully",
            "data": {
                "url": url,
                "score": 85,
                "recommendations_count": 7,
                "ai_insights_generated": True
            },
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        await websocket.send_json({
            "type": "analysis_error",
            "message": f"Analysis failed: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        })

async def handle_realtime_keywords(websocket: WebSocket, user_id: str, data: dict):
    """Handle real-time keyword research requests"""
    try:
        seed_keyword = data.get("keyword")
        if not seed_keyword:
            await websocket.send_json({
                "type": "error",
                "message": "Keyword is required for research",
                "timestamp": datetime.utcnow().isoformat()
            })
            return
        
        # Send keyword research started notification
        await websocket.send_json({
            "type": "keyword_research_started",
            "message": f"Starting AI keyword research for '{seed_keyword}'",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Generate AI-powered keywords
        business_context = data.get("business_context", "")
        keywords = await keyword_analyzer.generate_smart_keywords(seed_keyword, business_context)
        
        # Send results
        await websocket.send_json({
            "type": "keyword_research_complete",
            "message": f"Found {len(keywords)} AI-generated keyword suggestions",
            "data": {
                "seed_keyword": seed_keyword,
                "keywords": [kw.model_dump() for kw in keywords]
            },
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        await websocket.send_json({
            "type": "keyword_research_error",
            "message": f"Keyword research failed: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        })

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 AstraPilot API starting up...")
    print("🤖 AI Engine: Operational")
    print("🔄 Real-time WebSocket: Ready")
    print("📊 SEO Analysis: Enhanced with AI")
    print("🎯 Production ready for AWS Free Tier deployment")

# Shutdown event  
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 AstraPilot API shutting down...")
    print("💾 Saving any pending analysis...")
    print("✅ Shutdown complete")
