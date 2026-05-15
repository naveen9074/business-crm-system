"""
Payment model — viewed by Admin and Manager.
"""
from sqlalchemy import Column, Integer, Enum, DateTime, Date, Numeric, ForeignKey, func
from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    inv_id = Column(Integer, ForeignKey("invoices.inv_id", use_alter=True, name="fk_payment_invoice"), nullable=True)
    cust_id = Column(Integer, ForeignKey("customers.cust_id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False, default=0)
    payment_method = Column(
        Enum("cash", "credit_card", "bank_transfer", "cheque", name="payment_method"),
        nullable=True,
    )
    payment_status = Column(
        Enum("pending", "completed", "failed", "refunded", name="payment_status"),
        default="pending",
        server_default="pending",
    )
    payment_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
