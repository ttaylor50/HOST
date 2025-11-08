from fastapi import APIRouter, HTTPException
from passlib.hash import pbkdf2_sha256 as sha256
from .models import UserCreate, User, LoginCredentials
from . import db
from datetime import date

router = APIRouter()


# initialize DB when router imported
db.init_db()


@router.post("/register", response_model=User)
async def register(user: UserCreate):
    # Check if username already exists
    existing = db.get_user_by_username(user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    try:
        new_user = db.create_user(
            username=user.username,
            password=sha256.hash(user.password),
            location=user.location,
            email=user.email,
            expert=user.expert,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Remove password before returning
    if 'password' in new_user:
        new_user.pop('password')
    return new_user


@router.post("/login")
async def login(credentials: LoginCredentials):
    user = db.get_user_by_username(credentials.username)
    if not user or not sha256.verify(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Record today's login for calendar tracking
    db.record_login(user['id'], on_date=date.today())

    return {
        "success": True,
        "expert": bool(user.get('expert', 0)),
        "username": user['username']
    }


@router.get('/calendar/{username}')
async def get_calendar(username: str):
    user = db.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    dates = db.get_login_dates(user['id'])
    # return list of ISO dates where user logged in
    return { 'username': username, 'dates': dates }