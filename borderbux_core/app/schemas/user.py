# app/schemas/user.py

from pydantic import BaseModel
from uuid import UUID

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str
    country_code: str

    class Config:
        orm_mode = True  # Tells Pydantic to treat SQLAlchemy models as dictionaries


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str
    country_code: str

    class Config:
        orm_mode = True  # Tells Pydantic to treat SQLAlchemy models as dictionaries

class LoginRequest(BaseModel):
    email: str
    password: str