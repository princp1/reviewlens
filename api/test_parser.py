def test_parser_otzovik_success(api_client, base_url, auth_headers):
    """Парсер Otzovik — успешный запрос (с авторизацией)"""
    response = api_client.get(
        f"{base_url}/parser/otzovik", 
        params={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    assert isinstance(response.json(), list)


def test_parser_otzovik_without_token(api_client, base_url):
    """Парсер Otzovik — без токена → 401"""
    response = api_client.get(
        f"{base_url}/parser/otzovik", 
        params={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"}
    )
    assert response.status_code == 401, f"Ожидали 401, получили {response.status_code}"


def test_parser_otzovik_invalid_url(api_client, base_url, auth_headers):
    """Парсер Otzovik — невалидный URL (с токеном)"""
    response = api_client.get(
        f"{base_url}/parser/otzovik", 
        params={"url": "not-a-url"},
        headers=auth_headers
    )
    assert response.status_code in [400, 500], f"Получили {response.status_code}"


def test_parser_otzovik_without_url(api_client, base_url, auth_headers):
    """Парсер Otzovik — без URL (с токеном)"""
    response = api_client.get(
        f"{base_url}/parser/otzovik",
        headers=auth_headers
    )
    assert response.status_code in [400, 422, 500], f"Получили {response.status_code}"