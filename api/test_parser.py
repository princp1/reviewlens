def test_parser_otzovik_success(api_client, base_url):
    """Парсер Otzovik — успешный запрос"""
    response = api_client.get(f"{base_url}/parser/otzovik", params={
        "url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"
    })
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    assert isinstance(response.json(), list)


def test_parser_otzovik_invalid_url(api_client, base_url):
    """Парсер Otzovik — невалидный URL"""
    response = api_client.get(f"{base_url}/parser/otzovik", params={
        "url": "not-a-url"
    })
    assert response.status_code in [400, 500], f"Получили {response.status_code}"


def test_parser_otzovik_without_url(api_client, base_url):
    """Парсер Otzovik — без URL"""
    response = api_client.get(f"{base_url}/parser/otzovik")
    assert response.status_code in [400, 422, 500], f"Получили {response.status_code}"