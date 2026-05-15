"""
Stock model — updated by Employee, viewed by Admin and Manager.
"""
from sqlalchemy import Column, Integer, Enum, DateTime, ForeignKey, func
from app.database import Base


class Stock(Base):
    __tablename__ = "stock"

    stock_id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    quantity_available = Column(Integer, nullable=False, default=0)
    minimum_stock_level = Column(Integer, nullable=False, default=10)
    stock_status = Column(
        Enum("in_stock", "low_stock", "out_of_stock", name="stock_status"),
        default="in_stock",
        server_default="in_stock",
    )
    last_updated_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
