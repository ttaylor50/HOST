from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    location: str
    email: str
    expert: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

class LoginCredentials(BaseModel):
    username: str
    password: str