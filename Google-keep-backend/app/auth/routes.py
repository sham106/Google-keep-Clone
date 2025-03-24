from flask import Blueprint, request, jsonify, current_app, url_for
from app import db, jwt
from app.models import User
from flask_jwt_extended import (
    create_access_token, 
    get_jwt_identity,
    jwt_required
)
from werkzeug.security import generate_password_hash
import re
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Basic validation
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if email is valid
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data.get('email')):
        return jsonify({'message': 'Invalid email address'}), 400
    
    # Check if password is strong enough
    if len(data.get('password')) < 6:
        return jsonify({'message': 'Password must be at least 6 characters long'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    user = User(
        name=data.get('name'),
        email=data.get('email')
    )
    user.set_password(data.get('password'))
    
    # Add and commit the new user to the database
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully.',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    # Commenting out the email verification route
    # user = User.query.filter_by(email_verification_token=token).first()
    
    # if not user:
    #     return jsonify({'message': 'Invalid verification token'}), 400
    
    # user.is_active = True
    # user.email_verification_token = None
    # db.session.commit()
    
    # return jsonify({'message': 'Email verified successfully. You can now log in.'}), 200
    return jsonify({'message': 'Email verification is currently disabled for testing.'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # if not user.is_active:
    #     return jsonify({'message': 'Please verify your email before logging in'}), 401
    
    # Create access token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'name': user.name, 'email': user.email}
    )
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200