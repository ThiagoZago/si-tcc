from flask import Flask, Blueprint, request, jsonify
from bson import ObjectId, json_util
from datetime import datetime, timedelta
from app.extensions import mongo
from app.controllers import schedule_controller

bp = Blueprint("schedule", __name__)
app = Flask(__name__)

# Helper para responder JSON com ObjectId, datetime etc.
def res_json(payload, status=200):
    return app.response_class(
        response=json_util.dumps(payload),
        status=status,
        mimetype="application/json"
    )

def to_object_id(value):
    try:
        return ObjectId(value)
    except Exception:
        return None
    
# -----------------------
# Helpers de disponibilidade
# -----------------------
def gerar_slots_disponiveis(availability: dict, servico_duracao: str, data_str: str):
    """
    Gera horários possíveis no dia conforme disponibilidade do profissional.
    availability = {
      "active": True, "start": "09:00", "end": "19:00",
      "lunchStart": "12:00", "lunchEnd": "13:00"
    }
    servico_duracao = "30min"
    data_str = "YYYY-MM-DD"
    """
    if not availability or not availability.get("active"):
        return []

    # duração em minutos
    try:
        import re
        match = re.search(r'\d+', str(servico_duracao))
        duracao = int(match.group()) if match else 0

    except Exception:
        return []

    # base do dia
    dia = datetime.strptime(data_str, "%Y-%m-%d")
    inicio = datetime.strptime(availability["start"], "%H:%M")
    fim = datetime.strptime(availability["end"], "%H:%M")

    inicio_trabalho = datetime.combine(dia.date(), inicio.time())
    fim_trabalho = datetime.combine(dia.date(), fim.time())

    # almoço (opcional)
    tem_almoco = "lunchStart" in availability and "lunchEnd" in availability
    if tem_almoco:
        almoco_ini = datetime.strptime(availability["lunchStart"], "%H:%M")
        almoco_fim = datetime.strptime(availability["lunchEnd"], "%H:%M")
        almoco_inicio = datetime.combine(dia.date(), almoco_ini.time())
        almoco_fim_dt = datetime.combine(dia.date(), almoco_fim.time())

    slots = []
    atual = inicio_trabalho
    passo = timedelta(minutes=duracao)

    while atual + passo <= fim_trabalho:
        fim_slot = atual + passo

        # pular intervalo de almoço (se houver)
        if tem_almoco:
            overlap_almoco = not (fim_slot <= almoco_inicio or atual >= almoco_fim_dt)
            if overlap_almoco:
                atual += passo
                continue

        slots.append(atual.strftime("%H:%M"))
        atual += passo

    return slots

def dia_semana_pt(data_str: str):
    # datetime.weekday(): Monday=0 ... Sunday=6
    dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]
    return dias[datetime.strptime(data_str, "%Y-%m-%d").weekday()]


# -----------------------
# Rotas
# -----------------------

@bp.route("/agendar", methods=["POST"])
def agendar():
    data = request.get_json(silent=True) or {}

    required_fields = ["nome", "telefone", "businessId", "professional", "service", "data", "hora"]
    faltando = [f for f in required_fields if not data.get(f)]
    if faltando:
        return res_json({"msg": f"Preencha todos os campos obrigatórios: {', '.join(faltando)}."}, 400)

    business_id = to_object_id(data["businessId"])
    if not business_id:
        return res_json({"msg": "ID de local inválido."}, 400)

    business = mongo.db.business.find_one({"_id": business_id})
    if not business:
        return res_json({"msg": "Local não encontrado."}, 404)

    professional = data["professional"]
    service = data["service"]
    date_str = data["data"]   # "YYYY-MM-DD"
    hora_str = data["hora"]   # "HH:MM"

    # Profissional no negócio
    prof = next((p for p in business.get("professionals", []) if p.get("name") == professional), None)
    if not prof:
        return res_json({"msg": "Profissional não encontrado nesse local."}, 404)

    # Serviço do profissional
    serv = next(
        (s for s in business.get("services", [])
         if s.get("name") == service and s.get("professional") == professional),
        None
    )
    if not serv:
        return res_json({"msg": "Serviço não encontrado para esse profissional."}, 404)

    # Disponibilidade do dia
    dia_key = dia_semana_pt(date_str)
    availability = prof.get("availability", {}).get(dia_key, {"active": False})

    # Gera slots válidos
    possiveis = gerar_slots_disponiveis(availability, serv.get("duration", "30min"), date_str)

    # Remove horários já ocupados
    agendados_cur = mongo.db.schedules.find({
        "businessId": business_id,
        "professional": professional,
        "data": date_str
    }, {"hora": 1})
    ocupados = {a.get("hora") for a in agendados_cur}
    livres = [h for h in possiveis if h not in ocupados]

    # Verifica se o horário solicitado é válido
    try:
        hora_str = datetime.strptime(hora_str, "%H:%M").strftime("%H:%M")
    except ValueError:
        return res_json({"msg": "Formato de hora inválido. Use HH:MM."}, 400)

    if hora_str not in livres:
        return res_json({
            "msg": "Horário indisponível para este profissional.",
            "livres": livres  # 👈 debug temporário, mostra horários disponíveis
        }, 409)


    # Monta documento
    agendamento = {
        "nome": data["nome"],
        "telefone": data["telefone"],
        "businessId": business_id,
        "professional": professional,
        "service": service,
        "data": date_str,
        "hora": hora_str,
        "createdAt": datetime.now()
    }

    inserted = mongo.db.schedules.insert_one(agendamento)

    return res_json({"msg": "Agendamento realizado com sucesso!", "id": str(inserted.inserted_id)}, 201)


