# app/core/database.py

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Replace with your actual database URL
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:admin@localhost/borderbux"

# Create async engine for PostgreSQL
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True, future=True)

# Async sessionmaker
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        db.close()
