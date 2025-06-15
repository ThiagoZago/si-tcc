from flask import jsonify
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity
from app.models.user_model import create_user
from app.middlewares.validation_register import validate_username, validate_password

def register(request):
    data = request.get_json() # Obtém os dados enviados pelo cliente
    username = data.get("username")
    password = data.get("password")

    # Validação do username
    username_error = validate_username(username)
    if username_error:
        return jsonify({"msg": username_error}), 400

    # Validação da senha
    password_error = validate_password(password)
    if password_error:
        return jsonify({"msg": password_error}), 400

    if mongo.db.system.find_one({"username": username}): # Checa se o usuário já existe
        return jsonify({"msg": "Erro ao registrar o usuário"}), 400

    hashed_password = generate_password_hash(password) # Criptografa a senha
    create_user(username, hashed_password)  # Usar o model para criar o usuário
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
