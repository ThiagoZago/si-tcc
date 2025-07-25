from flask import Flask
from .extensions import mongo, jwt, cors
from .routes import auth_routes, schedule_routes, business_routes
from .config import DevelopmentConfig
from dotenv import load_dotenv
from datetime import timedelta
import os

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config.from_object(DevelopmentConfig)
    app.config["MONGO_URI"] = os.getenv("MONGO_CONECTION")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    mongo.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(schedule_routes.bp)
    app.register_blueprint(business_routes.bp)

    return app
