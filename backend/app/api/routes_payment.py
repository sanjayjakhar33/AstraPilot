from fastapi import APIRouter
from app.schemas.payment import PaymentRequest, PaymentResponse

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/checkout", response_model=PaymentResponse)
async def checkout(payment_request: PaymentRequest):
    # Placeholder: add Stripe/other integrations here
    return PaymentResponse(
        status="paid", 
        plan=payment_request.plan, 
        message="Simulated payment"
    )
