import os
from dotenv import load_dotenv

load_dotenv()

if os.getenv('ENV') == 'TEST':
    KYC_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/kyc/url"
    KYC_STATUS = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/kyc/status"
else:    
    KYC_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/kyc/url"
    KYC_STATUS = r"https://api.onramp.money/onramp/api/v2/whiteLabel/kyc/status"

