import os
from dotenv import load_dotenv

load_dotenv()

if os.getenv('ENV') == 'TEST':
    OFFRAMP_QUOTE_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/offramp/quote"
    ONRAMP_QUOTE_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/onramp/quote"
    ONRAMP_CREATE_TRANSACTION_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/onramp/createTransaction"
    OFFRAMP_CREATE_TRANSACTION_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/offramp/createTransaction"
    GET_TRANSACTION_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/onramp/transaction"
    ADD_BANK_URL = r"https://api-test.onramp.money/onramp/api/v2/whiteLabel/bank/addFiatAccountUrl"
else:    
    OFFRAMP_QUOTE_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/quote"
    ONRAMP_QUOTE_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/quote"
    ONRAMP_CREATE_TRANSACTION_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/createTransaction"
    OFFRAMP_CREATE_TRANSACTION_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/createTransaction"
    GET_TRANSACTION_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/transaction"
    ADD_BANK_URL = r"https://api.onramp.money/onramp/api/v2/whiteLabel/bank/addFiatAccountUrl"
