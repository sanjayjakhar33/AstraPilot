from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.payment import PaymentRequest, PaymentResponse
from app.services.payment_service import (
    create_checkout_session, process_subscription_payment, 
    get_payments_for_user, PaymentProcessor
)
from typing import Dict

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/create-checkout-session")
async def create_checkout(
    plan_id: str,
    billing_cycle: str = "monthly",
    user_id: int = 1,  # In real app, get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Create a checkout session for subscription payment"""
    try:
        checkout_session = await create_checkout_session(db, user_id, plan_id, billing_cycle)
        return checkout_session
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checkout creation failed: {str(e)}")

@router.post("/process-payment/{payment_id}", response_model=PaymentResponse)
async def process_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Process a pending payment"""
    try:
        payment_result = await process_subscription_payment(db, payment_id)
        return payment_result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")

@router.get("/history")
async def payment_history(
    user_id: int = 1,
    db: AsyncSession = Depends(get_db)
):
    """Get payment history for a user"""
    try:
        payments = await get_payments_for_user(db, user_id)
        return {
            "user_id": user_id,
            "payments": [
                {
                    "id": p.id,
                    "amount": p.amount,
                    "currency": p.currency,
                    "status": p.status,
                    "provider": p.provider,
                    "created_at": p.created_at
                }
                for p in payments
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch payment history: {str(e)}")

@router.post("/webhook")
async def payment_webhook(
    webhook_data: Dict,
    db: AsyncSession = Depends(get_db)
):
    """Handle payment provider webhooks (e.g., Stripe)"""
    try:
        result = await PaymentProcessor.handle_webhook(db, webhook_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

# Legacy endpoint for backwards compatibility
@router.post("/checkout", response_model=PaymentResponse)
async def checkout_legacy(payment_request: PaymentRequest):
    """Legacy checkout endpoint (deprecated)"""
    return PaymentResponse(
        status="paid", 
        plan=payment_request.plan, 
        message="Simulated payment - This endpoint is deprecated. Please use POST /payment/create-checkout-session instead."
    )
