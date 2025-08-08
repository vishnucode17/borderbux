from pydantic import BaseModel, model_validator
from typing import List, Optional
from enum import Enum

# Enum for supported currencies
class CurrencyType(str, Enum):
    INR = "INR"
    AED = "AED"
    EUR = "EUR"
    USD = "USD"
    USDC = "USDC"
    USDT = "USDT"

# Enum for supported payment methods
class PaymentMethodType(str, Enum):
    UPI = "UPI"
    IMPS = "IMPS"
    TRY_BANK_TRANSFER = "TRY_BANK_TRANSFER"
    AED_BANK_TRANSFER = "AED-BANK-TRANSFER"
    SPEI = "SPEI"
    SEPA_BANK_TRANSFER = "SEPA_BANK_TRANSFER"
    IDR_BANK_TRANSFER = "IDR_BANK_TRANSFER"
    ACH = "ACH"

# Enum for transaction type
class TransactionType(str, Enum):
    onramp = "onramp"
    offramp = "offramp"

# Model for Quote request
class QuoteRequest(BaseModel):
    transactionType: TransactionType
    fromCurrency: CurrencyType
    toCurrency: CurrencyType
    fromAmount: str  # Fiat amount for onramp
    chain: str  # Supported chain (e.g., erc20, bep20)
    paymentMethodType: PaymentMethodType  # Payment method type

# Model for the fee structure of the transaction
class Fee(BaseModel):
    type: str
    onrampFee: float
    clientFee: Optional[float] = None
    gatewayFee: float
    gasFee: Optional[float] = None
    tdsFee: Optional[float] = None

    class Config:
        # Exclude fields that are None from the response
        exclude_none = True

# Model for the quote response
class QuoteResponse(BaseModel):
    fromCurrency: CurrencyType
    toCurrency: CurrencyType
    fromAmount: str
    toAmount: float
    fees: List[Fee]
    rate: float

    @model_validator(mode="before")
    def make_currency_case_insensitive(cls, values):
        # Convert fromCurrency and toCurrency to uppercase to ensure case-insensitivity
        values['fromCurrency'] = values.get('fromCurrency', '').upper()
        values['toCurrency'] = values.get('toCurrency', '').upper()
        return values

    class Config:
        orm_mode = True

# Model for the quote request
class CreateTransactionRequest(BaseModel):
    transactionType: TransactionType
    fromCurrency: CurrencyType  # Base currency of the trading pair
    toCurrency: CurrencyType  # Quote currency of the trading pair
    chain: str  # Supported network (e.g., 'bep20', 'erc20')
    paymentMethodType: PaymentMethodType  # Payment method type (e.g., 'UPI', 'IMPS')
    # depositAddress: str  # On-chain destination for coin transfer
    # customerId: str  # Unique customer ID from the KYC URL
    fromAmount: str  # Amount of fiat the user would deposit
    toAmount: str  # Estimated crypto quantity the user will receive
    rate: str  # Expected price estimate from the quote endpoint

    @model_validator(mode="before")
    def make_currency_case_insensitive(cls, values):
        # Ensure currencies are uppercase to handle case-insensitivity
        values['fromCurrency'] = values.get('fromCurrency', '').upper()
        values['toCurrency'] = values.get('toCurrency', '').upper()
        return values

# Model for the response of creating a transaction
class CreateTransactionResponse(BaseModel):
    # fromCurrency: str
    transactionId: str
    createdAt: str
    # fiatAmount: str
    # fiatPaymentInstructions: dict  # Contains instructions for fiat payment
    # bankNotes: List[dict]  # Notes about the bank transfer options
    # otp: str  # OTP for the transaction

    class Config:
        orm_mode = True

class GetTransactionRequest(BaseModel):
    customerId: str
    transactionId: str

# class AddBankRequest(BaseModel):
#     customerId: str
#     redirectURL: str

class AddBankResponse(BaseModel):
    bankUrl: str
    referenceId: str