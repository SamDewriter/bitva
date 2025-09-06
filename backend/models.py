from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    password = Column(String)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # Email Verification
    verification_token = Column(String, unique=True, index=True, nullable=True)
    verification_token_expiry = Column(DateTime, nullable=True)

    # Password Reset
    password_reset_token = Column(String, unique=True, index=True, nullable=True)
    password_reset_token_expiry = Column(DateTime, nullable=True)