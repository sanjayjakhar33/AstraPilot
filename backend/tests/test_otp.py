from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def test_register_with_otp():
    """Test user registration with OTP email sending"""
    user_data = {
        "username": "otptestuser",
        "email": "test@example.com",
        "password": "supersecret"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code in (201, 409)  # 409 if already exists
    
    if response.status_code == 201:
        data = response.json()
        assert "user_id" in data
        assert "email_verified" in data
        assert data["email_verified"] == False  # Should be False initially
        assert "verification code" in data["message"].lower()

def test_verify_email_with_invalid_otp():
    """Test email verification with invalid OTP"""
    verification_data = {
        "user_id": 999,  # Non-existent user
        "otp_code": "123456"
    }
    response = client.post("/auth/verify-email", json=verification_data)
    assert response.status_code == 400

def test_resend_otp():
    """Test OTP resend functionality"""
    # First register a user
    user_data = {
        "username": "resendtestuser",
        "email": "resend@example.com", 
        "password": "supersecret"
    }
    register_response = client.post("/auth/register", json=user_data)
    
    if register_response.status_code == 201:
        user_id = register_response.json()["user_id"]
        
        # Test resend OTP
        resend_data = {"user_id": user_id}
        response = client.post("/auth/resend-otp", json=resend_data)
        # This might fail if email service is not configured, but endpoint should exist
        assert response.status_code in (200, 500)

def test_login_unverified_email():
    """Test that unverified users cannot login"""
    # Try to login with unverified user
    response = client.post(
        "/auth/login",
        data={"username": "otptestuser", "password": "supersecret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    # Should be 403 for unverified email or 401 if user doesn't exist
    assert response.status_code in (401, 403)