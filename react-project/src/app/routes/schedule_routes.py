from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.controllers import schedule_controller

bp = Blueprint("schedule", __name__)

@bp.route("/agendar", methods=["POST"])
def agendar():
    return schedule_controller.agendar(request)

# @bp.route("/agendamentos_passados", methods=["GET"])
# @jwt_required()
# def agendamentos_passados():
#     return schedule_controller.agendamentos_passados(request)
