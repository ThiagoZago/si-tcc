import re

def validate_username(username):
    if not username:
        return "O campo 'username' é obrigatório."
    if len(username) < 3:
        return "O 'username' deve ter pelo menos 3 caracteres."
    return None  # Sem erros

def validate_password(password):
    if not password:
        return "O campo 'password' é obrigatório."
    if len(password) < 8:
        return "A senha deve ter pelo menos 8 caracteres."
    if not re.search(r'[A-Z]', password):
        return "A senha deve conter pelo menos uma letra maiúscula."
    if not re.search(r'[a-z]', password):
        return "A senha deve conter pelo menos uma letra minúscula."
    if not re.search(r'[0-9]', password):
        return "A senha deve conter pelo menos um número."
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return "A senha deve conter pelo menos um caractere especial."
    return None  # Sem erros
