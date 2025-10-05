'''
Business: Отправка заявок с сайта WSE.AM в Telegram бота
Args: event с полями name, phone, email, service, message
Returns: HTTP response с результатом отправки
'''

import json
import urllib.request
import urllib.parse
from typing import Dict, Any
import os

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    # Парсим тело запроса
    body_data = json.loads(event.get('body', '{}'))
    
    name = body_data.get('name', '')
    contact_method = body_data.get('contactMethod', '')
    contact = body_data.get('contact', '')
    service = body_data.get('service', '')
    message = body_data.get('message', '')
    
    # Валидация
    if not name or not contact:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    # Получаем настройки из переменных окружения
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
    
    print(f'Bot token exists: {bool(bot_token)}')
    print(f'Chat ID: {chat_id}')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Bot token or chat ID not configured'}),
            'isBase64Encoded': False
        }
    
    # Формируем текст сообщения
    telegram_message = f'''🏠 <b>Новая заявка с сайта WSE.AM</b>

👤 <b>Имя:</b> {name}
📱 <b>Способ связи:</b> {contact_method}
💬 <b>Контакт:</b> {contact}
🔑 <b>Тип услуги:</b> {service}

✉️ <b>Сообщение:</b>
{message}'''
    
    # Отправляем в Telegram
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': telegram_message,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=data, method='POST')
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f'Telegram API response: {result}')
            
            if result.get('ok'):
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'message': 'Заявка отправлена в Telegram'}),
                    'isBase64Encoded': False
                }
            else:
                print(f'Telegram API error: {result}')
                raise Exception(f"Telegram API error: {result}")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f'HTTP Error: {e.code}, Body: {error_body}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Telegram API error: {error_body}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        print(f'Exception: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to send to Telegram: {str(e)}'}),
            'isBase64Encoded': False
        }