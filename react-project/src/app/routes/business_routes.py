from flask import Blueprint, request
from app.controllers.business_controller import cadastrar_estabelecimento

bp = Blueprint('business', __name__)

@bp.route('/business', methods=['POST'])
def post_business():
    return cadastrar_estabelecimento(request)
