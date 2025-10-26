from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.models.professional_model import (
    criar_profissional, atualizar_profissional, listar_profissionais,
    buscar_profissional, remover_profissional
)
from app.models.business_model import buscar_estabelecimento

@jwt_required()
def cadastrar_profissional(request):
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        data = request.get_json()
        data["businessId"] = business["_id"]

        professional_id = criar_profissional(data)
        return jsonify({"message": "Profissional cadastrado com sucesso", "id": professional_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def atualizar_profissional_controller(request, id):
    try:
        data = request.get_json()
        updated = atualizar_profissional(id, data)
        if not updated:
            return jsonify({"message": "Profissional não encontrado"}), 404

        return jsonify({"message": "Profissional atualizado com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def listar_profissionais_controller():
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        profissionais = listar_profissionais(business["_id"])
        return jsonify(profissionais), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def buscar_profissional_controller(id):
    try:
        prof = buscar_profissional(id)
        if not prof:
            return jsonify({"message": "Profissional não encontrado"}), 404
        return jsonify(prof), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def remover_profissional_controller(id):
    try:
        deleted = remover_profissional(id)
        if deleted:
            return jsonify({"message": "Profissional removido com sucesso"}), 200
        return jsonify({"message": "Profissional não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
