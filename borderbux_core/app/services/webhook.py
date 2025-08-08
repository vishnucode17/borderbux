from app.utils.api_utils import post
from app.constants.utils import *
from fastapi import HTTPException
import logging

# Logger setup
logger = logging.getLogger(__name__)

async def set_webhook_url(webhook_url: str):
    try:
        # Prepare the payload for setting the webhook URL
        api_payload = {
            "webhookUrl": webhook_url
        }

        # Send the POST request to set the webhook URL
        response = await post(ONRAMP_SET_WEBHOOK_URL, api_payload)

        if response.get('status') == 200:
            # Log and return the success message
            logger.info(f"Webhook URL set to {response['data']}")
            return {"message": f"Webhook URL set to {response['data']}"}
        else:
            logger.error(f"Failed to set webhook URL: {response}")
            raise HTTPException(status_code=500, detail="Failed to set/update webhook URL")
    except Exception as e:
        logger.error(f"Error occurred while setting webhook URL: {e}")
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")
