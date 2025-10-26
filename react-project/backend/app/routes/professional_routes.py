from flask import Blueprint, request
from app.controllers.professional_controller import (
    cadastrar_profissional,
    atualizar_profissional_controller,
    listar_profissionais_controller,
    buscar_profissional_controller,
    remover_profissional_controller
)

bp = Blueprint('professional', __name__)

@bp.route('/professionals', methods=['POST'])
def post_professional():
    return cadastrar_profissional(request)

@bp.route('/professionals', methods=['GET'])
def get_professionals():
    return listar_profissionais_controller()

@bp.route('/professionals/<id>', methods=['GET'])
def get_professional(id):
    return buscar_profissional_controller(id)

@bp.route('/professionals/<id>', methods=['PUT'])
def put_professional(id):
    return atualizar_profissional_controller(request, id)

@bp.route('/professionals/<id>', methods=['DELETE'])
def delete_professional(id):
    return remover_profissional_controller(id)
