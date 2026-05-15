"""
Product model — added by Employee, viewed by Manager.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, Numeric, ForeignKey, func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False, default=0)
    sup_id = Column(Integer, ForeignKey("suppliers.sup_id"), nullable=True)
    status = Column(
        Enum("active", "inactive", name="product_status"),
        default="active",
        server_default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
