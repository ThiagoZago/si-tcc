from app.extensions import mongo

def criar_estabelecimento(data):
    result = mongo.db.business.insert_one(data)
    return str(result.inserted_id)


def atualizar_estabelecimento_db(usuario_id, data):
    existing = mongo.db.business.find_one({"usuario_id": usuario_id})

    if not existing:
        return None
    
    # Serviços existentes e novos
    existing_services = existing.get("services", [])
    new_services = data.get("services", [])

    for new_service in new_services:
        match = next(
            (s for s in existing_services if s["name"].strip().lower() == new_service["name"].strip().lower()),
            None
        )

        if match:
            # 🔄 Garantir compatibilidade com estrutura antiga (migrar se necessário)
            if "professionals" not in match:
                match["professionals"] = []
                if match.get("professionalId") and match.get("professional"):
                    match["professionals"].append({
                        "id": str(match["professionalId"]),
                        "name": match["professional"]
                    })
                    # Remove antigos campos individuais
                    match.pop("professionalId", None)
                    match.pop("professional", None)

            existing_professionals = match.get("professionals", [])

            # 🔍 Adiciona novos profissionais, evitando duplicação
            for prof in new_service.get("professionals", []):
                if not any(p["id"] == prof["id"] for p in existing_professionals):
                    existing_professionals.append(prof)

            match["professionals"] = existing_professionals
        else:
            # 🔧 Cria novo serviço já no novo formato
            formatted_service = {
                "name": new_service["name"],
                "duration": new_service["duration"],
                "professionals": new_service.get("professionals", [])
            }
            existing_services.append(formatted_service)

    # Atualiza a lista de serviços no documento
    data["services"] = existing_services

    
    mongo.db.business.update_one(
        {"_id": existing["_id"]},
        {"$set": data}
    )
    return str(existing["_id"])


def buscar_estabelecimento(usuario_id):
    return mongo.db.business.find_one({"usuario_id": usuario_id})


def remover_estabelecimento(usuario_id):
    result = mongo.db.business.delete_one({"usuario_id": usuario_id})
    return result.deleted_count > 0
