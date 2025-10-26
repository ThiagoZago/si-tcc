from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.models.service_model import (
    criar_servico, atualizar_servico, listar_servicos,
    buscar_servico, remover_servico
)
from app.models.business_model import buscar_estabelecimento
from app.extensions import mongo


@jwt_required()
def cadastrar_servico(request):
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        data = request.get_json()
        data["businessId"] = business["_id"]

        # ✅ Validação dos profissionais vinculados
        professionals_input = data.get("professionals", [])
        valid_professionals = []

        for prof in professionals_input:
            prof_id = prof.get("id")
            if not prof_id or not ObjectId.is_valid(prof_id):
                return jsonify({"error": f"ID de profissional inválido: {prof_id}"}), 400

            # verifica se o profissional pertence ao mesmo business
            found = mongo.db.professionals.find_one({
                "_id": ObjectId(prof_id),
                "businessId": str(business["_id"])
            })
            if not found:
                return jsonify({"error": f"O profissional {prof.get('name', '')} não pertence a este estabelecimento"}), 400

            valid_professionals.append({
                "id": str(found["_id"]),
                "name": found["name"]
            })

        # substitui a lista validada
        data["professionals"] = valid_professionals

        service_id = criar_servico(data)
        return jsonify({"message": "Serviço cadastrado com sucesso", "id": service_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def atualizar_servico_controller(request, id):
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        data = request.get_json()

        # ✅ Revalida profissionais (mesma lógica do POST)
        professionals_input = data.get("professionals", [])
        valid_professionals = []

        for prof in professionals_input:
            prof_id = prof.get("id")
            if not prof_id or not ObjectId.is_valid(prof_id):
                return jsonify({"error": f"ID de profissional inválido: {prof_id}"}), 400

            found = mongo.db.professionals.find_one({
                "_id": ObjectId(prof_id),
                "businessId": str(business["_id"])
            })
            if not found:
                return jsonify({"error": f"O profissional {prof.get('name', '')} não pertence a este estabelecimento"}), 400

            valid_professionals.append({
                "id": str(found["_id"]),
                "name": found["name"]
            })

        data["professionals"] = valid_professionals

        updated = atualizar_servico(id, data)
        if not updated:
            return jsonify({"message": "Serviço não encontrado"}), 404

        return jsonify({"message": "Serviço atualizado com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def listar_servicos_controller():
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        servicos = listar_servicos(business["_id"])
        return jsonify(servicos), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def buscar_servico_controller(id):
    try:
        serv = buscar_servico(id)
        if not serv:
            return jsonify({"message": "Serviço não encontrado"}), 404
        return jsonify(serv), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@jwt_required()
def remover_servico_controller(id):
    try:
        deleted = remover_servico(id)
        if deleted:
            return jsonify({"message": "Serviço removido com sucesso"}), 200
        return jsonify({"message": "Serviço não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
