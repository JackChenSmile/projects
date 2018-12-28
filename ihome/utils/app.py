from flask import Flask

from home.home_views import home
from home.models import db
from home.order_views import order
from home.user_views import user
from utils.config import Conf
from utils.settings import STATIC_PATH, TEMPLATE_PATH
# from flask_wtf.csrf import CSRFProtect


def create_app():

    app = Flask(__name__,
                 static_folder=STATIC_PATH,
                 template_folder=TEMPLATE_PATH)

    app.config.from_object(Conf)

    app.register_blueprint(blueprint=home, url_prefix='/home')
    app.register_blueprint(blueprint=user, url_prefix='/user')
    app.register_blueprint(blueprint=order, url_prefix='/order')

    db.init_app(app)
    # CSRFProtect(app)

    return app