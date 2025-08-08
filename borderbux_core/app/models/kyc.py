from sqlalchemy import Column, String, Text, Enum
from sqlalchemy.dialects.postgresql import UUID  # Import from PostgreSQL dialect
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4  # You can also use uuid4() for generating UUIDs
import enum

Base = declarative_base()

class KYCStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class KYC(Base):
    __tablename__ = 'kyc'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)  # Updated
    user_id = Column(UUID(as_uuid=True), nullable=False)  # Updated
    customer_id = Column(String, nullable=False)
    # full_name = Column(String, nullable=True)
    # date_of_birth = Column(String, nullable=True)
    # address = Column(Text, nullable=True)
    # government_id_type = Column(String, nullable=True)
    # government_id_number = Column(String, nullable=True)
    status = Column(Enum(KYCStatus), default=KYCStatus.pending)
    kyc_url = Column(Text, nullable=True)

    # Add any additional fields as required