@bp.route('/business/search', methods=['GET'])
def search_business():
    termo = request.args.get('q', '')

    results = mongo.db.business.find(
        {"business.name": {"$regex": termo, "$options": "i"}},
        {"_id": 1, "business.name": 1, "business.address": 1}
    ).limit(10)

    negocios = []
    for r in results:
        endereco = r.get("business", {}).get("address", {})
        endereco_str = f"{endereco.get('street', '')}, {endereco.get('number', '')} - {endereco.get('city', '')}/{endereco.get('state', '')}"

        negocios.append({
            "id": str(r["_id"]),
            "name": r["business"]["name"],
            "address": endereco_str.strip(", -/")  # remove vírgulas/traços sobrando
        })

    return jsonify(negocios), 200



@bp.route("/businessSchedule", methods=["GET"])
def listar_business():
    businesses = list(mongo.db.business.find({}, {"_id": 1, "business.name": 1}))
    result = []
    for b in businesses:
        result.append({
            "_id": str(b["_id"]),
            "name": b["business"]["name"]  # pega de dentro do objeto "business"
        })
    return jsonify(result), 200

@bp.route("/businessSchedule/<id>/professionals", methods=["GET"])
def listar_profissionais(id):
    business = mongo.db.business.find_one({"_id": ObjectId(id)}, {"professionals": 1})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado"}), 404

    return jsonify(business["professionals"]), 200

@bp.route("/businessSchedule/<id>/services", methods=["GET"])
def listar_servicos(id):
    business = mongo.db.business.find_one({"_id": ObjectId(id)}, {"services": 1})
    if not business:
        return jsonify({"msg": "Estabelecimento não encontrado"}), 404

    return jsonify(business["services"]), 200

@bp.route("/businessSchedule/<id>/availability/<professional>", methods=["GET"])
def horarios_disponiveis(id, professional):
    business = mongo.db.business.find_one(
        {"_id": ObjectId(id), "professionals.name": professional},
        {"professionals.$": 1}
    )
    if not business:
        return jsonify({"msg": "Profissional não encontrado"}), 404

    professional_data = business["professionals"][0]
    return jsonify(professional_data["availability"]), 200

