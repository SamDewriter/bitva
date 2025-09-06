from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
import os
import threading
from functools import wraps
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

TEMPLATES_DIR = Path(__file__).resolve().parent / "templates" / "email"

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
display_name = "Bitva"


def run_async(func):
    """Decorator to run a function in a separate thread."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        threading.Thread(target=func, args=args, kwargs=kwargs).start()
    return wrapper


def send_email(email: str, subject: str, html_content: str):
    msg = MIMEMultipart("alternative")
    msg["From"] = f"{display_name} <{EMAIL_HOST_USER}>"
    msg["To"] = email
    msg["Subject"] = subject
    try:
        msg.attach(MIMEText(html_content, "html"))
    except Exception as e:
        print(f"Error reading template: {e}")
        msg.attach(MIMEText("Could not load email template.", "plain"))

    try:
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as server:
            server.login(EMAIL_HOST_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_HOST_USER, email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {e}")

@run_async
def send_verification_email(email: str, url: str):
    subject = "Email Verification"
    html_path = "templates/email/verify.html"
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read().replace("{{ CONFIRM_URL }}", url)

    send_email(email, subject, html_content)

@run_async  
def send_password_reset_email(email: str, url: str):
    subject = "Password Reset Request"
    html_path = "templates/email/reset.html"
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read().replace("{{ RESET_URL }}", url)

    send_email(email, subject, html_content)
