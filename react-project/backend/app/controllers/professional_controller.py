from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.models.professional_model import (
    criar_profissional, 
    atualizar_profissional, 
    listar_profissionais,
    # buscar_profissional,
    remover_profissional
)
from app.models.business_model import buscar_estabelecimento

# Função auxiliar para validar disponibilidade
def validar_availability(availability):
    dias_semana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]
    for dia in dias_semana:
        dia_data = availability.get(dia, {})

        # Se o dia estiver ativo, validar os horários
        if dia_data.get("active"):
            start = dia_data.get("start")
            end = dia_data.get("end")
            lunch_start = dia_data.get("lunchStart")
            lunch_end = dia_data.get("lunchEnd")

            # Checa campos obrigatórios
            if not all([start, end, lunch_start, lunch_end]):
                return False, f"O dia '{dia}' está ativo, mas possui campos de horário vazios."

            # (Opcional) Verifica se os horários estão num formato válido HH:MM
            def formato_valido(h):
                return isinstance(h, str) and len(h) == 5 and h[2] == ":" and h[:2].isdigit() and h[3:].isdigit()

            if not all(map(formato_valido, [start, end, lunch_start, lunch_end])):
                return False, f"Horário inválido no dia '{dia}'. Utilize o formato HH:MM."

    return True, None

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
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)

        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404
        
        data = request.get_json()
        name = data.get("name", "").strip()
        role = data.get("role", "").strip()
        availability = data.get("availability", {})

        if not name or not role:
            return jsonify({"error": "Campos 'name' e 'role' são obrigatórios."}), 400

        valido, msg_erro = validar_availability(availability)
        if not valido:
            return jsonify({"error": msg_erro}), 400

        updated = atualizar_profissional(id, data, business["_id"])
        
        if not updated:
            return jsonify({"message": "Profissional não encontrado"}), 404

        return jsonify({"message": "Profissional atualizado com sucesso"}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
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


# @jwt_required()
# def buscar_profissional_controller(id):
#     try:
#         prof = buscar_profissional(id)
#         if not prof:
#             return jsonify({"message": "Profissional não encontrado"}), 404
#         return jsonify(prof), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


@jwt_required()
def remover_profissional_controller(id):
    try:
        user_id = get_jwt_identity()
        business = buscar_estabelecimento(user_id)
        if not business:
            return jsonify({"error": "Estabelecimento não encontrado"}), 404

        deleted = remover_profissional(id, business["_id"])  # 👈 passa o business_id aqui
        if deleted:
            return jsonify({"message": "Profissional removido com sucesso"}), 200
        return jsonify({"message": "Profissional não encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
