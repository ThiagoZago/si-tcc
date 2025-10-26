from flask import Blueprint, request
from app.controllers.service_controller import (
    cadastrar_servico,
    atualizar_servico_controller,
    listar_servicos_controller,
    buscar_servico_controller,
    remover_servico_controller
)

bp = Blueprint('service', __name__)

@bp.route('/services', methods=['POST'])
def post_service():
    return cadastrar_servico(request)

@bp.route('/services', methods=['GET'])
def get_services():
    return listar_servicos_controller()

@bp.route('/services/<id>', methods=['GET'])
def get_service(id):
    return buscar_servico_controller(id)

@bp.route('/services/<id>', methods=['PUT'])
def put_service(id):
    return atualizar_servico_controller(request, id)

@bp.route('/services/<id>', methods=['DELETE'])
def delete_service(id):
    return remover_servico_controller(id)
