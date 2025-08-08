import os
from dotenv import load_dotenv

load_dotenv()

if os.getenv('ENV') == 'TEST':
    ONRAMP_SET_WEBHOOK_URL = "https://api-test.onramp.money/onramp/api/v1/merchant/setWebhookUrl"
else:
    ONRAMP_SET_WEBHOOK_URL = "https://api.onramp.money/onramp/api/v1/merchant/setWebhookUrl"
