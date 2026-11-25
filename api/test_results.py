import time


# ============================================
# GET /api/v1/analyses/{id} (Задача tpivt10_26-83)
# ============================================

def test_get_analysis_by_id_success(api_client, base_url, auth_headers):
    """AN-ID-1: Успешное получение своего анализа по ID (AC-1)"""
    # 1. Создаем анализ
    create_resp = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers,
    )
    assert create_resp.status_code in [200, 201], f"Не удалось создать анализ: {create_resp.status_code}"
    analysis_id = create_resp.json()["id"]

    # 2. Получаем результат анализа по ID
    response = api_client.get(
        f"{base_url}/analyses/{analysis_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    data = response.json()

    assert data.get("id") == analysis_id, "ID в ответе не совпадает с запрошенным"
    assert "status" in data, "В ответе отсутствует поле 'status'"


def test_get_analysis_by_id_without_token(api_client, base_url):
    """AN-ID-2: Запрос результата анализа без токена → 401 (AC-1)"""
    response = api_client.get(f"{base_url}/analyses/1")
    assert response.status_code == 401, f"Ожидали 401, получили {response.status_code}"


def test_get_analysis_by_id_other_user_forbidden(api_client, base_url, auth_headers):
    """AN-ID-3: Изоляция данных (IDOR) — Юзер Б не видит анализ Юзера А → 403/404 (AC-1)"""
    # 1. Юзер А создает анализ
    create_resp = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers,
    )
    assert create_resp.status_code in [200, 201]
    analysis_id = create_resp.json()["id"]

    # 2. Регистрируем Юзера Б (ключ "username", как в conftest.py)
    user_b_creds = {
        "username": f"qa_idor_{int(time.time() * 1000)}@example.com",
        "password": "Password123",
    }
    reg_resp = api_client.post(f"{base_url}/auth/register", json=user_b_creds)
    assert reg_resp.status_code in [200, 201], (
        f"Не удалось зарегистрировать Юзера Б: {reg_resp.status_code} {reg_resp.text}"
    )

    # 3. Логиним Юзера Б и забираем access_token
    login_resp = api_client.post(f"{base_url}/auth/login", json=user_b_creds)
    assert login_resp.status_code == 200, f"Не удалось залогинить Юзера Б: {login_resp.status_code}"
    token_b = login_resp.json().get("access_token") or login_resp.json().get("token")
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 4. Юзер Б пытается получить анализ Юзера А
    response = api_client.get(
        f"{base_url}/analyses/{analysis_id}",
        headers=headers_b,
    )
    assert response.status_code in [403, 404, 401], (
        f"Уязвимость IDOR! Ожидали 401, 403 или 404 для чужого анализа, получили {response.status_code}"
    )

def test_get_analysis_by_id_not_found(api_client, base_url, auth_headers):
    """AN-ID-4: Запрос несуществующего ID → 404"""
    response = api_client.get(
        f"{base_url}/analyses/99999999",
        headers=auth_headers,
    )
    assert response.status_code == 404, f"Ожидали 404, получили {response.status_code}"