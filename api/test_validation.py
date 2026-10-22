def test_register_invalid_email(api_client, base_url):
    """R-API-6: Некорректный username (без @)"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "userexample.com",
        "password": "Password123"
    })
    assert response.status_code in [400, 422], (
        f"Ожидали 400/422, получили {response.status_code}"
    )

def test_register_short_password(api_client, base_url):
    """R-API-3: Короткий пароль"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "short@example.com",
        "password": "123"
    })
    assert response.status_code in [400, 422]

def test_register_empty_fields(api_client, base_url):
    """R-API-7: Пустые поля"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "",
        "password": ""
    })
    assert response.status_code in [400, 422]

def test_register_sql_injection(api_client, base_url):
    """R-API-13: SQL-инъекция в username"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "' OR 1=1--",
        "password": "Password123"
    })
    assert response.status_code in [400, 422], (
        "SQL-инъекция не должна проходить"
    )