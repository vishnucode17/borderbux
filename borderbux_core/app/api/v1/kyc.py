from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.kyc import KYC
from app.models.user import User
from app.schemas.kyc import KYCCreate, KYCResponse, KYCStatusResponse
from uuid import UUID
from app.core.security import get_current_user, TokenData
from sqlalchemy.future import select
from app.schemas.kyc import KYCStatus
from app.utils.api_utils import post, get
from app.services.kyc import create_kyc  # Importing the service function
import logging
from app.constants.kyc import *

router = APIRouter()

# Logger setup
logger = logging.getLogger(__name__)

# Create a new KYC submission
@router.post("/", response_model=KYCResponse)
async def create_kyc_endpoint(kyc_create: KYCCreate, db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to submit KYC details for the authenticated user.
    """
    try:
        # Use the service function to create KYC
        new_kyc = await create_kyc(db, kyc_create, current_user.id)
        return new_kyc
    except HTTPException as e:
        raise e

# Get KYC details for the current user
@router.get("/", response_model=KYCResponse)
async def get_kyc(db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to retrieve KYC details for the authenticated user.
    """
    result = await db.execute(select(KYC).filter(KYC.user_id == current_user.id))
    kyc = result.scalars().first()

    if not kyc:
        # Fetch user details
        user_details = await db.execute(select(User).filter(User.id == current_user.id))
        user = user_details.scalars().first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"User details: {user}")

        gen_kyc_url = KYC_URL
        apiparams = {
            "phoneNumber": f'{user.country_code}-{user.phone}',
            "clientCustomerId": str(user.id),
            "type": "INDIVIDUAL",
            "closeAfterLogin":"true",
            "kycRedirectUrl": "https://borderbux.com/"
        }
        
        response_object = await post(gen_kyc_url, apiparams)
        print(response_object)
        # if response_object['status'] == 200 or response_object['status'] == 201:
        if response_object['data']:
            data = response_object['data']
            logger.info(f"KYC data received: {data}")
            # Store generated KYC data
            if data.get('customerId'):
                kyc_url=data.get('kycUrl')
                customer_id=data.get('customerId')
                apiparams = {
                    "phoneNumber": f'{user.country_code}-{user.phone}',
                    "clientCustomerId": str(user.id),
                    "type": "INDIVIDUAL",
                    "customerId":customer_id,
                    "closeAfterLogin":"true",
                    "kycRedirectUrl": "https://borderbux.com/"
                }
                response_object = await post(gen_kyc_url, apiparams)
                data = response_object['data']
                # print("***************************")
                # print(data)
                # print(data.get('data')['kycUrl'])
                # print(kyc_url)
                # print(customer_id)
                # print("-------------------------")
                new_kyc = KYC(user_id=user.id, kyc_url=data.get('data')['kycUrl'], customer_id=customer_id)
            else:
                kyc_url=data.get('data')['kycUrl']
                customer_id=data.get('data')['customerId']
                new_kyc = KYC(user_id=user.id, kyc_url=kyc_url, customer_id=customer_id)
            db.add(new_kyc)
            await db.commit()
            await db.refresh(new_kyc)

            return new_kyc

        else:
            raise HTTPException(status_code=500, detail="Failed to generate KYC")

    return kyc

# Update KYC status (admin or verification team)
@router.put("/{kyc_id}", response_model=KYCResponse)
async def update_kyc_status(kyc_id: UUID, status: KYCStatus, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to update the KYC status (e.g., from pending to approved).
    """
    result = await db.execute(select(KYC).filter(KYC.id == kyc_id))
    kyc = result.scalars().first()

    if not kyc:
        raise HTTPException(status_code=404, detail="KYC not found")

    kyc.status = status
    await db.commit()
    await db.refresh(kyc)

    return kyc

# Bypass KYC Status update (admin or verification team)
@router.post("/bypass-kyc", response_model=KYCResponse)
async def bypass_kyc_status( db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to bypass or update the KYC status for the current logged-in user.
    """
    # Fetch the KYC record for the current logged-in user
    print(r"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    result = await db.execute(select(KYC).filter(KYC.user_id == current_user.id))
    kyc = result.scalars().first()
    print(kyc)
    if not kyc:
        raise HTTPException(status_code=404, detail="KYC record not found for this user.")

    # API parameters to update KYC status
    change_status_url = "https://api-test.onramp.money/onramp/api/v2/whiteLabel/test/changeKycStatus"
    apiparams = {
        "customerId": kyc.customer_id,  # Use the customerId from the KYC record
        "status": 'ADVANCE_KYC_COMPLETED'  # The new KYC status (e.g., 'BASIC_KYC_COMPLETED', 'IN_REVIEW', etc.)
    }
    print(apiparams)
    try:
        # Make the API request to change the KYC status
        response_object = await post(change_status_url, apiparams)

        # Check if the response is successful and contains the necessary data
        if response_object.get("status") == 1 and response_object.get("code") == 200:
            data = response_object.get("data")
            if data and data.get("changeStatus"):
                # If the status change is successful, update the local database KYC status
                kyc.status = "COMPLETED"
                await db.commit()
                await db.refresh(kyc)

                logger.info(f"KYC status for user {current_user.id} updated to ")
                return kyc
            else:
                raise HTTPException(status_code=500, detail="Failed to change KYC status via external API.")
        else:
            raise HTTPException(status_code=500, detail="External API failed to change KYC status.")
    
    except Exception as e:
        logger.error(f"Error while bypassing KYC status for user {current_user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while bypassing KYC status.")
    
@router.get("/status", response_model=KYCStatusResponse)
async def get_kyc_status(db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to get the current KYC status of the authenticated user.
    This status is fetched from an external KYC service.
    """
    # Fetch the KYC record for the current logged-in user
    result = await db.execute(select(KYC).filter(KYC.user_id == current_user.id))
    kyc = result.scalars().first()

    if not kyc:
        raise HTTPException(status_code=404, detail="KYC not found for this user.")

    # Prepare the API parameters
    kyc_status_url = KYC_STATUS
    apiparams = {
        "customerId": kyc.customer_id  # Use the customerId from the KYC record
    }

    try:
        # Call the external API to get the KYC status
        response_object = await post(kyc_status_url, apiparams)
        print(response_object)
        if response_object.get("status") != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch KYC status from external API.")

        # Return the KYC status response
        return response_object

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Internal server error while fetching KYC status.")