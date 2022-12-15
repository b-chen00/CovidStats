def test_home_page(flask_app):
    url='/'
    response = flask_app.get(url)
    assert response.status_code == 200

def test_stats_page(flask_app):
    url='/stats'
    response = flask_app.get(url)
    assert response.status_code == 200

def test_compare_page(flask_app):
    url='/compare'
    response = flask_app.get(url)
    assert response.status_code == 200
