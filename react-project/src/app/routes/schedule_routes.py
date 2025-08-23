from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from app.extensions import mongo
from app.controllers import schedule_controller

bp = Blueprint("schedule", __name__)

@bp.route("/agendar", methods=["POST"])
def agendar():
    data = request.json

    # Campos obrigatórios
    required_fields = ["nome", "telefone", "businessId", "professional", "service", "data", "hora"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Preencha todos os campos obrigatórios."}), 400

    try:
        # Garantir que businessId é um ObjectId válido
        business_id = ObjectId(data["businessId"])
    except:
        return jsonify({"msg": "ID de local inválido."}), 400

    # Verificar se o local existe
    business = mongo.db.business.find_one({"_id": business_id})
    if not business:
        return jsonify({"msg": "Local não encontrado."}), 404

    # Montar documento do agendamento
    agendamento = {
        "nome": data["nome"],
        "telefone": data["telefone"],
        "businessId": business_id,
        "professional": data["professional"],
        "service": data["service"],
        "data": data["data"],  # string "YYYY-MM-DD"
        "hora": data["hora"],  # string "HH:MM"
        "createdAt": datetime.now()
    }

    # (Opcional) Verificar se já existe agendamento nesse horário para o mesmo profissional
    conflito = mongo.db.schedules.find_one({
        "businessId": business_id,
        "professional": data["professional"],
        "data": data["data"],
        "hora": data["hora"]
    })
    if conflito:
        return jsonify({"msg": "Horário já ocupado para este profissional."}), 400

    # Inserir no banco
    mongo.db.schedules.insert_one(agendamento)

    return jsonify({"msg": "Agendamento realizado com sucesso!"}), 201


@bp.route("/business", methods=["GET"])
def listar_business():
    businesses = list(mongo.db.business.find({}, {"_id": 1, "business.name": 1}))
    result = []
    for b in businesses:
        result.append({
            "_id": str(b["_id"]),
            "name": b["business"]["name"]  # pega de dentro do objeto "business"
        })
    return jsonify(result), 200

@bp.route("/business/<id>/professionals", methods=["GET"])
def listar_profissionais(id):
    business = mongo.db.business.find_one({"_id": ObjectId(id)}, {"professionals": 1})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado"}), 404

    return jsonify(business["professionals"]), 200

@bp.route("/business/<id>/services", methods=["GET"])
def listar_servicos(id):
    business = mongo.db.business.find_one({"_id": ObjectId(id)}, {"services": 1})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado"}), 404

    return jsonify(business["services"]), 200

@bp.route("/business/<id>/availability/<professional>", methods=["GET"])
def horarios_disponiveis(id, professional):
    business = mongo.db.business.find_one(
        {"_id": ObjectId(id), "professionals.name": professional},
        {"professionals.$": 1}
    )
    if not business:
        return jsonify({"msg": "Profissional não encontrado"}), 404

    professional_data = business["professionals"][0]
    return jsonify(professional_data["availability"]), 200
