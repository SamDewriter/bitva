import logging
from fastapi import FastAPI, HTTPException, Depends, APIRouter, status
import jwt
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import hmac
from database import get_db, engine
from models import Base
from schemas import (TestBroadcastIn, UserCreate, Token, ForgotPasswordIn, 
                    PasswordResetIn, 
                    BroadcastIn,
                    UpdateProfileIn)
import secrets
from crud import create_user
from utils import (create_access_token, get_user_by_email, get_user_by_password_reset_token, 
                   get_user_by_verification_token,
                   verify_password, get_password_hash, hash_token,
                        get_user_by_status,
                        decode_access_token,
                        get_all_verified_users,
                        blacklist)
from auth import oauth2_scheme
from mailer import (send_verification_email, 
                    send_password_reset_email, 
                    send_broadcast_email,
                    send_test_broadcast as send_test_broadcast_email)
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv

load_dotenv()


FRONTEND_URL = os.getenv("FRONTEND_URL")

api = APIRouter(prefix="/api", tags=["auth"])
admin_api = APIRouter(prefix="/api/admin", tags=["admin"])


app = FastAPI(
    title="Bitva Application",
    docs_url="/api/docs",
    description="API for user registration, login, and password management",
    version="1.0.0"
)
RESET_TTL_MINUTES = 30

Base.metadata.create_all(bind=engine)


def current_user_dep(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)  # must raise on invalid/expired
        email = payload.get("sub")
        if not email:
            raise cred_exc
    except jwt.PyJWTError:
        raise cred_exc

    user = get_user_by_email(db, email)
    if not user:
        raise cred_exc
    return user


# User Routes

@api.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    if '@' not in user.email:
        raise HTTPException(status_code=400, detail="Invalid email format")

    verification_token = secrets.token_urlsafe()
    verification_hash = hash_token(verification_token)

    db_user = create_user(db, user)

    # Update user with verification token and expiry
    db_user.verification_token = verification_hash
    db_user.verification_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=30)

    db.commit()
    db.refresh(db_user)

    send_verification_email(
        db_user.email, 
        f"{FRONTEND_URL}/verify?token={verification_token}")

    return {
        "User Email": db_user.email,
        "User Name": db_user.name,
        "msg": "User registered successfully"
    }

@api.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Use username field as email
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    # if user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized as regular user")
    access_token = create_access_token(data={"sub": user.email})
    return {
        "name": user.name,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }

@api.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    """
    Logs out the user by blacklisting the provided access token.
    The token is automatically extracted from the Authorization header (Bearer token).
    """
    blacklist.add(token)
    return {"msg": "User logged out successfully"}


@api.post("/reset_password")
def reset_password(
    data: PasswordResetIn, db: Session = Depends(get_db)
):
    token_hash = hash_token(data.token)
    user = get_user_by_password_reset_token(db, token_hash)

    if not user:
        raise HTTPException(status_code=404, detail="Invalid token")

    expiry = user.password_reset_token_expiry
    if expiry is not None and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not expiry or expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if not hmac.compare_digest(user.password_reset_token, token_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired token")


    user.password_reset_token = None
    user.password_reset_token_expiry = None

    new_password = get_password_hash(data.new_password)
    user.password = new_password
    db.commit()

    return {"msg": "Password reset successfully"}


@api.post("/forgot_password")
def forgot_password(
    payload: ForgotPasswordIn,
    db: Session = Depends(get_db)
    ):
    generic_msg = {"msg": "If the account exists, a password reset email will be sent."}

    user = get_user_by_email(db, payload.email)

    if not user:
        return generic_msg

    raw_token = secrets.token_urlsafe()
    token_hash = hash_token(raw_token)

    user.password_reset_token = token_hash
    user.password_reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=RESET_TTL_MINUTES)
    
    db.commit()
    db.refresh(user)

    send_password_reset_email(user.email, f"{FRONTEND_URL}/reset-password?token={raw_token}")

    return generic_msg


@api.post("/update_profile")
async def update_profile(
    data: UpdateProfileIn,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    user = Depends(current_user_dep)
):
    user.name = data.name
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return {
        "msg": "Profile updated successfully",
        "name": user.name,
        "email": user.email
    }

@api.get("/verify_email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)):

    token_hash = hash_token(token)
    user = get_user_by_verification_token(db, token_hash)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=200, detail="Email already verified")

    expiry = user.verification_token_expiry
    if expiry is not None and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not expiry or expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if not hmac.compare_digest(user.verification_token, token_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user.is_verified = True
    user.verification_token = None
    user.verification_token_expiry = None
    db.commit()

    return {"msg": "Email verified successfully"}

@api.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    cred_exec = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = payload.get("sub")
    if email is None:
        raise cred_exec
    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Admin Routes

@admin_api.post("/login", response_model=Token)
def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Use username field as email
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    access_token = create_access_token(data={"sub": user.email})
    print(user.email)
    return {
        "name": user.name,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }

@admin_api.get("/users/{status}")
async def get_users_by_status(status: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Retrieve users based on their verification status.
    Status can be 'verified', 'unverified', or 'all'.
    """
    payload = decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email)
    if user is None or not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    users = get_user_by_status(db, status)
    # Return empty list if no users found, instead of 404
    return {
        "users": [{"id": u.id, 
                  "email": u.email, 
                   "name": u.name, 
                   "role": "admin" if u.is_admin else "user",
                   "status": (
                          "active" if u.is_active else "inactive"
                   ),
                     "verification": (
                              "verified" if u.is_verified else "unverified"
                     ),
                   "joined": u.created_at.isoformat() if u.created_at else None,
                   } for u in users]
    }

@admin_api.post("/send_broadcast/")
async def send_broadcast(broadcast: BroadcastIn, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email)
    if user is None or not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    # Dummy broadcast logic
    verified_users = get_all_verified_users(db)

    # Create a dictionary of both usernames and email

    users_info = [(u.name, u.email) for u in verified_users]

    print(f"Broadcasting to {len(users_info)} users: {users_info}")
    send_broadcast_email(users_info, broadcast.subject, broadcast.message_content)

    return {"msg": f"Broadcast sent to {len(users_info)} users"}

@admin_api.post("/send_test_broadcast/")
async def send_test_broadcast(broadcast: TestBroadcastIn, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email)
    if user is None or not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    if send_test_broadcast_email(broadcast.email, broadcast.subject, broadcast.message_content):
        return {"msg": "Test email sent successfully"}
    return {"msg": "Failed to send test email"}


app.include_router(api)
app.include_router(admin_api)

