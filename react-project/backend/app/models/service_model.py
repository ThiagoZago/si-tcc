from app.extensions import mongo
from bson import ObjectId

def criar_servico(data):
    required_fields = ["name", "duration", "businessId"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Campo obrigatório ausente: {field}")

    if "businessId" in data and not isinstance(data["businessId"], ObjectId):
        data["businessId"] = ObjectId(data["businessId"])

    result = mongo.db.services.insert_one(data)
    return str(result.inserted_id)


def atualizar_servico(service_id, data):
    """
    Atualiza um serviço com base no ID e no businessId.
    O businessId deve estar presente no data.
    """
    if "businessId" not in data:
        raise ValueError("O campo 'businessId' é obrigatório para atualizar um serviço.")

    service_oid = ObjectId(service_id)
    business_oid = ObjectId(data["businessId"]) if not isinstance(data["businessId"], ObjectId) else data["businessId"]

    result = mongo.db.services.update_one(
        {"_id": service_oid, "businessId": business_oid},
        {"$set": data}
    )
    return result.modified_count > 0


def listar_servicos(business_id):
    servicos = list(mongo.db.services.find({"businessId": ObjectId(business_id)}))
    for s in servicos:
        s["_id"] = str(s["_id"])
        s["businessId"] = str(s["businessId"])
    return servicos


def buscar_servico(service_id):
    serv = mongo.db.services.find_one({"_id": ObjectId(service_id)})
    if serv:
        serv["_id"] = str(serv["_id"])
        serv["businessId"] = str(serv["businessId"])
    return serv


def remover_servico(service_id, business_id):
    """
    Remove um serviço de um estabelecimento específico.
    Não altera os profissionais, apenas remove o documento de 'services'.
    """
    result = mongo.db.services.delete_one({
        "_id": ObjectId(service_id),
        "businessId": ObjectId(business_id)
    })
    return result.deleted_count > 0
