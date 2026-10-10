import pytest
import requests

BASE_URL = "http://localhost:80/api/v1"

@pytest.fixture
def api_client():
    return requests.Session()

@pytest.fixture
def base_url():
    return BASE_URL

@pytest.fixture
def test_user():
    return {
        "username": "testuser@example.com",
        "password": "Password123"
    }