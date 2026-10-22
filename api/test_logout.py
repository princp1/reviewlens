import uuid

# ============================================
# ПОЗИТИВНЫЕ СЦЕНАРИИ
# ============================================

def test_logout_success(api_client, base_url, logged_in_user):
    """L-1: Успешный выход из системы"""
    response = api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    
    # Проверяем, что после выхода refreshToken больше не работает
    refresh_response = api_client.post(f"{base_url}/auth/refresh", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    assert refresh_response.status_code in [400, 401], (
        f"Токен должен быть инвалидирован после выхода! Получили {refresh_response.status_code}"
    )


# ============================================
# НЕГАТИВНЫЕ СЦЕНАРИИ
# ============================================

def test_logout_without_token(api_client, base_url):
    """L-11: Выход без токена (пустой body)"""
    response = api_client.post(f"{base_url}/auth/logout", json={})
    
    # Бэк должен вернуть 400 Bad Request, так как нечего удалять
    assert response.status_code == 400, f"BUG: Ожидали 400, получили {response.status_code}"


def test_logout_invalid_token(api_client, base_url):
    """L-11: Выход с невалидным (фейковым) токеном"""
    response = api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": "fake.invalid.token"
    })
    
    # Бэк должен вернуть 400 или 401, но не 200
    assert response.status_code in [400, 401], f"BUG: Ожидали 400/401, получили {response.status_code}"


def test_logout_already_logged_out(api_client, base_url, logged_in_user):
    """Повторный выход с уже удаленным токеном"""
    # 1. Первый выход (успешный)
    api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    
    # 2. Второй выход с тем же токеном
    response = api_client.post(f"{base_url}/auth/logout", json={
        "refreshToken": logged_in_user["refreshToken"]
    })
    
    # Так как токена уже нет в БД, должен быть 400 или 401
    assert response.status_code in [400, 401], (
        f"Повторный выход должен отклоняться. Получили {response.status_code}"
    )


def test_logout_without_body(api_client, base_url):
    """Выход вообще без тела запроса (не передан JSON)"""
    response = api_client.post(f"{base_url}/auth/logout")
    
    # Spring Boot должен вернуть 400 (Bad Request) из-за отсутствия тела
    assert response.status_code == 400, f"Ожидали 400, получили {response.status_code}"