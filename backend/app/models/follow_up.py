"""
FollowUp model — managed by Employee, viewed by Manager.
"""
from sqlalchemy import Column, Integer, Enum, DateTime, Date, Text, Boolean, ForeignKey, func
from app.database import Base


class FollowUp(Base):
    __tablename__ = "follow_ups"

    followup_id = Column(Integer, primary_key=True, autoincrement=True)
    cust_id = Column(Integer, ForeignKey("customers.cust_id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    follow_up_date = Column(Date, nullable=False)
    follow_up_note = Column(Text, nullable=True)
    status = Column(
        Enum("pending", "completed", "in_progress", name="followup_status"),
        default="pending",
        server_default="pending",
    )
    alert_follow_up = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
