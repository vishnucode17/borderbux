from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.transaction import QuoteResponse, QuoteRequest, Fee
from app.core.security import get_current_user, TokenData
from app.services.kyc import get_customer_id
from sqlalchemy.future import select
from app.schemas.transaction import CreateTransactionRequest, CreateTransactionResponse, AddBankResponse
from app.utils.api_utils import post, get
from app.services.kyc import create_kyc  # Importing the service function
import logging
from app.constants.transaction import *
from dotenv import load_dotenv
from app.services.webhook import set_webhook_url
import os
from httpx import AsyncClient

load_dotenv()
router = APIRouter()

# Logger setup
logger = logging.getLogger(__name__)

# Route to get the quote
@router.post("/get-quote", response_model=QuoteResponse)
async def get_quote(quote_request: QuoteRequest, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to get a quote for a given currency conversion based on provided data.
    """
    # Assuming you have a function `post` to make external API requests
    try:
        # Prepare the payload for the Onramp API
        api_url = ONRAMP_QUOTE_URL if quote_request.transactionType == 'onramp' else OFFRAMP_QUOTE_URL
        api_payload = {
            "fromCurrency": quote_request.fromCurrency,
            "toCurrency": quote_request.toCurrency,
            "fromAmount": quote_request.fromAmount,
            "chain": quote_request.chain,
            "paymentMethodType": quote_request.paymentMethodType,
        }
    
        # Make the POST request to fetch the quote
        response = await post(api_url, api_payload)
        print(response)
        # Check if the response was successful
        if response.get("status") == 200:
            data = response.get("data")['data']
            # Parse the response data into the QuoteResponse model
            quote_response = QuoteResponse(
                fromCurrency=data["fromCurrency"],
                toCurrency=data["toCurrency"],
                fromAmount=data["fromAmount"],
                toAmount=data["toAmount"],
                fees=[Fee(**fee) for fee in data["fees"]],
                rate=data["rate"]
            )
            return quote_response
        else:
            raise HTTPException(status_code=500, detail="Failed to retrieve quote data")

    except Exception as e:
        logger.error(f"Error occurred while fetching quote: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Route to create a transaction and set the webhook URL
@router.post("/create-transaction", response_model=CreateTransactionResponse)
async def create_transaction(transaction_request: CreateTransactionRequest, db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to create a transaction based on the provided currency details.
    After the transaction is created, we update the webhook URL.
    """
    try:
        # Prepare the payload for the Onramp API
        api_url = ONRAMP_CREATE_TRANSACTION_URL if transaction_request.transactionType == 'onramp' else OFFRAMP_CREATE_TRANSACTION_URL
        customer_id = await get_customer_id(db, current_user.id)
        
        # Build the API request payload for Onramp
        api_payload = {
            "fromCurrency": transaction_request.fromCurrency,
            "toCurrency": transaction_request.toCurrency,
            "fromAmount": transaction_request.fromAmount,
            "chain": transaction_request.chain,
            "paymentMethodType": transaction_request.paymentMethodType,
            "depositAddress": os.getenv('WALLET_ADDRESS'),  # This field should come from front-end or environment
            "customerId": customer_id,
            "toAmount": transaction_request.toAmount,
            "rate": transaction_request.rate,
        }
        print(api_payload)
        # Send the POST request to create the transaction with Onramp
        # async with AsyncClient() as client:
        response = await post(api_url, api_payload)
            # response_data = response.json()
        print(response)
        # Check if response was successful
        if response.get('status') == 200:
            data = response.get("data")['data']
            transaction_id = data.get("transactionId")  # Transaction ID from response
            print(data)
            if not transaction_id:
                raise HTTPException(status_code=400, detail="Transaction ID not returned by Onramp")

            # Step 2: Set the Webhook URL after transaction creation
            webhook_url = os.getenv('WEBHOOK_URL')  # Set this dynamically if needed
            webhook_response = await set_webhook_url(webhook_url)
            print(".............")
            print(data)
            # Prepare the transaction response model to send to the client
            create_transaction_response = CreateTransactionResponse(
                transactionId=data['transactionId'],
                createdAt=data['createdAt']
                # fromCurrency=data["fromCurrency"],
                # toCurrency=data["toCurrency"],
                # fromAmount=data["fromAmount"],
                # toAmount=data["toAmount"],
                # fees=[Fee(**fee) for fee in data.get("fees", [])]  # Adjust if fees are returned differently
            )
            return create_transaction_response
        else:
            # If API call was not successful, raise HTTP exception
            logger.error(f"Failed to create transaction: {response}")
            raise HTTPException(status_code=500, detail="Failed to create transaction with Onramp")
    except Exception as e:
        logger.error(f"Error occurred while creating transaction: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Route to create a transaction
@router.post("/add-bank", response_model=AddBankResponse)
async def add_bank(db: AsyncSession = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    """
    Endpoint to create a transaction based on the provided currency details.
    """
    try:
        # Prepare the payload for the Onramp API
        customer_id = await get_customer_id(db, current_user.id)
        print(customer_id)
        api_payload = {
            "customerId": customer_id,
            "redirectUrl": "https://borderbux.com/"
        }
        print("???????????????????")
        print(api_payload)
        print(ADD_BANK_URL)
        # Send the POST request to create the transaction
        response = await post(ADD_BANK_URL, api_payload)
        print(response)
        # Check if the response was successful
        if response.get("status") == 200:
            data = response.get("data")['data']
            # Assuming the Onramp response will include transaction details
            create_transaction_response = AddBankResponse(
                bankUrl = data['bankUrl'],
                referenceId = data['referenceId']
            )
            return create_transaction_response
        else:
            raise HTTPException(status_code=500, detail="Failed to add bank account")

    except Exception as e:
        logger.error(f"Error occurred while adding bank: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

