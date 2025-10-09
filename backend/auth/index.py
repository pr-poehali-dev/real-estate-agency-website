'''
Business: Authentication system for admin panel
Args: event with httpMethod, body, headers, queryStringParameters
Returns: HTTP response with JWT token or user data
'''

import json
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
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
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data.get('username', '').strip()
            password = body_data.get('password', '').strip()
            
            if not username or not password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Username and password are required'}),
                    'isBase64Encoded': False
                }
            
            escaped_username = escape_sql_string(username)
            query = f"SELECT id, username, password_hash, email, full_name, role, is_active FROM t_p37006348_real_estate_agency_w.admin_users WHERE username = '{escaped_username}'"
            cursor.execute(query)
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            if not user['is_active']:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'User is not active'}),
                    'isBase64Encoded': False
                }
            
            password_hash = user['password_hash']
            if isinstance(password_hash, str):
                password_hash = password_hash.encode('utf-8')
            
            try:
                password_match = bcrypt.checkpw(password.encode('utf-8'), password_hash)
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': f'Password check error: {str(e)}'}),
                    'isBase64Encoded': False
                }
            
            if not password_match:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Invalid password'}),
                    'isBase64Encoded': False
                }
            
            update_query = f"UPDATE t_p37006348_real_estate_agency_w.admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = {user['id']}"
            cursor.execute(update_query)
            conn.commit()
            
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            payload = {
                'user_id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'exp': datetime.utcnow() + timedelta(days=7),
                'iat': datetime.utcnow()
            }
            
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'ok': True,
                    'data': {
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email'],
                            'full_name': user['full_name'],
                            'role': user['role']
                        }
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'No token provided'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                user_id = payload.get('user_id')
                
                query = f"SELECT id, username, email, full_name, role, is_active FROM t_p37006348_real_estate_agency_w.admin_users WHERE id = {user_id}"
                cursor.execute(query)
                user = cursor.fetchone()
                
                if not user or not user['is_active']:
                    return {
                        'statusCode': 401,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'ok': False, 'error': 'User not found or inactive'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'ok': True,
                        'data': {
                            'user': {
                                'id': user['id'],
                                'username': user['username'],
                                'email': user['email'],
                                'full_name': user['full_name'],
                                'role': user['role']
                            }
                        }
                    }),
                    'isBase64Encoded': False
                }
                
            except jwt.ExpiredSignatureError:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Token expired'}),
                    'isBase64Encoded': False
                }
            except jwt.InvalidTokenError:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Invalid token'}),
                    'isBase64Encoded': False
                }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'ok': False, 'error': f'Server error: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    finally:
        if conn:
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'ok': False, 'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }