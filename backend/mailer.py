import os
import smtplib
import logging
import threading
import time
from dataclasses import dataclass
from functools import wraps
from mimetypes import guess_type
from pathlib import Path
from typing import Dict, Iterable, Optional, Union, Tuple, List
from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from jinja2 import Environment, FileSystemLoader, select_autoescape
from dotenv import load_dotenv

load_dotenv()

# ----------------------------
# Constants & setup
# ----------------------------
display_name = "Bitva"
TEMPLATES_DIR = Path(__file__).resolve().parent / "templates" / "email"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mailer")


# ----------------------------
# SMTP configuration
# ----------------------------
@dataclass
class SMTPConfig:
    host: str
    port: int
    user: str
    password: str
    display_name: str = "No-Reply"
    use_ssl: bool = True  # If False, STARTTLS will be attempted

PRIMARY_SMTP = SMTPConfig(
    host=os.getenv("EMAIL_HOST", ""),
    port=int(os.getenv("EMAIL_PORT", "465")),
    user=os.getenv("EMAIL_HOST_USER", ""),
    password=os.getenv("EMAIL_PASSWORD", ""),
    display_name=os.getenv("DISPLAY_NAME", display_name),
    use_ssl=os.getenv("EMAIL_USE_SSL", "1") == "1",
)

BROADCAST_SMTP = SMTPConfig(
    host=os.getenv("B_EMAIL_HOST", ""),
    port=int(os.getenv("B_EMAIL_PORT", "465")),
    user=os.getenv("B_EMAIL_HOST_USER", ""),
    password=os.getenv("B_EMAIL_PASSWORD", ""),
    use_ssl=os.getenv("B_EMAIL_USE_SSL", "1") == "1",
)

