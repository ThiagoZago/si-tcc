from flask import jsonify, request
from app.extensions import mongo
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

from app.models.schedule_model import create_schedule

def agendar(request):
    data = request.get_json()
    nome = data.get("nome")
    telefone = data.get("telefone")
    data_agendamento = data.get("data")
    hora = data.get("hora")

    if not all([nome, telefone, data_agendamento, hora]):
        return jsonify({"msg": "Todos os campos são obrigatórios."}), 400


######
    create_schedule(nome, telefone, data_agendamento, hora)
    return jsonify({"msg": "Agendamento criado com sucesso!"}), 201

# def get_schedules_by_phone_controller():
#     telefone = request.args.get("telefone")
#     if not telefone:
#         return jsonify({"msg": "Telefone é obrigatório para busca."}), 400

#     schedules = find_schedules_by_phone(telefone)
#     return jsonify(schedules), 200

###########################
    # cliente = mongo.db.schedules.find_one({"telefone": telefone})

    # if not cliente:
    #     mongo.db.schedules.insert_one({
    #         "nome": nome,
    #         "telefone": telefone,
    #         "agendamentos": [{"data": data_agendamento, "hora": hora}],
    #     })
    # else:
    #     mongo.db.schedules.update_one(
    #         {"telefone": telefone},
    #         {"$push": {"agendamentos": {"data": data_agendamento, "hora": hora}}}
    #     )

    # return jsonify({"msg": "Agendamento realizado com sucesso!"}), 201

# def agendamentos_passados(request):
#     username = get_jwt_identity()
#     telefone = request.args.get("telefone")

#     cliente = mongo.db.system.find_one({"username": username})

#     if not cliente or "agendamentos" not in cliente:
#         return jsonify({"msg": "Nenhum agendamento encontrado"}), 404

#     agora = datetime.now()
#     agendamentos_passados = [
#         ag for ag in cliente["agendamentos"]
#         if ag.get("telefone") == telefone and datetime.strptime(ag["data"], "%Y-%m-%d") < agora
#     ]

#     return jsonify({"agendamentos": agendamentos_passados}), 200
