from flask_mail import Message
from app import mail
from flask import current_app, render_template
from threading import Thread
import os

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, recipients, html_body):
    msg = Message(subject, recipients=recipients)
    msg.html = html_body
    
    # Send email asynchronously
    Thread(
        target=send_async_email,
        args=(current_app._get_current_object(), msg)
    ).start()

def send_verification_email(user, verification_url):
    # subject = "Verify your email address"
    # html_body = f"""
    # <p>Hi {user.name},</p>
    # <p>Thank you for registering with Keep! Please click the link below to verify your email address:</p>
    # <p><a href="{verification_url}">Verify Email</a></p>
    # <p>If you did not sign up for Keep, please ignore this email.</p>
    # <p>Best regards,<br>The Keep Team</p>
    # """
    # send_email(subject, [user.email], html_body)
    pass