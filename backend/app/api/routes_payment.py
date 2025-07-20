from fastapi import APIRouter

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/checkout")
async def checkout(plan: str):
    # Placeholder: add Stripe/other integrations here
    return {"status": "paid", "plan": plan, "msg": "Simulated payment"}
