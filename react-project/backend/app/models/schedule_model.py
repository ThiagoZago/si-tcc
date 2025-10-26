from app.extensions import mongo

def create_schedule(nome, telefone, business_id, profissional_nome, servico_nome, data, hora):
    """Insere um novo agendamento no banco."""
    mongo.db.schedules.insert_one({
        "nome": nome,
        "telefone": telefone,
        "business_id": business_id,
        "profissional": profissional_nome,
        "servico": servico_nome,
        "data": data,   # "2025-08-25"
        "hora": hora    # "14:30"
    })


def horario_disponivel(business_id, profissional_nome, data, hora):
    """Verifica se o profissional já tem agendamento nesse horário."""
    conflito = mongo.db.schedules.find_one({
        "business_id": business_id,
        "profissional": profissional_nome,
        "data": data,
        "hora": hora
    })
    return conflito is None
