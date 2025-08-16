from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_auth, routes_dashboard, routes_license, routes_payment, routes_seo, routes_social, routes_keywords

app = FastAPI(
    title="1clickseo API",
    description="Ultra-rich SEO & AI SaaS backend",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_auth.router)
app.include_router(routes_dashboard.router)
app.include_router(routes_license.router)
app.include_router(routes_payment.router)
app.include_router(routes_seo.router)
app.include_router(routes_social.router)
app.include_router(routes_keywords.router)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok"}
