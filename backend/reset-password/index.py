'''
Business: Reset admin user password to a new value
Args: event with httpMethod, body containing username and new_password
Returns: HTTP response with success message
'''

import json
import os
import bcrypt
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def escape_sql_string(value: str) -> str:
    return value.replace("'", "''")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
            'body': json.dumps({'ok': False, 'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'ok': False, 'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username', '').strip()
        new_password = body_data.get('new_password', '').strip()
        
        if not username or not new_password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'ok': False, 'error': 'Username and new_password are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        escaped_username = escape_sql_string(username)
        check_query = f"SELECT id FROM t_p37006348_real_estate_agency_w.admin_users WHERE username = '{escaped_username}'"
        cursor.execute(check_query)
        user = cursor.fetchone()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'ok': False, 'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        escaped_password_hash = escape_sql_string(password_hash)
        
        update_query = f"""
            UPDATE t_p37006348_real_estate_agency_w.admin_users 
            SET password_hash = '{escaped_password_hash}'
            WHERE username = '{escaped_username}'
        """
        
        cursor.execute(update_query)
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'ok': True,
                'data': {
                    'message': f'Password for user {username} has been reset successfully'
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'ok': False, 'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            cursor.close()
            conn.close()
