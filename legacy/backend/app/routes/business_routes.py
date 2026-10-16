from flask import Blueprint, request
from app.controllers.business_controller import (
    cadastrar_estabelecimento,
    atualizar_estabelecimento,
    recuperar_estabelecimento,
    excluir_estabelecimento
)

bp = Blueprint('business', __name__)

@bp.route('/business', methods=['POST'])
def post_business():
    return cadastrar_estabelecimento(request)

@bp.route('/business', methods=['PUT'])
def put_business():
    return atualizar_estabelecimento(request)

@bp.route('/business', methods=['GET'])
def get_business():
    return recuperar_estabelecimento()

@bp.route('/business', methods=['DELETE'])
def delete_business():
    return excluir_estabelecimento()
