from app.extensions import mongo

def criar_estabelecimento(data):
    result = mongo.db.business.insert_one(data)
    return str(result.inserted_id)


def atualizar_estabelecimento_db(usuario_id, data):
    existing = mongo.db.business.find_one({"usuario_id": usuario_id})

    if existing:
        mongo.db.business.update_one(
            {"_id": existing["_id"]},
            {"$set": data}
        )
        return str(existing["_id"])
    return None


def buscar_estabelecimento(usuario_id):
    return mongo.db.business.find_one({"usuario_id": usuario_id})


def remover_estabelecimento(usuario_id):
    result = mongo.db.business.delete_one({"usuario_id": usuario_id})
    return result.deleted_count > 0
