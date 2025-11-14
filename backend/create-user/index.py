'''
Business: Create new admin user with hashed password
Args: event with httpMethod, body containing username, email, password, full_name
Returns: HTTP response with created user data
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
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        email = body_data.get('email', '').strip()
        password = body_data.get('password', '').strip()
        full_name = body_data.get('full_name', '').strip()
        role = body_data.get('role', 'admin').strip()
        
        if not username or not email or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'ok': False, 'error': 'Username, email and password are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        escaped_username = escape_sql_string(username)
        check_query = f"SELECT id FROM t_p37006348_real_estate_agency_w.admin_users WHERE username = '{escaped_username}'"
        cursor.execute(check_query)
        existing = cursor.fetchone()
        
        if existing:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'ok': False, 'error': 'Username already exists'}),
                'isBase64Encoded': False
            }
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        escaped_email = escape_sql_string(email)
        escaped_full_name = escape_sql_string(full_name) if full_name else ''
        escaped_role = escape_sql_string(role)
        escaped_password_hash = escape_sql_string(password_hash)
        
        insert_query = f"""
            INSERT INTO t_p37006348_real_estate_agency_w.admin_users 
            (username, email, password_hash, full_name, role, is_active)
            VALUES ('{escaped_username}', '{escaped_email}', '{escaped_password_hash}', '{escaped_full_name}', '{escaped_role}', true)
            RETURNING id, username, email, full_name, role
        """
        
        cursor.execute(insert_query)
        new_user = cursor.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'ok': True,
                'data': {
                    'user': dict(new_user)
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
