# app/models/user.py

from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Store hashed password
    phone = Column(String)
    country_code = Column(String)
    role = Column(String, default="user")  # Added role field (e.g., 'admin' or 'user')

    def __repr__(self):
        return f"<User(id={self.id}, full_name={self.full_name}, email={self.email})>"
