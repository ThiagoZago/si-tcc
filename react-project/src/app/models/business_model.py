from app.extensions import mongo

def inserir_estabelecimento(data):
    result = mongo.db.business.insert_one(data)
    return str(result.inserted_id)
