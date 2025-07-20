from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_checkout():
    response = client.post("/payment/checkout", json={"plan": "pro"})
    assert response.status_code == 200
    result = response.json()
    assert result["plan"] == "pro"
