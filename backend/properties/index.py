import json
import os
import jwt
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: CRUD operations for real estate properties
    Args: event - dict with httpMethod, body, queryStringParameters, headers
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with property data
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Database connection
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            # Get properties with filters
            query_params = event.get('queryStringParameters', {}) or {}
            
            # Build WHERE clause based on filters
            where_conditions = []
            params = []
            
            # District filter
            district = query_params.get('district')
            if district and district != 'Все районы':
                where_conditions.append("district = %s")
                params.append(district)
            
            # Property type filter
            property_type = query_params.get('type')
            if property_type and property_type != 'all':
                where_conditions.append("property_type = %s")
                params.append(property_type)
            
            # Transaction type filter
            transaction_type = query_params.get('transaction')
            if transaction_type and transaction_type != 'all':
                where_conditions.append("transaction_type = %s")
                params.append(transaction_type)
            
            # Price range filters
            min_price = query_params.get('min_price')
            if min_price:
                try:
                    min_price_val = float(min_price)
                    where_conditions.append("price >= %s")
                    params.append(min_price_val)
                except ValueError:
                    pass
            
            max_price = query_params.get('max_price')
            if max_price:
                try:
                    max_price_val = float(max_price)
                    where_conditions.append("price <= %s")
                    params.append(max_price_val)
                except ValueError:
                    pass
            
            # Only active properties for public view
            where_conditions.append("status = 'active'")
            
            # Build final query
            base_query = """
                SELECT id, title, description, property_type, transaction_type, 
                       price, currency, area, rooms, bedrooms, bathrooms, 
                       floor, total_floors, year_built, district, address, 
                       latitude, longitude, features, images, status, 
                       created_at, updated_at
                FROM properties
            """
            
            if where_conditions:
                query = base_query + " WHERE " + " AND ".join(where_conditions)
            else:
                query = base_query
            
            query += " ORDER BY created_at DESC"
            
            cursor.execute(query, params)
            properties = cursor.fetchall()
            
            # Convert Decimal to float for JSON serialization
            properties_list = []
            for prop in properties:
                prop_dict = dict(prop)
                if prop_dict['price']:
                    prop_dict['price'] = float(prop_dict['price'])
                if prop_dict['area']:
                    prop_dict['area'] = float(prop_dict['area'])
                if prop_dict['latitude']:
                    prop_dict['latitude'] = float(prop_dict['latitude'])
                if prop_dict['longitude']:
                    prop_dict['longitude'] = float(prop_dict['longitude'])
                
                # Ensure arrays are not None
                prop_dict['features'] = prop_dict['features'] or []
                prop_dict['images'] = prop_dict['images'] or []
                
                properties_list.append(prop_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'properties': properties_list,
                    'count': len(properties_list)
                })
            }
        
        elif method == 'POST':
            # Add new property (admin only)
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Authentication required'})
                }
            
            # Verify admin token
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                if payload.get('role') != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Admin access required'})
                    }
            except jwt.InvalidTokenError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            # Parse request body
            body_data = json.loads(event.get('body', '{}'))
            
            # Insert new property
            insert_query = """
                INSERT INTO properties (
                    title, description, property_type, transaction_type, price, currency,
                    area, rooms, bedrooms, bathrooms, floor, total_floors, year_built,
                    district, address, latitude, longitude, features, images, status
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                ) RETURNING id
            """
            
            cursor.execute(insert_query, (
                body_data.get('title'),
                body_data.get('description'),
                body_data.get('property_type'),
                body_data.get('transaction_type'),
                body_data.get('price'),
                body_data.get('currency', 'AMD'),
                body_data.get('area'),
                body_data.get('rooms'),
                body_data.get('bedrooms'),
                body_data.get('bathrooms'),
                body_data.get('floor'),
                body_data.get('total_floors'),
                body_data.get('year_built'),
                body_data.get('district'),
                body_data.get('address'),
                body_data.get('latitude'),
                body_data.get('longitude'),
                body_data.get('features', []),
                body_data.get('images', []),
                body_data.get('status', 'active')
            ))
            
            property_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'property_id': property_id,
                    'message': 'Property created successfully'
                })
            }
        
        elif method == 'DELETE':
            # Delete property (admin only)
            auth_header = event.get('headers', {}).get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Authentication required'})
                }
            
            # Verify admin token
            token = auth_header[7:]
            secret_key = os.environ.get('JWT_SECRET', 'default-secret-change-in-production')
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                if payload.get('role') != 'admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Admin access required'})
                    }
            except jwt.InvalidTokenError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            property_id = event.get('pathParameters', {}).get('id')
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Property ID is required'})
                }
            
            cursor.execute("DELETE FROM properties WHERE id = %s", (property_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Property deleted successfully'
                })
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }
    
    finally:
        if 'conn' in locals():
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'})
    }