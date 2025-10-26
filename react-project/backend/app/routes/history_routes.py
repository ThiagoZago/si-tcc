from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId
from app import mongo

bp = Blueprint("history", __name__)

@bp.route("/agendamentos", methods=["GET"])
@jwt_required()
def get_agendamentos():
    try:
        email = get_jwt_identity()
        filtro_tipo = request.args.get("tipo")
        ordenar = request.args.get("ordenar", "asc")
        data_exata = request.args.get("data")
        data_inicio = request.args.get("data_inicio")
        data_fim = request.args.get("data_fim")
        cliente = request.args.get("cliente")
        telefone = request.args.get("telefone")
        profissional_filtro = request.args.get("profissional")
        servico_filtro = request.args.get("servico")

        # 1️⃣ Buscar negócios do usuário
        businesses = list(mongo.db.business.find({"usuario_id": email}))
        if not businesses:
            return jsonify({"agendamentos": [], "msg": "Você ainda não possui negócios vinculados."}), 200

        business_ids = [b["_id"] for b in businesses]

        # 2️⃣ Filtro direto no Mongo (cliente, telefone, datas)
        query = {"businessId": {"$in": business_ids}}
        if cliente:
            query["nome"] = {"$regex": cliente, "$options": "i"}
        if telefone:
            query["telefone"] = {"$regex": telefone, "$options": "i"}
        if data_exata:
            query["data"] = data_exata
        elif data_inicio or data_fim:
            date_query = {}
            if data_inicio:
                date_query["$gte"] = data_inicio
            if data_fim:
                date_query["$lte"] = data_fim
            query["data"] = date_query

        agendamentos = list(mongo.db.schedules.find(query))

        # 3️⃣ Mapear nomes de profissional/serviço e aplicar filtros
        resultado = []
        hoje = datetime.now().date()

        for ag in agendamentos:
            business = next((b for b in businesses if b["_id"] == ag["businessId"]), None)
            if not business:
                continue

            # Resolver profissional
            prof_id = ag.get("professionalId")
            prof_nome = "Profissional não encontrado"
            for p in business.get("professionals", []):
                if p["_id"] == prof_id:
                    prof_nome = p.get("name")
                    break

            # Resolver serviço
            serv_id = ag.get("serviceId")
            serv_nome = "Serviço não encontrado"
            for s in business.get("services", []):
                if s["_id"] == serv_id:
                    serv_nome = s.get("name")
                    break

            # 🔹 Aplicar filtros de frontend em Python
            incluir = True
            data_agendamento = datetime.strptime(ag["data"], "%Y-%m-%d").date()

            if filtro_tipo == "passados" and data_agendamento >= hoje:
                incluir = False
            elif filtro_tipo == "futuros" and data_agendamento < hoje:
                incluir = False

            if profissional_filtro and profissional_filtro.lower() not in prof_nome.lower():
                incluir = False
            if servico_filtro and servico_filtro.lower() not in serv_nome.lower():
                incluir = False

            if incluir:
                resultado.append({
                    "id": str(ag["_id"]),
                    "nome": ag.get("nome"),
                    "telefone": ag.get("telefone"),
                    "professionalId": str(prof_id),
                    "professionalNome": prof_nome,
                    "serviceId": str(serv_id),
                    "serviceNome": serv_nome,
                    "data": ag.get("data"),
                    "hora": ag.get("hora"),
                    "businessName": business["business"]["name"]
                })

        # 4️⃣ Ordenar
        resultado.sort(key=lambda x: datetime.strptime(x["data"], "%Y-%m-%d"), reverse=(ordenar=="desc"))

        msg = "Agendamentos carregados." if resultado else "Nenhum agendamento encontrado para os filtros aplicados."
        return jsonify({"agendamentos": resultado, "msg": msg}), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar agendamentos: {str(e)}"}), 500
