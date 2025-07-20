from fastapi import APIRouter

router = APIRouter(prefix="/license", tags=["License"])

@router.get("/status")
async def license_status(user_id: int):
    # Placeholder: connect to license DB/service
    return {"user_id": user_id, "active": True, "plan": "pro"}