# Slots livres (teóricos) para um dia, considerando agenda atual
# Ex.: GET /businessSchedule/<id>/slots?professional=JONATHAN&service=CORTE%20COMPLETO&date=2025-09-10
@bp.route("/businessSchedule/<id>/slots", methods=["GET"])
def slots_por_dia(id):
    """
    Endpoint: GET /businessSchedule/<id>/slots?professional=...&service=...&date=YYYY-MM-DD
    Retorna lista de horários livres (["09:00","09:30",...])
    """
    professional = request.args.get("professional")
    service = request.args.get("service")
    date_str = request.args.get("date")  # note: frontend envia "date"

    # Valida parâmetros
    if not all([id, professional, service, date_str]):
        return res_json({"msg": "Parâmetros: professional, service e date são obrigatórios."}, 400)

    # Converte id para ObjectId
    _id = to_object_id(id)
    if not _id:
        return res_json({"msg": "ID inválido."}, 400)

    try:
        # carrega business
        business = mongo.db.business.find_one({"_id": _id})
        if not business:
            return res_json({"msg": "Estabelecimento não encontrado"}, 404)

        # profissional
        prof = next((p for p in business.get("professionals", []) if p.get("name") == professional), None)
        if not prof:
            return res_json({"msg": "Profissional não encontrado"}, 404)

        # serviço (confere vínculo com profissional)
        serv = next(
            (s for s in business.get("services", [])
             if s.get("name") == service and s.get("professional") == professional),
            None
        )
        if not serv:
            return res_json({"msg": "Serviço não encontrado para esse profissional."}, 404)

        # disponibilidade do dia (valida formato de data)
        try:
            dia_key = dia_semana_pt(date_str)
        except Exception:
            return res_json({"msg": "Formato de data inválido. Use YYYY-MM-DD."}, 400)

        availability = prof.get("availability", {}).get(dia_key, {"active": False})

        # slots possíveis pelo expediente
        possiveis = gerar_slots_disponiveis(availability, serv.get("duration", "30min"), date_str)

        # remove horários já ocupados
        agendados_cur = mongo.db.schedules.find({
            "businessId": _id,
            "professional": professional,
            "data": date_str
        }, {"hora": 1})

        ocupados = {a.get("hora") for a in agendados_cur if a.get("hora")}
        livres = [h for h in possiveis if h not in ocupados]

        return res_json(livres, 200)

    except Exception as e:
        # opcional: print/registro para debug no terminal
        import traceback
        traceback.print_exc()
        return res_json({"msg": "Erro interno do servidor.", "error": str(e)}, 500)

# ANTES DO USUÁRIO ESCOLHER A DATA, A LÓGICA JÁ DISPARA APENAS OS DIAS DISPONÍVEIS PARA MARCAÇÃO.
@bp.route("/businessSchedule/<id>/days", methods=["GET"])
def dias_disponiveis(id):
    """
    Endpoint: GET /businessSchedule/<id>/days?professional=...&service=...&days=30
    Retorna uma lista de dias com flag de disponibilidade:
    [
      {"date": "2025-09-20", "available": true},
      {"date": "2025-09-21", "available": false},
      ...
    ]
    """
    professional = request.args.get("professional")
    service = request.args.get("service")
    dias_qtd = int(request.args.get("days", 30))  # padrão: 30 dias pra frente

    # validações
    if not all([id, professional, service]):
        return res_json({"msg": "Parâmetros: professional e service são obrigatórios."}, 400)

    _id = to_object_id(id)
    if not _id:
        return res_json({"msg": "ID inválido."}, 400)

    try:
        business = mongo.db.business.find_one({"_id": _id})
        if not business:
            return res_json({"msg": "Estabelecimento não encontrado"}, 404)

        # profissional
        prof = next((p for p in business.get("professionals", []) if p.get("name") == professional), None)
        if not prof:
            return res_json({"msg": "Profissional não encontrado"}, 404)

        # serviço (checar vínculo com profissional)
        serv = next(
            (s for s in business.get("services", [])
             if s.get("name") == service and s.get("professional") == professional),
            None
        )
        if not serv:
            return res_json({"msg": "Serviço não encontrado para esse profissional."}, 404)

        # agora vamos montar a lista de dias
        from datetime import datetime, timedelta

        resultados = []
        hoje = datetime.today()

        for i in range(dias_qtd):
            
            dia_atual = hoje + timedelta(days=i)
            dia_str = dia_atual.strftime("%Y-%m-%d")
            dia_key = dia_semana_pt(dia_str)

            availability = prof.get("availability", {}).get(dia_key, {"active": False})
            disponivel = availability.get("active", False)

            

            if disponivel:
                # gera slots possíveis
                possiveis = gerar_slots_disponiveis(availability, serv.get("duration", "30min"), dia_str)

                # remove os já ocupados
                agendados_cur = mongo.db.schedules.find({
                    "businessId": _id,
                    "professional": professional,
                    "data": dia_str
                }, {"hora": 1})

                ocupados = {a.get("hora") for a in agendados_cur if a.get("hora")}
                livres = [h for h in possiveis if h not in ocupados]

                disponivel = len(livres) > 0

            resultados.append({"date": dia_str, "available": disponivel})
            

        return res_json(resultados, 200)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return res_json({"msg": "Erro interno do servidor", "error": str(e)}, 500)


