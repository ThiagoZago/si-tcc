from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.business_model import inserir_estabelecimento

@jwt_required()
def cadastrar_estabelecimento(request):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        data['usuario_id'] = user_id

        # Validação mínima
        if not data.get('business') or not data.get('professionals'):
            return jsonify({'error': 'Dados incompletos'}), 400

        inserted_id = inserir_estabelecimento(data)
        return jsonify({'message': 'Estabelecimento cadastrado', 'id': inserted_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
