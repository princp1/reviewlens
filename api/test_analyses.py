import pytest

# ============================================
# POST /api/v1/analyses/create
# ============================================

def test_create_analysis_success(api_client, base_url, auth_headers):
    """AN-P-1: Успешный запуск анализа с валидным URL Otzovik (AC-1)"""
    response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    # Ожидаем 200 или 201
    assert response.status_code in [200, 201], f"Ожидали 200/201, получили {response.status_code}"
    data = response.json()
    
    # Проверяем, что вернулся ID
    assert "id" in data, "В ответе нет ID анализа"
    assert data.get("status") == "PENDING", f"Статус не PENDING, а {data.get('status')}"


def test_create_analysis_empty_url(api_client, base_url, auth_headers):
    """AN-N-1: Пустой URL → 400"""
    response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": ""},
        headers=auth_headers
    )
    assert response.status_code == 400, f"Ожидали 400, получили {response.status_code}"


def test_create_analysis_invalid_url(api_client, base_url, auth_headers):
    """AN-N-2: Невалидный URL → 400"""
    response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "not-a-url"},
        headers=auth_headers
    )
    assert response.status_code == 400, f"Ожидали 400, получили {response.status_code}"


def test_create_analysis_wrong_marketplace(api_client, base_url, auth_headers):
    """AN-N-3: Ссылка не на Otzovik → 400"""
    response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://market.yandex.ru/product/123"},
        headers=auth_headers
    )
    assert response.status_code == 400, f"Ожидали 400, получили {response.status_code}"


def test_create_analysis_without_token(api_client, base_url):
    """AN-N-4: Запрос без токена → 401"""
    response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"}
    )
    assert response.status_code == 401, f"Ожидали 401, получили {response.status_code}"


# ============================================
# GET /api/v1/analyses
# ============================================

def test_get_analyses_empty(api_client, base_url, auth_headers):
    """AN-G-1: Получение списка (проверка структуры Pageable)"""
    # Обрати внимание: GET /analyses требует параметры пагинации!
    response = api_client.get(
        f"{base_url}/analyses?page=0&size=10", 
        headers=auth_headers
    )
    assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
    data = response.json()
    
    # Swagger говорит, что возвращается PageAnalysisDto (объект с массивом content)
    assert "content" in data, "В ответе нет поля 'content' (массива анализов)"
    assert isinstance(data["content"], list), "Поле 'content' должно быть массивом"


def test_get_analyses_filled(api_client, base_url, auth_headers):
    """AN-G-2: Получение заполненного списка"""
    # 1. Создаем анализ
    api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    # 2. Запрашиваем список
    response = api_client.get(
        f"{base_url}/analyses?page=0&size=10", 
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    
    # Проверяем, что в списке есть хотя бы один элемент
    assert len(data["content"]) >= 1, "Список должен содержать хотя бы один анализ"
    assert "id" in data["content"][0]
    assert "product_url" in data["content"][0]


def test_get_analyses_without_token(api_client, base_url):
    """AN-G-3: Запрос без токена → 401"""
    response = api_client.get(f"{base_url}/analyses?page=0&size=10")
    assert response.status_code == 401, f"Ожидали 401, получили {response.status_code}"


# ============================================
# DELETE /api/v1/analyses/{id}
# ============================================

def test_delete_own_analysis(api_client, base_url, auth_headers):
    """AN-D-1: Удаление своего анализа"""
    # 1. Создаем анализ
    create_response = api_client.post(
        f"{base_url}/analyses/create",
        json={"url": "https://otzovik.com/reviews/smartphone_apple_iphone_duo/"},
        headers=auth_headers
    )
    analysis_id = create_response.json().get("id")

    # 2. Удаляем его (передаем ID в URL!)
    response = api_client.delete(f"{base_url}/analyses/{analysis_id}", headers=auth_headers)
    
    # ВНИМАНИЕ: Если баг BUG-020 (401 при удалении) еще не починен, этот тест упадет. 
    # Это нормально — тест документирует баг.
    assert response.status_code in [200, 204], f"Ожидали 200/204, получили {response.status_code}"


def test_delete_nonexistent_analysis(api_client, base_url, auth_headers):
    """AN-D-3: Удаление несуществующего анализа → 404"""
    response = api_client.delete(f"{base_url}/analyses/999999", headers=auth_headers)
    assert response.status_code == 404, f"Ожидали 404, получили {response.status_code}"


def test_delete_analysis_without_token(api_client, base_url):
    """AN-D-4: Запрос без токена → 401"""
    response = api_client.delete(f"{base_url}/analyses/1")
    assert response.status_code == 401, f"Ожидали 401, получили {response.status_code}"