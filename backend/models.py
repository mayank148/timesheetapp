from flask_sqlalchemy import SQLAlchemy
from flask import jsonify, request
from datetime import datetime
import jwt
from config import appconfig
from functools import wraps
from uuid import uuid4

db = SQLAlchemy()


def get_id():
    return uuid4().hex


# user model
class User(db.Model):
    id = db.Column(
        db.String(32), primary_key=True, unique=True, default=get_id)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
            data = jwt.decode(
                token, appconfig.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id'], name=data['name']).first()

        except Exception as e:
            return jsonify({'message': 'token is invalid'})

        return f(current_user, *args, **kwargs)
    return decorator


# workday model
class WorkingTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    current_date = db.Column(db.Date)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
            data = jwt.decode(
                token, appconfig.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id'], name=data['name']).first()
        except Exception as e:
            return jsonify({'message': 'token is invalid'})

        return f(current_user, *args, **kwargs)
    return decorator
