from flask import Flask
from .extensions import mongo, jwt, cors
from .routes import auth_routes, schedule_routes
from .config import DevelopmentConfig
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    app.config["MONGO_URI"] = os.getenv("MONGO_CONECTION")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    mongo.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(schedule_routes.bp)

    return app
