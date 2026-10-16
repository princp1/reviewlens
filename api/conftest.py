import pytest
import requests
import uuid

BASE_URL = "http://localhost:80/api/v1"

@pytest.fixture
def api_client():
    """HTTP-клиент."""
    return requests.Session()

@pytest.fixture
def base_url():
    return BASE_URL

@pytest.fixture
def unique_user():
    """Уникальный пользователь для теста."""
    uid = uuid.uuid4().hex[:8]
    return {
        "username": f"test_{uid}@example.com",
        "password": "Password123"
    }

@pytest.fixture
def registered_user(api_client, base_url, unique_user):
    """Регистрирует пользователя."""
    api_client.post(f"{base_url}/auth/register", json=unique_user)
    return unique_user

@pytest.fixture
def logged_in_user(api_client, base_url, registered_user):
    """Логинит и возвращает токены."""
    response = api_client.post(f"{base_url}/auth/login", json=registered_user)
    data = response.json()
    return {
        "user": registered_user,
        "accessToken": data.get("accessToken"),
        "refreshToken": data.get("refreshToken"),
    }

@pytest.fixture
def auth_headers(logged_in_user):
    """Заголовки с токеном."""
    return {"Authorization": f"Bearer {logged_in_user['accessToken']}"}