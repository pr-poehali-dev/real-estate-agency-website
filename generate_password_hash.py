import bcrypt

# Новый безопасный пароль
password = "WSE2024!Admin#Secure"

# Генерация bcrypt хэша
salt = bcrypt.gensalt(rounds=12)
password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)

print(f"Пароль: {password}")
print(f"Bcrypt хэш: {password_hash.decode('utf-8')}")
