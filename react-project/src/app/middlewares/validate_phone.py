import re
from flask import request, jsonify

def validate_phone():
    data = request.get_json()
    telefone = data.get("telefone")

    if not telefone:
        return jsonify({"msg": "Telefone é obrigatório."}), 400

    # Padroniza o telefone removendo caracteres não numéricos
    telefone_padronizado = re.sub(r"\D", "", telefone)

    if len(telefone_padronizado) < 9 or len(telefone_padronizado) > 11:
        return jsonify({"msg": "Telefone inválido."}), 400

    data["telefone"] = telefone_padronizado
    request.json = data  # Atualiza o request com o telefone padronizado
