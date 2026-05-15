"""
Order model — created by Employee, viewed by Manager.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Date, ForeignKey, func
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, autoincrement=True)
    cust_id = Column(Integer, ForeignKey("customers.cust_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    sup_id = Column(Integer, ForeignKey("suppliers.sup_id"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    order_date = Column(Date, nullable=True)
    order_status = Column(
        Enum("pending", "confirmed", "shipped", "delivered", "cancelled", name="order_status"),
        default="pending",
        server_default="pending",
    )
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