# ----------------------------
# Utilities
# ----------------------------
def run_async(func):
    """Decorator to run a function in a separate thread (fire-and-forget)."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        t = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)
        t.start()
        return t  # return the thread if caller wants to join/inspect
    return wrapper

def _deliver(msg: EmailMessage, cfg: SMTPConfig) -> None:
    if cfg.use_ssl:
        with smtplib.SMTP_SSL(cfg.host, cfg.port, timeout=30) as server:
            server.login(cfg.user, cfg.password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(cfg.host, cfg.port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.login(cfg.user, cfg.password)
            server.send_message(msg)

def _attach_files(msg: EmailMessage, paths: Iterable[str]) -> None:
    for path in paths:
        try:
            ctype, _ = guess_type(path)
            maintype, subtype = (ctype.split("/", 1) if ctype else ("application", "octet-stream"))
            with open(path, "rb") as f:
                data = f.read()
            msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=Path(path).name)
        except Exception as e:
            logger.warning("Failed to attach %s: %s", path, e)

def _embed_images_cid(msg: EmailMessage, cid_map: Dict[str, str]) -> Dict[str, str]:
    """
    Embed images and return a dict {placeholder: cid_uri}. In your HTML, reference with <img src="cid:...">
    cid_map keys are local file paths; values are placeholder keys you plan to replace or ignore if you reference directly.
    """
    result = {}
    for img_path, key in cid_map.items():
        try:
            with open(img_path, "rb") as f:
                data = f.read()
            ctype, _ = guess_type(img_path)
            maintype, subtype = (ctype.split("/", 1) if ctype else ("image", "png"))
            cid = make_msgid(domain="bitva.app")[1:-1]  # strip <> for convenience
            msg.get_payload()[1].add_related(data, maintype=maintype, subtype=subtype, cid=f"<{cid}>", filename=Path(img_path).name)
            result[key] = cid
        except Exception as e:
            logger.warning("Failed to embed image %s: %s", img_path, e)
    return result

# ----------------------------
# Public API
# ----------------------------
def send_email(
    email: str,
    subject: str,
    html_content: str,
    attachments: Optional[Union[str, Iterable[str]]] = None,
    broadcast: bool = False,
    reply_to: Optional[str] = None,
    inline_images: Optional[Dict[str, str]] = None,  # {local_path: placeholder_key}
) -> bool:
    """
    Send an email.

    - attachments: path or iterable of paths to attach as files.
    - broadcast: use BROADCAST_SMTP creds if True; else PRIMARY_SMTP.
    - reply_to: set a Reply-To header.
    - inline_images: embed images and reference in HTML with <img src="cid:{cid}">.
                     If you pass a mapping of {local_path: key}, we return the cid in place of each 'key'.

    Returns True on success, False on failure.
    """
    cfg = BROADCAST_SMTP if broadcast else PRIMARY_SMTP

    try:
        msg = EmailMessage()
        msg["From"] = formataddr((cfg.display_name, cfg.user))
        msg["To"] = email
        msg["Subject"] = subject
        if reply_to:
            msg["Reply-To"] = reply_to

        # text fallback + HTML
        msg.set_content("This message contains HTML content. Please view in an HTML-capable client.")
        msg.add_alternative(html_content or "<p>(no content)</p>", subtype="html")

        # attachments
        if attachments:
            if isinstance(attachments, str):
                attachments = [attachments]
            _attach_files(msg, attachments)

        # inline images (CID)
        if inline_images:
            # add_related to the HTML alternative (payload index 1)
            cids = _embed_images_cid(msg, inline_images)
            # If you want to replace placeholders in HTML with generated CIDs, do it here:
            if cids:
                html = msg.get_body(preferencelist=('html',)).get_content()
                for placeholder_key, cid in cids.items():
                    html = html.replace(f"cid:{placeholder_key}", f"cid:{cid}")
                msg.get_body(preferencelist=('html',)).set_content(html, subtype="html")

    except Exception as e:
        logger.error("Error building message: %s", e)
        return False

    try:
        _deliver(msg, cfg)
        return True
    except Exception as e:
        logger.error("Error sending email: %s", e)
        return False

# ----------------------------
# App-specific helpers (async)
# ----------------------------
@run_async
def send_verification_email(email: str, url: str):
    subject = "Email Verification"
    html_path = TEMPLATES_DIR / "verify.html"
    try:
        html = html_path.read_text(encoding="utf-8").replace("{{ CONFIRM_URL }}", url)
    except Exception as e:
        logger.error("Failed to load %s: %s", html_path, e)
        html = f"<p>Verify your email: <a href='{url}'>Confirm</a></p>"
    send_email(email, subject, html)

@run_async
def send_password_reset_email(email: str, url: str):
    subject = "Password Reset Request"
    html_path = TEMPLATES_DIR / "reset.html"
    try:
        html = html_path.read_text(encoding="utf-8").replace("{{ RESET_URL }}", url)
    except Exception as e:
        logger.error("Failed to load %s: %s", html_path, e)
        html = f"<p>Reset your password: <a href='{url}'>Reset</a></p>"
    send_email(email, subject, html)



# ----------------------------
# Broadcast (multi-recipient) — reuses one SMTP session
# ----------------------------
_jinja_env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(["html", "xml"])
)
_broadcast_tpl = _jinja_env.get_template("broadcast.html")  # expects {{ user_name }} and {{ MESSAGE_CONTENT | safe }}

def _build_msg_for_user(
    cfg: SMTPConfig,
    to_email: str,
    subject: str,
    html_body: str,
    attachments: Optional[Union[str, Iterable[str]]] = None,
    reply_to: Optional[str] = None,
    inline_images: Optional[Dict[str, str]] = None,
) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = formataddr((cfg.display_name, cfg.user))
    msg["To"] = to_email
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to

    msg.set_content("This message contains HTML content. Please view in an HTML-capable client.")
    msg.add_alternative(html_body or "<p>(no content)</p>", subtype="html")

    if attachments:
        _attach_files(msg, [attachments] if isinstance(attachments, str) else attachments)

    if inline_images:
        _embed_images_cid(msg, inline_images)  # fresh CIDs per message

    return msg

def send_broadcast_email(
    user_info: Iterable[Tuple[str, str]],
    subject: str,
    message_content: str,
    attachments: Optional[Union[str, Iterable[str]]] = None,
    reply_to: Optional[str] = None,
    inline_images: Optional[Dict[str, str]] = None,
    sleep_between: float = 0.0,
) -> List[Tuple[str, str, bool]]:
    """
    Send to many recipients over a single SMTP session.
    Returns [(username, email, success_bool), ...].
    Template: templates/email/broadcast.html with {{ user_name }} and {{ MESSAGE_CONTENT | safe }}.
    """
    cfg = BROADCAST_SMTP
    results: List[Tuple[str, str, bool]] = []

    # Render static part once; keep user_name dynamic via a placeholder swap
    try:
        base_html = _broadcast_tpl.render(MESSAGE_CONTENT=message_content, user_name="__PLACEHOLDER__")
    except Exception as e:
        logger.error("Failed to render broadcast.html: %s", e)
        return [(u, eaddr, False) for (u, eaddr) in user_info]

    # Open one connection
    try:
        if cfg.use_ssl:
            server = smtplib.SMTP_SSL(cfg.host, cfg.port, timeout=30)
        else:
            server = smtplib.SMTP(cfg.host, cfg.port, timeout=30)
            server.ehlo()
            server.starttls()
        server.login(cfg.user, cfg.password)
    except Exception as e:
        logger.error("SMTP login failed: %s", e)
        return [(u, eaddr, False) for (u, eaddr) in user_info]

    try:
        for username, email in user_info:
            try:
                html = base_html.replace("__PLACEHOLDER__", username)
                msg = _build_msg_for_user(
                    cfg, email, subject, html,
                    attachments=attachments,
                    reply_to=reply_to,
                    inline_images=inline_images,
                )
                server.send_message(msg)
                results.append((username, email, True))
            except Exception as per_err:
                logger.warning("Failed to send to %s <%s>: %s", username, email, per_err)
                results.append((username, email, False))

            if sleep_between > 0:
                time.sleep(sleep_between)
    finally:
        try:
            server.quit()
        except Exception:
            pass

    return results


def send_test_broadcast(
    to_email: str,
    subject: str,
    message_content: str,
    username: str = "Test User",
    attachments: Optional[Union[str, Iterable[str]]] = None,
    reply_to: Optional[str] = None,
    inline_images: Optional[Dict[str, str]] = None,
) -> bool:
    """
    Send a test broadcast email to a single recipient using the broadcast template.
    Renders the template with the provided message_content and username.
    """
    cfg = BROADCAST_SMTP
    try:
        html = _broadcast_tpl.render(MESSAGE_CONTENT=message_content, user_name=username)
    except Exception as e:
        logger.error("Failed to render broadcast.html: %s", e)
        return False

    try:
        msg = _build_msg_for_user(
            cfg, to_email, subject, html,
            attachments=attachments,
            reply_to=reply_to,
            inline_images=inline_images,
        )
        _deliver(msg, cfg)
        return True
    except Exception as e:
        logger.error("Failed to send test broadcast to %s: %s", to_email, e)
        return False