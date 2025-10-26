from app.extensions import mongo
from bson import ObjectId

def criar_profissional(data):
    result = mongo.db.professionals.insert_one(data)
    return str(result.inserted_id)

def atualizar_profissional(professional_id, data):
    _id = ObjectId(professional_id)
    result = mongo.db.professionals.update_one(
        {"_id": _id},
        {"$set": data}
    )
    return result.modified_count > 0

def listar_profissionais(business_id):
    profissionais = list(mongo.db.professionals.find({"businessId": ObjectId(business_id)}))
    for p in profissionais:
        p["_id"] = str(p["_id"])
        p["businessId"] = str(p["businessId"])
    return profissionais

def buscar_profissional(professional_id):
    prof = mongo.db.professionals.find_one({"_id": ObjectId(professional_id)})
    if prof:
        prof["_id"] = str(prof["_id"])
        prof["businessId"] = str(prof["businessId"])
    return prof

def remover_profissional(professional_id):
    result = mongo.db.professionals.delete_one({"_id": ObjectId(professional_id)})
    return result.deleted_count > 0
