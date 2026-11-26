import uuid

# РЕГИСТРАЦИЯ

def test_register_success(api_client, base_url, unique_user):
    """R-1: Успешная регистрация (возвращает токены)"""
    response = api_client.post(f"{base_url}/auth/register", json=unique_user)
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    
    data = response.json()
    # Проверяем, что бэк сразу выдал токены
    assert "accessToken" in data, "В ответе нет accessToken"
    assert "refreshToken" in data, "В ответе нет refreshToken"

def test_register_duplicate_username(api_client, base_url, empty_user):
    """R-5, R-6, R-7: Пустые поля → 400"""
    response = api_client.post(f"{base_url}/auth/register", json=empty_user)
    assert response.status_code == 400, f"Ожидали 400, получили {response.status_code}"

def test_register_email_without_at(api_client, base_url):
    """R-E1: Email без @ → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user.com",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_without_domain(api_client, base_url):
    """R-E2: Email без домена → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user@",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_without_domain(api_client, base_url):
    """R-E3: Email без локальной части → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "@example.com",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_with_space(api_client, base_url):
    """R-Е4: Пробел в email → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user @example.com",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_with_space(api_client, base_url):
    """R-Е5: email с двумя @ → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user@@example.com",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_with_space(api_client, base_url):
    """R-Е6: email с двумя . подряд → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user@example..com",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_email_with_space(api_client, base_url):
    """R-Е9: email без ТЛД → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "user@example",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"

def test_register_very_long_email(api_client, base_url):

    """R-Е10: Очень короткий email → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": "a@c.",
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-013: Ожидали 400, получили {response.status_code}"

def test_register_very_long_email(api_client, base_url):

    """R-Е11: Очень длинный email → 400"""
    long_email = "a" * 244 + "@example.com"
    response = api_client.post(f"{base_url}/auth/register", json={
    "username": long_email,
    "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-013: Ожидали 400, получили {response.status_code}"

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
    """A-5: Неверный пароль → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": registered_user["username"],
        "password": "WrongPassword"
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"

def test_login_wrong_password(api_client, base_url, registered_user):
    """A-6: Несуществующая почта → 401"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": registered_user["username"],
        "password": "WrongPassword"
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 401, получили {response.status_code}"



def test_login_empty_username(api_client, base_url):
    """A-7: Пустой username → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "",
        "password": "Password123"
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_empty_password(api_client, base_url):
    """A-8: Пустой password → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "password": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_both_empty(api_client, base_url):
    """A-9: Оба пустые → 400"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "",
        "password": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"


def test_login_email_trim_and_case_insensitive(api_client, base_url, registered_user):
    """AG-1 / AG-2: Логин с пробелами по краям и в верхнем регистре"""
    modified_creds = {
        "username": f"  {registered_user['username'].upper()}  ",
        "password": registered_user["password"],
    }
    response = api_client.post(f"{base_url}/auth/login", json=modified_creds)
    assert response.status_code == 400, (
        f"Ожидали 400 при вводе email с пробелами/верхним регистром, получили {response.status_code}"
    )

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
    assert response.status_code == 401, f"BUG-011: Ожидали 401, получили {response.status_code}"


def test_refresh_empty_token(api_client, base_url):
    """Refresh: пустой токен → 400"""
    response = api_client.post(f"{base_url}/auth/refresh", json={
        "refreshToken": ""
    })
    assert response.status_code == 400, f"BUG-011: Ожидали 400, получили {response.status_code}"