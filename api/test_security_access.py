import pytest
import uuid

def test_get_analyses_without_token(api_client, base_url):
    """Запрос списка анализов без токена должен вернуть 401"""
    response = api_client.get(f"{base_url}/analyses?page=0&size=10")
    assert response.status_code == 401, \
        f"BUG SECURITY: Ожидали 401 (Unauthorized), получили {response.status_code}. Эндпоинт не защищен!"

def test_create_analysis_without_token(api_client, base_url):
    """Создание анализа без токена должно вернуть 401"""
    response = api_client.post(
        f"{base_url}/analyses/create", 
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"}
    )
    assert response.status_code == 401, \
        f"BUG SECURITY: Ожидали 401, получили {response.status_code}."

def test_delete_analysis_without_token(api_client, base_url):
    """Удаление анализа без токена должно вернуть 401"""
    # Пытаемся удалить несуществующий ID, но без токена
    response = api_client.delete(f"{base_url}/analyses/999")
    assert response.status_code == 401, \
        f"BUG SECURITY: Ожидали 401, получили {response.status_code}."

def test_user_data_without_token(api_client, base_url):
    """Получение данных пользователя без токена должно вернуть 401"""
    response = api_client.get(f"{base_url}/user-data")
    assert response.status_code == 401, \
        f"BUG SECURITY: Ожидали 401, получили {response.status_code}."

def test_cannot_read_others_analysis(api_client, base_url, auth_headers):
    """
    Проверка IDOR: Юзер Б не должен видеть анализ Юзера А.
    """
    # 1. Юзер А (наш auth_headers) создает анализ
    create_response = api_client.post(
        f"{base_url}/analyses/create", 
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    analysis_id = create_response.json().get("id")
    assert analysis_id is not None, "Не удалось создать анализ для теста"

    # 2. Создаем Юзера Б
    user_b_data = {
        "username": f"hacker_{uuid.uuid4().hex[:8]}@example.com", 
        "password": "Password123"
    }
    api_client.post(f"{base_url}/auth/register", json=user_b_data)
    login_b = api_client.post(f"{base_url}/auth/login", json=user_b_data)
    token_b = login_b.json().get("accessToken")
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Юзер Б пытается прочитать чужой анализ
    response = api_client.get(f"{base_url}/analyses/{analysis_id}", headers=headers_b)
    
    # Ожидаем 403 (Запрещено) или 404 (Не найдено)
    assert response.status_code in [403, 404], \
        f"BUG SECURITY (IDOR): Юзер Б прочитал чужой анализ! Код ответа: {response.status_code}"

def test_cannot_delete_others_analysis(api_client, base_url, auth_headers):
    """
    Проверка IDOR: Юзер Б не должен удалять анализ Юзера А.
    """
    # 1. Юзер А создает анализ
    create_response = api_client.post(
        f"{base_url}/analyses/create", 
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    analysis_id = create_response.json().get("id")

    # 2. Создаем Юзера Б
    user_b_data = {
        "username": f"hacker_{uuid.uuid4().hex[:8]}@example.com", 
        "password": "Password123"
    }
    api_client.post(f"{base_url}/auth/register", json=user_b_data)
    login_b = api_client.post(f"{base_url}/auth/login", json=user_b_data)
    token_b = login_b.json().get("accessToken")
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Юзер Б пытается удалить чужой анализ
    response = api_client.delete(f"{base_url}/analyses/{analysis_id}", headers=headers_b)
    
    assert response.status_code in [403, 404], \
        f"BUG SECURITY (IDOR): Юзер Б удалил чужой анализ! Код ответа: {response.status_code}"