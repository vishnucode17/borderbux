# app/api/v1/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.schemas.user import LoginRequest
from app.core.security import verify_password, create_access_token
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

router = APIRouter()


@router.post("/login")
async def login_for_access_token(login_request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to authenticate the user and return an access token.
    """
    # Fetch user from the database using email
    email = login_request.email
    password = login_request.password
    print(email,password)
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Generate the JWT token for the authenticated user
    access_token = create_access_token(data={"id": str(user.id), "email": user.email})

    return {"access_token": access_token, "token_type": "bearer"}
