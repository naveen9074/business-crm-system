"""
AuditLog model — tracks all critical operations across the system.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, func
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    action = Column(String(100), nullable=False)  # CREATED, UPDATED, DELETED, VIEWED
    module_name = Column(String(100), nullable=True)  # Customer, Order, Invoice, etc.
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
