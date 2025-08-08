# app/services/user.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.database import get_db
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException


async def create_user(db: AsyncSession, user_create: UserCreate) -> UserResponse:
    """
    Service function to create a new user in the database.

    :param db: Database session object.
    :param user_create: The data to create a new user.
    :return: The created user data as a UserResponse.
    """
    # Check if user already exists
    async with db.begin():
        result = await db.execute(select(User).filter(User.email == user_create.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email is already registered.")

        # Create new user
        new_user = User(
            full_name=user_create.full_name,
            email=user_create.email,
            password=user_create.password,  # Note: Hash the password in a real application
            phone=user_create.phone,
            country_code=user_create.country_code
        )

        db.add(new_user)
        await db.commit()

        # Return the user data as a response
        return UserResponse(
            id=new_user.id,
            full_name=new_user.full_name,
            email=new_user.email,
            phone=new_user.phone,
            country_code=new_user.country_code
        )
