import re
import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo

bp = Blueprint("profile", __name__)

# 1️⃣ Obter dados do usuário logado
@bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        email = get_jwt_identity()

        # Buscar usuário
        user = mongo.db.system.find_one({"username": email})
        if not user:
            return jsonify({"msg": "Usuário não encontrado."}), 404

        # Buscar negócio vinculado
        business = mongo.db.business.find_one({"usuario_id": email})
        business_name = business.get("business", {}).get("name") if business else None

        res_data = {
            "email": user["username"],
            "businessName": business_name or "Nenhum negócio vinculado"
        }
        print(json.dumps(res_data, indent=4, ensure_ascii=False))

        return jsonify(res_data), 200
        

    except Exception as e:
        return jsonify({"msg": f"Erro ao obter perfil: {str(e)}"}), 500


# 2️⃣ Alterar senha
@bp.route("/profile/password", methods=["PUT"])
@jwt_required()
def update_password():
    try:
        email = get_jwt_identity()
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if current_password == new_password:
            return jsonify({"msg": "As senhas tem que ser diferentes."}), 400

        if not current_password or not new_password:
            return jsonify({"msg": "Campos obrigatórios não informados."}), 400

        user = mongo.db.system.find_one({"username": email})
        if not user:
            return jsonify({"msg": "Usuário não encontrado."}), 404

        # Verificar senha atual
        if not check_password_hash(user["password"], current_password):
            return jsonify({"msg": "Senha atual incorreta."}), 401

        # Validar força da nova senha
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:_\-])[A-Za-z\d@$!%*?&.,;:_\-]{8,}$"
        if not re.match(pattern, new_password):
            return jsonify({
                "msg": "A nova senha deve conter ao menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
            }), 400

        # Atualizar senha
        hashed_password = generate_password_hash(new_password)
        mongo.db.system.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": hashed_password}}
        )

        return jsonify({"msg": "Senha atualizada com sucesso!"}), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao atualizar senha: {str(e)}"}), 500