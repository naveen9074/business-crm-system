"""
Delivery model — updated by Employee, viewed by Manager.
"""
from sqlalchemy import Column, Integer, Enum, DateTime, Date, Text, ForeignKey, func
from app.database import Base


class Delivery(Base):
    __tablename__ = "delivery"

    delivery_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    cust_id = Column(Integer, ForeignKey("customers.cust_id"), nullable=False)
    delivery_address = Column(Text, nullable=True)
    delivery_date = Column(Date, nullable=True)
    delivery_status = Column(
        Enum("pending", "in_transit", "delivered", "failed", name="delivery_status"),
        default="pending",
        server_default="pending",
    )
    updated_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
