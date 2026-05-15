"""
Customer model — managed by Manager, viewed by Employee and Admin.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, ForeignKey, func
from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    cust_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    organization_name = Column(String(150), nullable=True)
    customer_type = Column(String(50), nullable=True)  # Individual, Corporate, Wholesale
    added_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    status = Column(
        Enum("active", "inactive", name="customer_status"),
        default="active",
        server_default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
