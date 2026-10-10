def test_register_success(api_client, base_url, test_user):
    """R-API-1: Успешная регистрация"""
    response = api_client.post(f"{base_url}/auth/register", json=test_user)
    assert response.status_code in [200, 201], (
        f"Ожидали 200/201, получили {response.status_code}: {response.text}"
    )

def test_register_duplicate(api_client, base_url, test_user):
    """R-API-2: Повторная регистрация того же username"""
    api_client.post(f"{base_url}/auth/register", json=test_user)
    response = api_client.post(f"{base_url}/auth/register", json=test_user)
    assert response.status_code in [400, 409], (
        f"Ожидали 400/409, получили {response.status_code}"
    )

def test_login_success(api_client, base_url, test_user):
    """A-API-1: Успешный логин"""
    api_client.post(f"{base_url}/auth/register", json=test_user)
    response = api_client.post(f"{base_url}/auth/login", json=test_user)
    assert response.status_code == 200, (
        f"Ожидали 200, получили {response.status_code}: {response.text}"
    )
    data = response.json()
    assert "accessToken" in data or "token" in data or "access_token" in data

def test_login_wrong_password(api_client, base_url, test_user):
    """A-API-6: Неверный пароль"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": test_user["username"],
        "password": "wrongpassword"
    })
    assert response.status_code in [400, 401], (
        f"Ожидали 400/401, получили {response.status_code}"
    )

def test_login_empty_username(api_client, base_url):
    """A-API-8: Пустой username"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "",
        "password": "Password123"
    })
    assert response.status_code in [400, 401]

def test_logout_without_token(api_client, base_url):
    """A-API-24: Logout без refreshToken"""
    response = api_client.post(f"{base_url}/auth/logout", json={})
    assert response.status_code in [400, 401]