from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.payment import Payment
from app.schemas.payment import PaymentRequest, PaymentResponse
from app.services.subscription_service import SubscriptionManager
from typing import Dict, Optional
import uuid
from datetime import datetime

class PaymentProcessor:
    """
    Payment processing service
    In production, integrate with real payment providers like Stripe, PayPal, etc.
    """
    
    @classmethod
    async def create_payment_intent(cls, db: AsyncSession, request: PaymentRequest, user_id: int) -> Dict:
        """Create a payment intent for subscription"""
        try:
            # Get plan details
            plan = SubscriptionManager.get_plan(request.plan)
            if not plan:
                raise ValueError(f"Invalid plan: {request.plan}")
            
            # Calculate amount based on billing cycle
            if hasattr(request, 'billing_cycle') and request.billing_cycle == "yearly":
                amount = plan.price_yearly
                billing_cycle = "yearly"
            else:
                amount = plan.price_monthly
                billing_cycle = "monthly"
            
            # Create payment record
            payment = Payment(
                user_id=user_id,
                provider="stripe",  # or "paypal", "manual", etc.
                amount=amount,
                currency="USD",
                status="pending"
            )
            db.add(payment)
            await db.commit()
            await db.refresh(payment)
            
            # Generate mock payment intent (in production, call Stripe API)
            payment_intent = {
                "payment_id": payment.id,
                "client_secret": f"pi_{uuid.uuid4().hex[:24]}",
                "amount": amount,
                "currency": "USD",
                "status": "requires_payment_method",
                "plan": request.plan,
                "billing_cycle": billing_cycle
            }
            
            return payment_intent
            
        except Exception as e:
            raise Exception(f"Payment intent creation failed: {str(e)}")
    
    @classmethod
    async def process_payment(cls, db: AsyncSession, payment_id: int, payment_method: str = "card") -> PaymentResponse:
        """Process payment (simulate successful payment)"""
        try:
            # Get payment record
            q = await db.execute(select(Payment).where(Payment.id == payment_id))
            payment = q.scalars().first()
            
            if not payment:
                raise ValueError("Payment not found")
            
            if payment.status != "pending":
                raise ValueError("Payment already processed")
            
            # Simulate payment processing
            # In production, call actual payment provider API
            success = True  # Simulate successful payment
            
            if success:
                payment.status = "completed"
                await db.commit()
                
                return PaymentResponse(
                    status="completed",
                    plan="pro",  # This should come from the payment record
                    message="Payment processed successfully",
                    payment_id=payment.id
                )
            else:
                payment.status = "failed"
                await db.commit()
                
                return PaymentResponse(
                    status="failed",
                    plan="free",
                    message="Payment processing failed",
                    payment_id=payment.id
                )
                
        except Exception as e:
            raise Exception(f"Payment processing failed: {str(e)}")
    
    @classmethod
    async def handle_webhook(cls, db: AsyncSession, webhook_data: Dict) -> Dict:
        """Handle payment provider webhook (e.g., Stripe webhook)"""
        try:
            # In production, verify webhook signature
            event_type = webhook_data.get("type")
            
            if event_type == "payment_intent.succeeded":
                payment_intent = webhook_data.get("data", {}).get("object", {})
                payment_id = payment_intent.get("metadata", {}).get("payment_id")
                
                if payment_id:
                    # Update payment status
                    q = await db.execute(select(Payment).where(Payment.id == int(payment_id)))
                    payment = q.scalars().first()
                    
                    if payment:
                        payment.status = "completed"
                        await db.commit()
                        
                        # Activate subscription
                        plan_id = payment_intent.get("metadata", {}).get("plan_id", "basic")
                        billing_cycle = payment_intent.get("metadata", {}).get("billing_cycle", "monthly")
                        
                        from app.services.subscription_service import create_subscription
                        await create_subscription(db, payment.user_id, plan_id, billing_cycle)
                        
                        return {"status": "processed", "message": "Subscription activated"}
            
            return {"status": "ignored", "message": "Event type not handled"}
            
        except Exception as e:
            return {"status": "error", "message": f"Webhook processing failed: {str(e)}"}

# Enhanced service functions
async def create_checkout_session(db: AsyncSession, user_id: int, plan_id: str, billing_cycle: str = "monthly") -> Dict:
    """Create a checkout session for subscription"""
    try:
        plan = SubscriptionManager.get_plan(plan_id)
        if not plan:
            raise ValueError(f"Invalid plan: {plan_id}")
        
        # Create payment request
        payment_request = PaymentRequest(plan=plan_id, user_id=user_id)
        payment_request.billing_cycle = billing_cycle
        
        # Create payment intent
        payment_intent = await PaymentProcessor.create_payment_intent(db, payment_request, user_id)
        
        # In production, create actual Stripe checkout session
        checkout_session = {
            "checkout_url": f"https://checkout.stripe.com/pay/{payment_intent['client_secret']}",
            "session_id": f"cs_{uuid.uuid4().hex[:24]}",
            "payment_intent": payment_intent,
            "success_url": "https://yourdomain.com/success",
            "cancel_url": "https://yourdomain.com/cancel"
        }
        
        return checkout_session
        
    except Exception as e:
        raise Exception(f"Checkout session creation failed: {str(e)}")

async def create_payment(db: AsyncSession, user_id: int, provider: str, amount: float, currency: str, status: str = "pending"):
    """Create a payment record"""
    payment = Payment(
        user_id=user_id,
        provider=provider,
        amount=amount,
        currency=currency,
        status=status
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment

async def get_payments_for_user(db: AsyncSession, user_id: int):
    """Get all payments for a user"""
    q = await db.execute(select(Payment).where(Payment.user_id == user_id))
    return q.scalars().all()

async def set_payment_status(db: AsyncSession, payment_id: int, status: str):
    """Update payment status"""
    q = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = q.scalars().first()
    if payment:
        payment.status = status
        await db.commit()
        await db.refresh(payment)
    return payment

async def process_subscription_payment(db: AsyncSession, payment_id: int) -> PaymentResponse:
    """Process a subscription payment"""
    return await PaymentProcessor.process_payment(db, payment_id)
