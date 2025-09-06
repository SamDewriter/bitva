from sqlalchemy.orm import Session
from utils import get_password_hash
from schemas import UserCreate
from models import User

def create_user(db: Session, user: UserCreate):
    hashed_pw = get_password_hash(user.password)
    db_user = User(email=user.email, name=user.name, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
