# ============================================
# SQL-ИНЪЕКЦИИ
# ============================================

def test_register_sql_injection_username(api_client, base_url):
    """R-13: SQL-инъекция в username → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "' OR 1=1--",
        "password": "Password123"
    })
    # СЕЙЧАС 200 — БАГ (BUG-010)
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"
    assert response.status_code != 500, "SQL-инъекция уронила бэк"


def test_register_sql_injection_password(api_client, base_url):
    """R-14: SQL-инъекция в password → 400"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "test@example.com",
        "password": "' OR '1'='1"
    })
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_login_sql_injection_username(api_client, base_url):
    """A-17: SQL-инъекция в login → не 200"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": "' OR 1=1--",
        "password": "Password123"
    })
    assert response.status_code != 200, "SQL-инъекция прошла!"
    assert response.status_code != 500, "SQL-инъекция уронила бэк"


def test_login_sql_injection_password(api_client, base_url, registered_user):
    """A-18: SQL-инъекция в пароль → не 200"""
    response = api_client.post(f"{base_url}/auth/login", json={
        "username": registered_user["username"],
        "password": "' OR '1'='1"
    })
    assert response.status_code != 200, "SQL-инъекция прошла!"


# ============================================
# XSS
# ============================================

def test_register_xss_username(api_client, base_url):
    """R-15: XSS в username → не 200"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "<script>alert('XSS')</script>",
        "password": "Password123"
    })
    assert response.status_code != 500, "XSS уронил бэк"
    # Ожидаем 400 (BUG-010)
    assert response.status_code == 400, f"BUG-010: Ожидали 400, получили {response.status_code}"


def test_register_xss_password(api_client, base_url):
    """R-16: XSS в password → не 500"""
    response = api_client.post(f"{base_url}/auth/register", json={
        "username": "test@example.com",
        "password": "<img src=x onerror=alert(1)>"
    })
    assert response.status_code != 500, "XSS уронил бэк"