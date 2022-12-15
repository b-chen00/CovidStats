import pytest

from app import app
# from werkzeug.security import generate_password_hash

@pytest.fixture(scope='session')
def flask_app():
    app.config.update({'TESTING': True})
    with app.test_client() as client:
        yield client
