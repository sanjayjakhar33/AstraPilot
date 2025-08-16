import smtplib
from email.message import EmailMessage
from typing import Optional
from app.settings import settings

def send_email(subject: str, recipient: str, body: str, sender: Optional[str] = None):
    """Send email using Zoho SMTP configuration"""
    sender = sender or settings.SMTP_FROM_EMAIL
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()  # Enable TLS encryption
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False

def send_otp_email(email: str, otp_code: str, username: str):
    """Send OTP verification email"""
    subject = "AstraPilot - Email Verification Code"
    body = f"""
Hello {username},

Welcome to AstraPilot! Please use the following verification code to complete your registration:

Verification Code: {otp_code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The AstraPilot Team
"""
    return send_email(subject, email, body)
