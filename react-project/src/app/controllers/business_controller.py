from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.business_model import (
    criar_estabelecimento,
    atualizar_estabelecimento_db,
    buscar_estabelecimento,
    remover_estabelecimento
)

@jwt_required()
def cadastrar_estabelecimento(request):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        data['usuario_id'] = user_id

        # Verifica se já existe cadastro
        existing = buscar_estabelecimento(user_id)
        if existing:
            return jsonify({'error': 'Estabelecimento já cadastrado. Use PUT para atualizar.'}), 400

        if not data.get('business') or not data.get('professionals'):
            return jsonify({'error': 'Dados incompletos'}), 400

        created_id = criar_estabelecimento(data)
        return jsonify({'message': 'Estabelecimento criado', 'id': created_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jwt_required()
def atualizar_estabelecimento(request):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        data['usuario_id'] = user_id

        updated_id = atualizar_estabelecimento_db(user_id, data)
        if not updated_id:
            return jsonify({'error': 'Nenhum estabelecimento encontrado para atualizar'}), 404

        return jsonify({'message': 'Estabelecimento atualizado', 'id': updated_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jwt_required()
def recuperar_estabelecimento():
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)

        if not business:
            return jsonify({'message': 'Nenhum estabelecimento cadastrado'}), 404

        business['_id'] = str(business['_id'])
        return jsonify(business), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jwt_required()
def excluir_estabelecimento():
    try:
        user_id = get_jwt_identity()
        deleted = remover_estabelecimento(user_id)

        if deleted:
            return jsonify({'message': 'Estabelecimento removido com sucesso'}), 200
        else:
            return jsonify({'message': 'Nenhum estabelecimento encontrado para excluir'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
