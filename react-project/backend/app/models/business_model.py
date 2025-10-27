from app.extensions import mongo
from bson import ObjectId

def criar_estabelecimento(data):
    """
    Cria um novo estabelecimento no banco, contendo apenas informações da barbearia.
    """
    business_data = data.get("business", {})
    if not business_data:
        raise ValueError("Campo 'business' é obrigatório")

    payload = {
        "business": {
            "name": business_data.get("name"),
            "type": business_data.get("type"),
            "phone": business_data.get("phone"),
            "email": business_data.get("email"),
            "description": business_data.get("description"),
            "address": business_data.get("address", {})
        },
        "usuario_id": data.get("usuario_id")
    }

    result = mongo.db.business.insert_one(payload)
    return str(result.inserted_id)


def atualizar_estabelecimento_db(usuario_id, data):
    """
    Atualiza informações do estabelecimento com base no usuário logado.
    """
    existing = mongo.db.business.find_one({"usuario_id": usuario_id})
    if not existing:
        return None

    business_id = data.get("_id")
    business_data = data.get("business", {})
    professionals_data = data.get("professionals", {})
    services_data = data.get("services", {})

    if not business_data:
        raise ValueError("Campo 'business' é obrigatório")
    
    if not professionals_data:
        raise ValueError("Campo 'professionals' é obrigatório")
    
    if not services_data:
        raise ValueError("Campo 'services' é obrigatório")

    updated_fields_business = {
        "business.name": business_data.get("name"),
        "business.type": business_data.get("type"),
        "business.phone": business_data.get("phone"),
        "business.email": business_data.get("email"),
        "business.description": business_data.get("description"),
        "business.address": business_data.get("address", {})
    }

    updated_fields_professionals = {
        "professionals": professionals_data
    }

    # updated_fields_services = {
    #     "services": services_data
    # }

    mongo.db.business.update_one(
        {"_id": existing["_id"]},
        {"$set": updated_fields_business}
    )

    for prof in updated_fields_professionals["professionals"]:
        mongo.db.professionals.update_one(
            {"_id": ObjectId(prof["_id"])},
            {"$set": {
                "name": prof["name"],
                "role": prof["role"],
                "availability": prof["availability"],
                "exceptions": prof["exceptions"]
            }}
        )

    # for serv in updated_fields_services["services"]:
    #     mongo.db.services.update_one(
    #         {"_id": ObjectId(serv["_id"])},
    #         {"$set": {
    #             "name": serv["name"],
    #             "duration": serv["duration"],
    #             "professionals": serv["professionals"]
    #         }}
    #     )

    return str(existing["_id"])


def buscar_estabelecimento(usuario_id):
    """
    Busca o estabelecimento do usuário autenticado.
    """
    business = mongo.db.business.find_one({"usuario_id": usuario_id})
    return business


def remover_estabelecimento(usuario_id):
    """
    Remove o estabelecimento vinculado ao usuário.
    """
    result = mongo.db.business.delete_one({"usuario_id": usuario_id})
    return result.deleted_count > 0
