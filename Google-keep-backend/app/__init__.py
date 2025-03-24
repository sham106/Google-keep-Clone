import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.instance_path, 'keep.sqlite'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key'),
        JWT_ACCESS_TOKEN_EXPIRES=60*60*24,  # 1 day
        # MAIL_SERVER=os.environ.get('MAIL_SERVER'),
        # MAIL_PORT=int(os.environ.get('MAIL_PORT', 587)),
        # MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS', 'True') == 'True',
        # MAIL_USERNAME=os.environ.get('MAIL_USERNAME'),
        # MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD'),
        # MAIL_DEFAULT_SENDER=os.environ.get('MAIL_DEFAULT_SENDER')
    )
    
    if test_config is not None:
        app.config.from_mapping(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.auth.routes import auth_bp
    from app.notes.routes import notes
    app.register_blueprint(auth_bp)
    app.register_blueprint(notes)    
    return app