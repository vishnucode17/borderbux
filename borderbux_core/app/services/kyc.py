# app/services/kyc.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.kyc import KYC
from app.schemas.kyc import KYCCreate, KYCResponse
from app.core.database import get_db
from fastapi import HTTPException
from uuid import UUID
import logging

# Logger setup
logger = logging.getLogger(__name__)

async def create_kyc(db: AsyncSession, kyc_create: KYCCreate, user_id: UUID) -> KYCResponse:
    """
    Service function to create a new KYC record for the user in the database.

    :param db: Database session object.
    :param kyc_create: The data to create a new KYC record.
    :param user_id: The user ID associated with the KYC record.
    :return: The created KYC data as a KYCResponse.
    """
    # Check if KYC already exists for the user
    async with db.begin():
        result = await db.execute(select(KYC).filter(KYC.user_id == user_id))
        existing_kyc = result.scalars().first()
        if existing_kyc:
            raise HTTPException(status_code=400, detail="KYC already exists for this user.")

        # Create new KYC record
        new_kyc = KYC(
            user_id=user_id,
            customer_id=kyc_create.customer_id,  # Assuming customer_id is passed from the request
            status=kyc_create.status or "pending",  # Default to 'pending' if status is not provided
            kyc_url=kyc_create.kyc_url  # Assuming kyc_url might be passed (optional)
        )

        db.add(new_kyc)
        await db.commit()

        # Return the KYC data as a response
        return KYCResponse(
            id=new_kyc.id,
            user_id=new_kyc.user_id,
            customer_id=new_kyc.customer_id,
            status=new_kyc.status,
            kyc_url=new_kyc.kyc_url
        )


async def get_customer_id(db: AsyncSession, user_id: UUID) -> str:
    """
    Service function to get the customer_id for an existing KYC record.

    :param db: Database session object.
    :param user_id: The user ID associated with the KYC record.
    :return: The customer_id for the user.
    """
    result = await db.execute(select(KYC).filter(KYC.user_id == user_id))
    kyc = result.scalars().first()

    if not kyc:
        raise HTTPException(status_code=404, detail="KYC record not found for this user.")

    logger.info(f"Found customer_id for user {user_id}: {kyc.customer_id}")
    return kyc.customer_id