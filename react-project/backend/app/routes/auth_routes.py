from flask import Blueprint, request, jsonify
from app.controllers import auth_controller
from flask_jwt_extended import jwt_required

bp = Blueprint("auth", __name__)

@bp.route("/registro", methods=["POST"])
def register():
    return auth_controller.register(request)

@bp.route("/acesso", methods=["POST"])
def login():
    return auth_controller.login(request)

@bp.route("/inicio", methods=["GET"])
@jwt_required()
def dashboard():
    return auth_controller.dashboard()
