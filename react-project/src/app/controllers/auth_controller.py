from flask import jsonify
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity

def register(request):
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    telefone = data.get("telefone")

    if mongo.db.system.find_one({"username": username}):
        return jsonify({"msg": "Usuário já existe"}), 400

    hashed_password = generate_password_hash(password)
    mongo.db.system.insert_one({"username": username, "password": hashed_password, "telefone": telefone})
    return jsonify({"msg": "Usuário registrado com sucesso"}), 201

def login(request):
    data = request.get_json()
    user = mongo.db.system.find_one({"username": data["username"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"msg": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity=data["username"])
    return jsonify({"token": access_token}), 200

def dashboard():
    return jsonify({"msg": "Acesso permitido ao dashboard"}), 200
