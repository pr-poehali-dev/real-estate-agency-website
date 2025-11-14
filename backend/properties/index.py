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
            headers = event.get('headers', {})
            auth_header = headers.get('Authorization', '')
            
            is_admin = False
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
                secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
                
                try:
                    payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                    if payload.get('role') == 'admin':
                        is_admin = True
                except jwt.InvalidTokenError:
                    pass
            
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
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')
            
            if not token:
                auth_header = headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header[7:]
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
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
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')
            
            if not token:
                auth_header = headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header[7:]
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
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
            
            set_clauses = []
            
            if 'title' in body_data:
                title = escape_sql_string(body_data['title'])
                set_clauses.append(f"title = '{title}'")
            if 'description' in body_data:
                description = escape_sql_string(body_data['description'])
                set_clauses.append(f"description = '{description}'")
            if 'property_type' in body_data:
                property_type = escape_sql_string(body_data['property_type'])
                set_clauses.append(f"property_type = '{property_type}'")
            if 'transaction_type' in body_data:
                transaction_type = escape_sql_string(body_data['transaction_type'])
                set_clauses.append(f"transaction_type = '{transaction_type}'")
            if 'price' in body_data:
                price = float(body_data['price'])
                set_clauses.append(f"price = {price}")
            if 'currency' in body_data:
                currency = escape_sql_string(body_data['currency'])
                set_clauses.append(f"currency = '{currency}'")
            if 'area' in body_data:
                area = float(body_data['area']) if body_data['area'] else 0
                set_clauses.append(f"area = {area}")
            if 'rooms' in body_data:
                rooms = int(body_data['rooms']) if body_data['rooms'] else 0
                set_clauses.append(f"rooms = {rooms}")
            if 'bedrooms' in body_data:
                bedrooms = int(body_data['bedrooms']) if body_data['bedrooms'] else 0
                set_clauses.append(f"bedrooms = {bedrooms}")
            if 'bathrooms' in body_data:
                bathrooms = int(body_data['bathrooms']) if body_data['bathrooms'] else 0
                set_clauses.append(f"bathrooms = {bathrooms}")
            if 'floor' in body_data:
                floor = int(body_data['floor']) if body_data['floor'] else 0
                set_clauses.append(f"floor = {floor}")
            if 'total_floors' in body_data:
                total_floors = int(body_data['total_floors']) if body_data['total_floors'] else 0
                set_clauses.append(f"total_floors = {total_floors}")
            if 'year_built' in body_data:
                year_built = int(body_data['year_built']) if body_data['year_built'] else 2020
                set_clauses.append(f"year_built = {year_built}")
            if 'district' in body_data:
                district = escape_sql_string(body_data['district'])
                set_clauses.append(f"district = '{district}'")
            if 'address' in body_data:
                address = escape_sql_string(body_data['address'])
                set_clauses.append(f"address = '{address}'")
            if 'street_name' in body_data:
                street_name = escape_sql_string(body_data['street_name'])
                set_clauses.append(f"street_name = '{street_name}'")
            if 'house_number' in body_data:
                house_number = escape_sql_string(body_data['house_number'])
                set_clauses.append(f"house_number = '{house_number}'")
            if 'apartment_number' in body_data:
                apartment_number = escape_sql_string(body_data['apartment_number'])
                set_clauses.append(f"apartment_number = '{apartment_number}'")
            if 'latitude' in body_data:
                latitude = float(body_data['latitude'])
                set_clauses.append(f"latitude = {latitude}")
            if 'longitude' in body_data:
                longitude = float(body_data['longitude'])
                set_clauses.append(f"longitude = {longitude}")
            if 'status' in body_data:
                status = escape_sql_string(body_data['status'])
                set_clauses.append(f"status = '{status}'")
            if 'features' in body_data:
                features = body_data['features']
                features_str = "ARRAY[" + ",".join([f"'{escape_sql_string(f)}'" for f in features]) + "]" if features else "'{}'"
                set_clauses.append(f"features = {features_str}")
            if 'images' in body_data:
                images = body_data['images']
                images_str = "ARRAY[" + ",".join([f"'{escape_sql_string(img)}'" for img in images]) + "]" if images else "'{}'"
                set_clauses.append(f"images = {images_str}")
            
            set_clauses.append("updated_at = CURRENT_TIMESTAMP")
            
            if not set_clauses:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_query = f"UPDATE properties SET {', '.join(set_clauses)} WHERE id = {property_id} RETURNING id"
            cursor.execute(update_query)
            result = cursor.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Property not found'}),
                    'isBase64Encoded': False
                }
            
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
            headers = event.get('headers', {})
            token = headers.get('X-Auth-Token') or headers.get('x-auth-token', '')
            
            if not token:
                auth_header = headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header[7:]
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'ok': False, 'error': 'Authentication required'}),
                    'isBase64Encoded': False
                }
            
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