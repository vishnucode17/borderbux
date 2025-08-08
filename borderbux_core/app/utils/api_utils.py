import httpx
from app.utils.generateHeader import generate_payload_and_signature
from dotenv import load_dotenv
import os

load_dotenv()

# Asynchronous POST request
async def post(url, parms):
    try:
        data = generate_payload_and_signature(os.getenv('API_SECRET'), parms)
        headers = {
            'Content-Type': 'application/json',
            'apikey': os.getenv("API_KEY"),
            'payload': data['payload'],
            'signature': data['signature']
        }
        
        # Send asynchronous POST request with JSON payload and headers
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=parms, headers=headers)
            print('---------')
            print(response)
        
        # Return the status code and the response data as a dictionary
        return {"status": response.status_code, "data": response.json()}
    
    except httpx.RequestError as error:
        # Handle any exceptions (e.g., network issues, invalid URLs, etc.)
        return {"status": 500, "data": {"error": str(error)}}

# Asynchronous GET request
async def get(url, params=None, headers=None):
    try:
        # Send asynchronous GET request with optional query parameters and headers
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
        
        # Return the status code and the response data as a dictionary
        return {"status": response.status_code, "data": response.json()}
    
    except httpx.RequestError as error:
        # Handle any exceptions (e.g., network issues, invalid URLs, etc.)
        return {"status": 500, "data": {"error": str(error)}}
