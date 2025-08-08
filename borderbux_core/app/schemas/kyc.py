from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from enum import Enum


# Enum for KYC Status
class KYCStatus(str, Enum):
    pending = 'pending'
    TEMPORARY_FAILED = "TEMPORARY_FAILED"
    PERMANENT_FAILED = "PERMANENT_FAILED"
    BASIC_KYC_COMPLETED = "BASIC_KYC_COMPLETED"
    IN_REVIEW = "IN_REVIEW"
    COMPLETED = "COMPLETED"


# KYC Base Model
class KYCBase(BaseModel):
    status: Optional[KYCStatus] = KYCStatus.pending


# Create KYC Model
class KYCCreate(KYCBase):
    customer_id: str  # Added customer_id field


# Response KYC Model
class KYCResponse(KYCBase):
    id: UUID
    user_id: UUID
    customer_id: str
    kyc_url: str

    class Config:
        orm_mode = True

class KYCStatusData(BaseModel):
    status: str
    countryISO: str
    currentKycVerificationStep: str
    previousSuccessfulKycStep: str

class KYCStatusResponse(BaseModel):
    status: int
    code: int
    data: KYCStatusData

    class Config:
        orm_mode = True