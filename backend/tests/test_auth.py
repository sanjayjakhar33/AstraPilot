from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    user_data = {
        "username": "authtestuser",
        "email": "authtest@example.com",
        "password": "supersecret"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code in (201, 409)  # 409 if already exists

def test_login_unverified_user():
    """Test that users with unverified emails cannot login"""
    response = client.post(
        "/auth/login",
        data={"username": "authtestuser", "password": "supersecret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    # Should be 403 for unverified email or 401 if credentials are wrong
    assert response.status_code in (401, 403)
    if response.status_code == 403:
        assert "email not verified" in response.json()["detail"].lower()
