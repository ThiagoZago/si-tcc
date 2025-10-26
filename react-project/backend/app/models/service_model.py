from app.extensions import mongo
from bson import ObjectId

def criar_servico(data):
    result = mongo.db.services.insert_one(data)
    return str(result.inserted_id)

def atualizar_servico(service_id, data):
    _id = ObjectId(service_id)
    result = mongo.db.services.update_one(
        {"_id": _id},
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

def remover_servico(service_id):
    result = mongo.db.services.delete_one({"_id": ObjectId(service_id)})
    return result.deleted_count > 0
