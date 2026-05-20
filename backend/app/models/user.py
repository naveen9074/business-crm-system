"""
User model — stores admin, manager, and employee accounts.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("admin", "manager", "employee", name="user_role"), nullable=False)
    phone = Column(String(20), nullable=True)
    status = Column(
        Enum("active", "inactive", "deactivated", "pending", "rejected", name="user_status"),
        default="active",
        server_default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
