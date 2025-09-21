from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import mongo

bp = Blueprint("history", __name__)

@bp.route("/agendamentos", methods=["GET"])
@jwt_required()
def get_agendamentos():
    try:
        email = get_jwt_identity()  # email do usuário logado
        filtro_tipo = request.args.get("tipo", "passados")  # ?tipo=passados ou ?tipo=futuros

        # 1. Buscar negócios do usuário
        businesses = list(mongo.db.business.find({"usuario_id": email}, {"_id": 1}))
        if not businesses:
            return jsonify({"agendamentos": [], "msg": "Você ainda não possui negócios vinculados."}), 200

        business_ids = [b["_id"] for b in businesses]

        # 2. Buscar agendamentos desses negócios
        agendamentos = list(mongo.db.schedules.find({"businessId": {"$in": business_ids}}))

        hoje = datetime.now().date()
        resultado = []

        for ag in agendamentos:
            try:
                data_agendamento = datetime.strptime(ag["data"], "%Y-%m-%d").date()
            except Exception:
                continue  # ignora se a data estiver inválida

            if filtro_tipo == "passados" and data_agendamento < hoje:
                resultado.append(ag)
            elif filtro_tipo == "futuros" and data_agendamento >= hoje:
                resultado.append(ag)

        # 3. Formatar saída
        agendamentos_formatados = [
            {
                "id": str(ag["_id"]),
                "nome": ag.get("nome"),
                "telefone": ag.get("telefone"),
                "professional": ag.get("professional"),
                "service": ag.get("service"),
                "data": ag.get("data"),
                "hora": ag.get("hora"),
            }
            for ag in resultado
        ]

        if not agendamentos_formatados:
            return jsonify({"agendamentos": [], "msg": f"Você não possui agendamentos {filtro_tipo}."}), 200

        return jsonify({"agendamentos": agendamentos_formatados, "msg": f"Agendamentos {filtro_tipo} carregados."}), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar agendamentos: {str(e)}"}), 500