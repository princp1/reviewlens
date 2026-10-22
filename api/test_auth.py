import uuid

# ============================================
# РЕГИСТРАЦИЯ
# ============================================

def test_register_success(api_client, base_url, unique_user):
    """R-1: Успешная регистрация"""
    response = api_client.post(f"{base_url}/auth/register", json=unique_user)
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    assert "registered successfully" in response.text.lower()


def test_register_duplicate_username(api_client, base_url, registered_user):
    """R-2: Дубликат username"""
    response = api_client.post(f"{base_url}/auth/register", json=registered_user)
    assert response.status_code in [400, 409], f"Ожидали 400/409, получили {response.status_code}"


def test_register_empty_username(api_client, base_url):
    """R-7: Пустой username → должен быть 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "",
        "password": "Password123"
    })
    # СЕЙЧАС 200 — БАГ (BUG-010)
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_empty_password(api_client, base_url):
    """R-10: Пустой password → должен быть 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "password": ""
    })
    # СЕЙЧАС 200 — БАГ (BUG-010)
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_both_empty(api_client, base_url):
    """R-11: Оба поля пустые → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "",
        "password": ""
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_short_password(api_client, base_url):
    """R-5: Короткий пароль → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "password": "123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_invalid_email(api_client, base_url):
    """R-6: Некорректный email → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "userexample.com",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_email_without_at(api_client, base_url):
    """R-6: Email без @ → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "user.com",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_email_without_domain(api_client, base_url):
    """R-6: Email без домена → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "user@",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_email_with_space(api_client, base_url):
    """R-8: Пробел в email → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "user @example.com",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_very_long_email(api_client, base_url):
    """R-19: Очень длинный email → 400"""
    long_email = "a" * 300 + "@example.com"
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": long_email,
        "password": "Password123"
    })
    # СЕЙЧАС 403 — БАГ (BUG-013)
    assert response.status_code == 400, f"BUG-013: Ожидали 400, получили {response.status_code}"


# ============================================
# ЛОГИН
# ============================================

def test_login_success(api_client, base_url, registered_user):
    """A-1: Успешный логин"""
    response = api_client.post(f"{base_url}/auth/login", json=registered_user)
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    data = response.json()
    assert "accessToken" in data, "Нет accessToken"
    assert "refreshToken" in data, "Нет refreshToken"
    assert data["accessToken"], "accessToken пустой"
    assert data["refreshToken"], "refreshToken пустой"


def test_login_wrong_password(api_client, base_url, registered_user):
    """A-6: Неверный пароль → 401"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": registered_user["username"],
        "password": "WrongPassword"
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_nonexistent_user(api_client, base_url):
    """A-7: Несуществующий email → 401"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": f"nouser_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Password123"
    })
    assert response.status_code == 401, f"BUG-011: Ожидали 401, получили {response.status_code}"


def test_login_empty_username(api_client, base_url):
    """A-8: Пустой username → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_empty_password(api_client, base_url):
    """A-9: Пустой password → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "password": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_both_empty(api_client, base_url):
    """A-10: Оба пустые → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "",
        "password": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


# ============================================
# REFRESH
# ============================================

def test_refresh_success(api_client, base_url, logged_in_user):
    """Refresh: успешный"""
    response = api_client.post(f"{base_url}/auth/refresh", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    assert "accessToken" in response.json()


def test_refresh_invalid_token(api_client, base_url):
    """Refresh: невалидный токен → 401"""
    response = api_client.post(f"{base_url}/auth/refresh", json={
        "refreshToken": "fake.token.value"
    })
    # СЕЙЧАС 403 или 500 — БАГ (BUG-011)
    assert response.status_code == 401, f"BUG-011: Ожидали 401, получили {response.status_code}"


def test_refresh_empty_token(api_client, base_url):
    """Refresh: пустой токен → 400"""
    response = api_client.post(f"{base_url}/auth/refresh", json={
        "refreshToken": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


# ============================================
# LOGOUT
# ============================================

def test_logout_success(api_client, base_url, logged_in_user):
    """L-1: Успешный logout"""
    response = api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"


def test_logout_without_token(api_client, base_url):
    """L-11: Logout без токена → 400"""
    response = api_client.post(f"{base_url}/auth/logout", json={})
    # СЕЙЧАС 200 — БАГ (BUG-012)
    assert response.status_code == 400, f"BUG-012: Ожидали 400, получили {response.status_code}"


def test_logout_invalid_token(api_client, base_url):
    """L-11: Logout с невалидным токеном → 400/401"""
    response = api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": "fake.token"
    })
    # СЕЙЧАС 200 — БАГ (BUG-012)
    assert response.status_code in [400, 401], f"BUG-012: Ожидали 400/401, получили {response.status_code}"