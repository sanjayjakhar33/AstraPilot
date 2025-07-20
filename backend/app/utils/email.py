import smtplib
from email.message import EmailMessage
from typing import Optional

def send_email(subject: str, recipient: str, body: str, sender: Optional[str] = None):
    sender = sender or "no-reply@example.com"
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    msg.set_content(body)

    # For production, set up SMTP credentials in your .env or config
    smtp_server = "localhost"
    smtp_port = 25
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
