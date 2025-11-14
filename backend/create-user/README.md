# Создание пользователя админ-панели

Эта функция создает нового пользователя для админ-панели с хешированным паролем.

## URL функции
```
https://functions.poehali.dev/05d06f77-8524-4191-9ede-6fca49ca4f98
```

## Создание нового пользователя

### С помощью curl:
```bash
curl -X POST https://functions.poehali.dev/05d06f77-8524-4191-9ede-6fca49ca4f98 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myusername",
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "Имя Фамилия",
    "role": "admin"
  }'
```

### С помощью JavaScript (консоль браузера):
```javascript
fetch('https://functions.poehali.dev/05d06f77-8524-4191-9ede-6fca49ca4f98', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'myusername',
    email: 'user@example.com',
    password: 'securepassword123',
    full_name: 'Имя Фамилия',
    role: 'admin'
  })
})
.then(r => r.json())
.then(console.log)
```

## Параметры

- `username` (обязательно) - имя пользователя для входа
- `email` (обязательно) - email пользователя
- `password` (обязательно) - пароль (будет автоматически захеширован)
- `full_name` (опционально) - полное имя пользователя
- `role` (опционально, по умолчанию "admin") - роль пользователя

## Текущий администратор

В базе данных уже есть пользователь:
- **Username**: admin
- **Email**: admin@wse.am
- **Пароль**: установлен ранее (если не помните, создайте нового пользователя)

## После создания

После создания нового пользователя вы можете войти в админ-панель по адресу:
```
https://your-domain.com/admin
```

Используйте созданные `username` и `password` для входа.
