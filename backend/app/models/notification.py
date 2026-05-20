"""
Notification model — stores manual reminders sent between users/roles.
"""
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey, func
from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=True)
    receiver_role = Column(String(20), nullable=True)   # 'manager' or 'employee' for broadcast
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    module_name = Column(String(100), nullable=True)
    notification_type = Column(
        Enum("reminder", "system", "manual", name="notif_type"),
        default="manual",
        server_default="manual",
    )
    status = Column(
        Enum("unread", "read", name="notif_status"),
        default="unread",
        server_default="unread",
    )
    created_at = Column(DateTime, server_default=func.now())
    read_at = Column(DateTime, nullable=True)
