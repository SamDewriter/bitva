from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class Token(BaseModel):
    name: str
    email: str
    access_token: str
    token_type: str

class ForgotPasswordIn(BaseModel):
    email: EmailStr

class VerificationTokenIn(BaseModel):
    token: str

class PasswordResetIn(BaseModel):
    new_password: str
    token: str

class UserRead(BaseModel):
    id: int
    email: str
    name: str
    is_verified: bool
    is_active: bool

    class Config:
        orm_mode = True