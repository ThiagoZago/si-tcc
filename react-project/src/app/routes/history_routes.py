# history_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import mongo
from bson.regex import Regex

bp = Blueprint("history", __name__)

@bp.route("/agendamentos", methods=["GET"])
@jwt_required()
def get_agendamentos():
    try:
        email = get_jwt_identity()  # email do usuário logado

        # ------------------------------
        # PARÂMETROS DE FILTRO (query params)
        # ------------------------------
        filtro_tipo = request.args.get("tipo", None)  # passados, futuros, todos
        data_exata = request.args.get("data")  # YYYY-MM-DD
        data_inicio = request.args.get("data_inicio")  # YYYY-MM-DD
        data_fim = request.args.get("data_fim")  # YYYY-MM-DD
        cliente = request.args.get("cliente")
        telefone = request.args.get("telefone")
        profissional = request.args.get("profissional")
        servico = request.args.get("servico")
        ordenar = request.args.get("ordenar", "asc")  # asc ou desc

        # ------------------------------
        # 1. Buscar negócios do usuário
        # ------------------------------
        businesses = list(mongo.db.business.find({"usuario_id": email}, {"_id": 1}))
        if not businesses:
            return jsonify({"agendamentos": [], "msg": "Você ainda não possui negócios vinculados."}), 200

        business_ids = [b["_id"] for b in businesses]

        # ------------------------------
        # 2. Montar query base
        # ------------------------------
        query = {"businessId": {"$in": business_ids}}

        if cliente:
            query["nome"] = Regex(cliente, "i")  # case insensitive
        if telefone:
            query["telefone"] = Regex(telefone, "i")
        if profissional:
            query["professional"] = Regex(profissional, "i")
        if servico:
            query["service"] = Regex(servico, "i")

        agendamentos = list(mongo.db.schedules.find(query))

        hoje = datetime.now().date()
        resultado = []

        for ag in agendamentos:
            try:
                data_agendamento = datetime.strptime(ag["data"], "%Y-%m-%d").date()
            except Exception:
                continue  # ignora se a data estiver inválida

            incluir = True

            # Filtro de tipo (passados, futuros, todos)
            if filtro_tipo == "passados" and not (data_agendamento < hoje):
                incluir = False
            elif filtro_tipo == "futuros" and not (data_agendamento >= hoje):
                incluir = False

            # Filtro de data exata
            if data_exata and data_agendamento != datetime.strptime(data_exata, "%Y-%m-%d").date():
                incluir = False

            # Filtro de intervalo de datas
            if data_inicio:
                inicio = datetime.strptime(data_inicio, "%Y-%m-%d").date()
                if data_agendamento < inicio:
                    incluir = False
            if data_fim:
                fim = datetime.strptime(data_fim, "%Y-%m-%d").date()
                if data_agendamento > fim:
                    incluir = False

            if incluir:
                resultado.append(ag)

        # ------------------------------
        # 3. Ordenação
        # ------------------------------
        resultado.sort(key=lambda x: datetime.strptime(x["data"], "%Y-%m-%d"), reverse=(ordenar == "desc"))

        # ------------------------------
        # 4. Formatar saída
        # ------------------------------
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
            return jsonify({"agendamentos": [], "msg": "Nenhum agendamento encontrado para os filtros aplicados."}), 200

        return jsonify({"agendamentos": agendamentos_formatados, "msg": "Agendamentos carregados."}), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar agendamentos: {str(e)}"}), 500
