from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_site():
    url = "https://example.com"
    response = client.get("/seo/analyze", params={"url": url})
    assert response.status_code == 200
    result = response.json()
    assert result.get("url") == url
    assert "score" in result
