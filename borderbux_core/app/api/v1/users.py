from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.user import create_user
from app.core.security import verify_password, hash_password
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_token, TokenData
from sqlalchemy.future import select
from uuid import UUID
from typing import List

router = APIRouter()

# Dependency to get the current user from the token
def get_current_user(token: str = Depends(verify_token)) -> TokenData:
    return TokenData(**token)

# Create user route (now hashes the password)
@router.post("/", response_model=UserResponse)
async def create_user_route(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to create a new user in the system.
    """
    # Hash the password before saving the user
    user_create.password = hash_password(user_create.password)
    try:
        user_response = await create_user(db=db, user_create=user_create)
        return user_response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get user by ID (password verification not needed, just retrieving data)
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to get user details by user_id.
    """
    if str(user_id) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")

    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get all users (Admin check could be implemented here if needed)
@router.get("/", response_model=List[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to get all users in the system (can be restricted to admin only).
    """
    # Admin check or any authorization logic can go here
    users = await db.execute(select(User))
    users = users.scalars().all()
    return users

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Endpoint to get the current authenticated user.
    """
    return current_user