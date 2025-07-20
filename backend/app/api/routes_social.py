from fastapi import APIRouter

router = APIRouter(prefix="/social", tags=["Social"])

@router.get("/profile")
async def get_social_profile(username: str):
    # Placeholder: add real social integration
    return {"username": username, "platforms": ["facebook", "x", "linkedin"]}
