from app.extensions import mongo

def create_schedule(nome, telefone, data, hora):
    """Insere um novo agendamento no banco."""
    mongo.db.schedules.insert_one({
        "nome": nome,
        "telefone": telefone,
        "data": data,
        "hora": hora
    })

# def find_schedules_by_phone(telefone):
#     """Busca agendamentos pelo telefone padronizado."""
#     return list(mongo.db.schedules.find({"telefone": telefone}).sort("data", -1))
