from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()  # Carrega variáveis do arquivo .env para evitar expor credenciais no código
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite requisições de qualquer origem (React Frontend)

# Configuração do MongoDB
app.config["MONGO_URI"] = os.getenv("MONGO_CONECTION")  # Obtém a URL de conexão do MongoDB a partir das variáveis de ambiente
mongo = PyMongo(app)  # Inicializa a conexão com o banco de dados

# Configuração do JWT para autenticação
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")  # Chave secreta usada para assinar tokens JWT
jwt = JWTManager(app)  # Inicializa o gerenciador JWT

# Rota para testar a conexão com o banco de dados
@app.route("/teste_conexao")
def teste_conexao():
    try:
        mongo.db.command("ping")  # Comando simples para verificar se o MongoDB está respondendo
        return jsonify({"msg": "Conexão bem-sucedida com o MongoDB Atlas!"})
    except Exception as e:
        return jsonify({"msg": f"Erro na conexão: {str(e)}"})  # Retorna mensagem de erro caso a conexão falhe

# Rota para registrar um novo usuário
@app.route("/registro", methods=["POST"])
def register():
    data = request.get_json()  # Obtém os dados enviados no corpo da requisição
    username = data["username"]
    password = data["password"]

    # Verifica se o usuário já existe no banco de dados
    if mongo.db.system.find_one({"username": username}):
        return jsonify({"msg": "Usuário já existe"}), 400  # Retorna erro caso o usuário já exista

    # Cria um hash da senha para armazenamento seguro
    hashed_password = generate_password_hash(password)
    
    # Insere o novo usuário no banco de dados
    mongo.db.system.insert_one({"username": username, "password": hashed_password})
    return jsonify({"msg": "Usuário registrado com sucesso"}), 201  # Retorna sucesso

# Rota para autenticação de usuário (login)
@app.route("/acesso", methods=["POST"])
def login():
    data = request.get_json()
    user = mongo.db.system.find_one({"username": data["username"]})  # Busca o usuário no banco

    # Verifica se o usuário existe e se a senha está correta
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"msg": "Credenciais inválidas"}), 401  # Retorna erro caso as credenciais estejam erradas

    # Gera um token JWT para o usuário autenticado
    access_token = create_access_token(identity=data["username"])
    return jsonify({"token": access_token}), 200  # Retorna o token de acesso

# Rota protegida que exige autenticação JWT para acesso
@app.route("/inicio", methods=["GET"])
@jwt_required()  # Garante que apenas usuários autenticados possam acessar essa rota

def dashboard():
    return jsonify({"msg": "Acesso permitido ao dashboard"}), 200  # Responde com mensagem de sucesso

# Executa a aplicação Flask se este script for executado diretamente
if __name__ == "__main__":
    app.run(debug=True)  # Modo debug ativado para facilitar o desenvolvimento
