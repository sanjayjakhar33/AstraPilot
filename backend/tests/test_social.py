from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_social_profile():
    response = client.get("/social/profile", params={"username": "authtestuser"})
    assert response.status_code == 200
    data = response.json()
    assert "username" in data
    assert "platforms" in data
