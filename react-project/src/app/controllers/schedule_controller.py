from flask import jsonify, request
from app.extensions import mongo
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

def agendar(request):
    data = request.get_json()
    telefone = data.get("telefone")
    nome = data.get("nome")
    data_agendamento = data.get("data")
    hora = data.get("hora")

    if not telefone or not nome or not data_agendamento or not hora:
        return jsonify({"msg": "Todos os campos são obrigatórios"}), 400

    cliente = mongo.db.schedules.find_one({"telefone": telefone})

    if not cliente:
        mongo.db.schedules.insert_one({
            "nome": nome,
            "telefone": telefone,
            "agendamentos": [{"data": data_agendamento, "hora": hora}],
        })
    else:
        mongo.db.schedules.update_one(
            {"telefone": telefone},
            {"$push": {"agendamentos": {"data": data_agendamento, "hora": hora}}}
        )

    return jsonify({"msg": "Agendamento realizado com sucesso!"}), 201

def agendamentos_passados(request):
    username = get_jwt_identity()
    telefone = request.args.get("telefone")

    cliente = mongo.db.system.find_one({"username": username})

    if not cliente or "agendamentos" not in cliente:
        return jsonify({"msg": "Nenhum agendamento encontrado"}), 404

    agora = datetime.now()
    agendamentos_passados = [
        ag for ag in cliente["agendamentos"]
        if ag.get("telefone") == telefone and datetime.strptime(ag["data"], "%Y-%m-%d") < agora
    ]

    return jsonify({"agendamentos": agendamentos_passados}), 200
