"""
Supplier model — managed by Admin.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, func
from app.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    sup_id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    company_name = Column(String(150), nullable=True)
    status = Column(
        Enum("active", "inactive", name="supplier_status"),
        default="active",
        server_default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
