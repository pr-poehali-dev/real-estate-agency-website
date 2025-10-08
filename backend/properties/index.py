'''
Business: CRUD operations for real estate properties
Args: event with httpMethod, body, queryStringParameters, headers, pathParameters
Returns: HTTP response with property data or success status
'''

import json
import os
import jwt
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            
            where_conditions = []
            
            district = query_params.get('district', '').strip()
            if district and district != 'Все районы':
                escaped_district = escape_sql_string(district)
                where_conditions.append(f"district = '{escaped_district}'")
            
            property_type = query_params.get('type', '').strip()
            if property_type and property_type != 'all':
                escaped_type = escape_sql_string(property_type)
                where_conditions.append(f"property_type = '{escaped_type}'")
            
            transaction_type = query_params.get('transaction', '').strip()
            if transaction_type and transaction_type != 'all':
                escaped_transaction = escape_sql_string(transaction_type)
                where_conditions.append(f"transaction_type = '{escaped_transaction}'")
            
            min_price = query_params.get('min_price', '').strip()
            if min_price:
                try:
                    min_price_val = float(min_price)
                    where_conditions.append(f"price >= {min_price_val}")
                except ValueError:
                    pass
            
            max_price = query_params.get('max_price', '').strip()
            if max_price:
                try:
                    max_price_val = float(max_price)
                    where_conditions.append(f"price <= {max_price_val}")
                except ValueError:
                    pass
            
            rooms = query_params.get('rooms', '').strip()
            if rooms:
                try:
                    rooms_val = int(rooms)
                    where_conditions.append(f"rooms = {rooms_val}")
                except ValueError:
                    pass
            
            query_text = query_params.get('query', '').strip()
            if query_text:
                escaped_query = escape_sql_string(query_text)
                where_conditions.append(f"(title ILIKE '%{escaped_query}%' OR description ILIKE '%{escaped_query}%' OR address ILIKE '%{escaped_query}%')")
            
            where_conditions.append("status = 'active'")
            
            base_query = """
                SELECT id, title, description, property_type, transaction_type, 
                       price, currency, area, rooms, bedrooms, bathrooms, 
                       floor, total_floors, year_built, district, address, 
                       street_name, house_number, apartment_number,
                       latitude, longitude, features, images, status, 
                       created_at, updated_at
                FROM properties
            """
            
            if where_conditions:
                query = base_query + " WHERE " + " AND ".join(where_conditions)
            else:
                query = base_query
            
            query += " ORDER BY created_at DESC"
            
            cursor.execute(query)
            properties = cursor.fetchall()
            
            properties_list = []
            for prop in properties:
                prop_dict = dict(prop)
                if prop_dict.get('price'):
                    prop_dict['price'] = float(prop_dict['price'])
                if prop_dict.get('area'):
                    prop_dict['area'] = float(prop_dict['area'])
                if prop_dict.get('latitude'):
                    prop_dict['latitude'] = float(prop_dict['latitude'])
                if prop_dict.get('longitude'):
                    prop_dict['longitude'] = float(prop_dict['longitude'])
                
                prop_dict['features'] = prop_dict.get('features') or []
                prop_dict['images'] = prop_dict.get('images') or []
                
                if prop_dict.get('created_at'):
                    prop_dict['created_at'] = prop_dict['created_at'].isoformat()
                if prop_dict.get('updated_at'):
                    prop_dict['updated_at'] = prop_dict['updated_at'].isoformat()
                
                properties_list.append(prop_dict)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'ok': True,
                    'data': {
                        'properties': properties_list,
                        'count': len(properties_list)
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                if payload.get('role') != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'ok': False, 'error': 'Admin access required'}),
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
            
            body_data = json.loads(event.get('body', '{}'))
            
            title = escape_sql_string(body_data.get('title', ''))
            description = escape_sql_string(body_data.get('description', ''))
            property_type = escape_sql_string(body_data.get('property_type', 'apartment'))
            transaction_type = escape_sql_string(body_data.get('transaction_type', 'rent'))
            price = float(body_data.get('price', 0))
            currency = escape_sql_string(body_data.get('currency', 'AMD'))
            area = float(body_data.get('area', 0)) if body_data.get('area') else 0
            rooms = int(body_data.get('rooms', 0)) if body_data.get('rooms') else 0
            bedrooms = int(body_data.get('bedrooms', 0)) if body_data.get('bedrooms') else 0
            bathrooms = int(body_data.get('bathrooms', 0)) if body_data.get('bathrooms') else 0
            floor = int(body_data.get('floor', 0)) if body_data.get('floor') else 0
            total_floors = int(body_data.get('total_floors', 0)) if body_data.get('total_floors') else 0
            year_built = int(body_data.get('year_built', 2020)) if body_data.get('year_built') else 2020
            district = escape_sql_string(body_data.get('district', ''))
            address = escape_sql_string(body_data.get('address', ''))
            street_name = escape_sql_string(body_data.get('street_name', ''))
            house_number = escape_sql_string(body_data.get('house_number', ''))
            apartment_number = escape_sql_string(body_data.get('apartment_number', ''))
            latitude = float(body_data.get('latitude', 40.1792))
            longitude = float(body_data.get('longitude', 44.4991))
            status = escape_sql_string(body_data.get('status', 'active'))
            
            features = body_data.get('features', [])
            features_str = "ARRAY[" + ",".join([f"'{escape_sql_string(f)}'" for f in features]) + "]" if features else "'{}'"
            
            images = body_data.get('images', [])
            images_str = "ARRAY[" + ",".join([f"'{escape_sql_string(img)}'" for img in images]) + "]" if images else "'{}'"
            
            insert_query = f"""
                INSERT INTO properties (
                    title, description, property_type, transaction_type, price, currency,
                    area, rooms, bedrooms, bathrooms, floor, total_floors, year_built,
                    district, address, street_name, house_number, apartment_number,
                    latitude, longitude, features, images, status
                ) VALUES (
                    '{title}', '{description}', '{property_type}', '{transaction_type}', 
                    {price}, '{currency}', {area}, {rooms}, {bedrooms}, {bathrooms}, 
                    {floor}, {total_floors}, {year_built}, '{district}', '{address}',
                    '{street_name}', '{house_number}', '{apartment_number}',
                    {latitude}, {longitude}, {features_str}, {images_str}, '{status}'
                ) RETURNING id
            """
            
            cursor.execute(insert_query)
            result = cursor.fetchone()
            property_id = result['id'] if result else None
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
                        'property_id': property_id,
                        'message': 'Property created successfully'
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                if payload.get('role') != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'ok': False, 'error': 'Admin access required'}),
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
            
            property_id = event.get('pathParameters', {}).get('id')
            if not property_id:
                query_params = event.get('queryStringParameters', {}) or {}
                property_id = query_params.get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Property ID is required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            update_query = f"UPDATE properties SET updated_at = CURRENT_TIMESTAMP WHERE id = {property_id} RETURNING id"
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
                        'message': 'Property updated successfully'
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                if payload.get('role') != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'ok': False, 'error': 'Admin access required'}),
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
            
            property_id = event.get('pathParameters', {}).get('id')
            if not property_id:
                query_params = event.get('queryStringParameters', {}) or {}
                property_id = query_params.get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Property ID is required'}),
                    'isBase64Encoded': False
                }
            
            delete_query = f"DELETE FROM properties WHERE id = {property_id}"
            cursor.execute(delete_query)
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
                        'message': 'Property deleted successfully'
                    }
                }),
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
