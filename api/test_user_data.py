def test_user_data_success(api_client, base_url, auth_headers, logged_in_user):
    """P-2, P-3, P-4: Успешный запрос user-data"""
    response = api_client.get(f"{base_url}/user-data", headers=auth_headers)
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    data = response.json()
    assert "email" in data
    assert "registration_date" in data
    assert "analysis_count" in data
    assert data["email"] == logged_in_user["user"]["username"]


def test_user_data_without_token(api_client, base_url):
    """A-21: Без токена → 401"""
    response = api_client.get(f"{base_url}/user-data")
    # СЕЙЧАС 403 — БАГ (BUG-011)
    assert response.status_code == 401, f"BUG-011: Ожидали 401, получили {response.status_code}"


def test_user_data_invalid_token(api_client, base_url):
    """A-26: Фейковый токен → 401"""
    response = api_client.get(f"{base_url}/user-data", headers={
        "Authorization": "Bearer fake.jwt.token"
    })
    assert response.status_code == 401, f"BUG-011: Ожидали 401, получили {response.status_code}"