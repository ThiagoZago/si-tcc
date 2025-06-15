from app.extensions import mongo

def find_user_by_username(username):
    return mongo.db.system.find_one({"username": username})

def create_user(username, hashed_password):
    mongo.db.system.insert_one({
        "username": username,
        "password": hashed_password
    })

def check_user_exists(username):
    return mongo.db.system.find_one({"username": username}) is not None
