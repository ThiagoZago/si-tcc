from app.extensions import mongo
from bson import ObjectId

def criar_profissional(data):
    required_fields = ["name", "role", "availability"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Campo obrigatório ausente: {field}")
        
    if "businessId" in data:
        data["businessId"] = str(data["businessId"])
    result = mongo.db.professionals.insert_one(data)
    return str(result.inserted_id)

def atualizar_profissional(professional_id, data, business_id):
    _id = ObjectId(professional_id)
    result = mongo.db.professionals.update_one(
        {"_id": _id, "businessId": str(business_id)},
        {"$set": data}
    )
    return result.modified_count > 0

def listar_profissionais(business_id):
    
    profissionais = list(mongo.db.professionals.find({"businessId": str(business_id)}))
    for p in profissionais:
        p["_id"] = str(p["_id"])
        p["businessId"] = str(p["businessId"])
    return profissionais

# def buscar_profissional(professional_id):
#     prof = mongo.db.professionals.find_one({"_id": ObjectId(professional_id)})
#     if prof:
#         prof["_id"] = str(prof["_id"])
#         prof["businessId"] = str(prof["businessId"])
#     return prof

def remover_profissional(professional_id, business_id):
    """
    Remove o profissional da coleção 'professionals' e o retira de todos os serviços
    vinculados ao mesmo businessId.
    """

    # Remove o profissional apenas se pertencer ao mesmo estabelecimento
    result = mongo.db.professionals.delete_one({
        "_id": ObjectId(professional_id),
        "businessId": str(business_id)
    })

    if result.deleted_count > 0:
        # Remove o profissional de todos os serviços vinculados a este business
        mongo.db.services.update_many(
            {"businessId": business_id},
            {"$pull": {"professionals": {"id": str(professional_id)}}}
        )

    return result.deleted_count > 0
