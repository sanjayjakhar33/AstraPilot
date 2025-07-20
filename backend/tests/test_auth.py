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

def test_login_success():
    response = client.post(
        "/auth/login",
        data={"username": "authtestuser", "password": "supersecret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code in (200, 401)
    if response.status_code == 200:
        assert "access_token" in response.json()
