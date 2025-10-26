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

    business_data = data.get("business", {})
    if not business_data:
        raise ValueError("Campo 'business' é obrigatório")

    updated_fields = {
        "business.name": business_data.get("name"),
        "business.type": business_data.get("type"),
        "business.phone": business_data.get("phone"),
        "business.email": business_data.get("email"),
        "business.description": business_data.get("description"),
        "business.address": business_data.get("address", {})
    }

    mongo.db.business.update_one(
        {"_id": existing["_id"]},
        {"$set": updated_fields}
    )

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
