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

        # 1️⃣ Buscar o negócio do usuário (apenas um)
        business = mongo.db.business.find_one({"usuario_id": email})
        if not business:
            return jsonify({"agendamentos": [], "msg": "Você ainda não possui negócios vinculados."}), 200

        business_id_obj = business["_id"]
        business_id_str = str(business["_id"])

        # 2️⃣ Buscar profissionais e serviços relacionados
        profissionais = list(mongo.db.professionals.find({"businessId": business_id_str}))
        servicos = list(mongo.db.services.find({"businessId": business_id_obj}))

        # Criar dicionários de lookup
        lookup_profissionais = {str(p["_id"]): p.get("name", "Profissional não encontrado") for p in profissionais}
        lookup_servicos = {str(s["_id"]): s.get("name", "Serviço não encontrado") for s in servicos}

        # 3️⃣ Montar filtro para agendamentos
        query = {"businessId": business_id_obj}
        if cliente:
            query["nome"] = {"$regex": cliente, "$options": "i"}
        if telefone:
            query["telefone"] = {"$regex": telefone, "$options": "i"}
        if data_exata:
            query["data"] = data_exata
        elif data_inicio or data_fim:
            range_query = {}
            if data_inicio:
                range_query["$gte"] = data_inicio
            if data_fim:
                range_query["$lte"] = data_fim
            query["data"] = range_query

        agendamentos = list(mongo.db.schedules.find(query))
        hoje = datetime.now().date()
        resultado = []

        # 4️⃣ Processar cada agendamento
        for ag in agendamentos:
            prof_id = str(ag.get("professionalId"))
            serv_id = str(ag.get("serviceId"))

            prof_nome = lookup_profissionais.get(prof_id, "Profissional não encontrado")
            serv_nome = lookup_servicos.get(serv_id, "Serviço não encontrado")

            # Converter data
            try:
                data_agendamento = datetime.strptime(ag["data"], "%Y-%m-%d").date()
            except Exception:
                continue

            # 🔹 Aplicar filtros
            if filtro_tipo == "passados" and data_agendamento >= hoje:
                continue
            if filtro_tipo == "futuros" and data_agendamento < hoje:
                continue
            if profissional_filtro and profissional_filtro.lower() not in prof_nome.lower():
                continue
            if servico_filtro and servico_filtro.lower() not in serv_nome.lower():
                continue

            resultado.append({
                "id": str(ag["_id"]),
                "nome": ag.get("nome"),
                "telefone": ag.get("telefone"),
                "professionalId": prof_id,
                "professionalNome": prof_nome,
                "serviceId": serv_id,
                "serviceNome": serv_nome,
                "data": ag.get("data"),
                "hora": ag.get("hora"),
                "businessName": business.get("business", {}).get("name", "Negócio não encontrado")
            })

        # 5️⃣ Ordenar
        resultado.sort(
            key=lambda x: datetime.strptime(x["data"], "%Y-%m-%d"),
            reverse=(ordenar == "desc")
        )

        msg = "Agendamentos carregados." if resultado else "Nenhum agendamento encontrado para os filtros aplicados."
        return jsonify({"agendamentos": resultado, "msg": msg}), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar agendamentos: {str(e)}"}), 500
