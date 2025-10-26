from flask import jsonify
from app.models.schedule_model import create_schedule, horario_disponivel
from app.extensions import mongo
from datetime import datetime, timedelta

def agendar(request):
    data = request.get_json()

    nome = data.get("nome")
    telefone = data.get("telefone")
    business_id = data.get("business_id")
    profissional = data.get("profissional")  # nome do profissional
    servico = data.get("servico")            # nome do serviço
    data_agendamento = data.get("data")      # "2025-08-30"
    hora = data.get("hora")                  # "14:00"

    if not all([nome, telefone, business_id, profissional, servico, data_agendamento, hora]):
        return jsonify({"msg": "Todos os campos são obrigatórios."}), 400

    # verifica se profissional existe no business
    business = mongo.db.business.find_one({"_id": business_id})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado."}), 404

    prof = next((p for p in business["professionals"] if p["name"] == profissional), None)
    if not prof:
        return jsonify({"msg": "Profissional não encontrado nesse local."}), 404

    serv = next((s for s in business["services"] if s["name"] == servico and s["professional"] == profissional), None)
    if not serv:
        return jsonify({"msg": "Serviço não encontrado para esse profissional."}), 404

    # checa disponibilidade
    if not horario_disponivel(business_id, profissional, data_agendamento, hora):
        return jsonify({"msg": "Esse horário já está ocupado."}), 409

    # grava agendamento
    create_schedule(nome, telefone, business_id, profissional, servico, data_agendamento, hora)
    return jsonify({"msg": "Agendamento criado com sucesso!"}), 201



def gerar_slots_disponiveis(availability, servico_duracao, data_str):
    """
    Gera horários possíveis no dia conforme disponibilidade do profissional.
    availability = { "active": True, "start": "09:00", "end": "19:00", "lunchStart": "12:00", "lunchEnd": "13:00" }
    servico_duracao = "30min"
    """
    if not availability.get("active"):
        return []

    data = datetime.strptime(data_str, "%Y-%m-%d")
    inicio = datetime.strptime(availability["start"], "%H:%M")
    fim = datetime.strptime(availability["end"], "%H:%M")

    # duração em minutos
    duracao = int(servico_duracao.replace("min", ""))

    horarios = []
    atual = datetime.combine(data.date(), inicio.time())

    while atual + timedelta(minutes=duracao) <= datetime.combine(data.date(), fim.time()):
        # pular horário de almoço
        if "lunchStart" in availability and "lunchEnd" in availability:
            almoco_inicio = datetime.strptime(availability["lunchStart"], "%H:%M").time()
            almoco_fim = datetime.strptime(availability["lunchEnd"], "%H:%M").time()
            if almoco_inicio <= atual.time() < almoco_fim:
                atual += timedelta(minutes=duracao)
                continue

        horarios.append(atual.strftime("%H:%M"))
        atual += timedelta(minutes=duracao)

    return horarios


def horarios_disponiveis(business_id, profissional, servico, data):
    business = mongo.db.business.find_one({"_id": business_id})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado"}), 404

    prof = next((p for p in business["professionals"] if p["name"] == profissional), None)
    if not prof:
        return jsonify({"msg": "Profissional não encontrado"}), 404

    serv = next((s for s in business["services"] if s["name"] == servico and s["professional"] == profissional), None)
    if not serv:
        return jsonify({"msg": "Serviço não encontrado"}), 404

    # pega disponibilidade do dia da semana
    dia_semana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"][datetime.strptime(data, "%Y-%m-%d").weekday()]
    availability = prof["availability"].get(dia_semana, {"active": False})

    # gera slots possíveis
    possiveis = gerar_slots_disponiveis(availability, serv["duration"], data)

    # remove horários já ocupados
    agendados = mongo.db.schedules.find({"business_id": business_id, "profissional": profissional, "data": data})
    ocupados = [a["hora"] for a in agendados]
    livres = [h for h in possiveis if h not in ocupados]

    return jsonify(livres), 200