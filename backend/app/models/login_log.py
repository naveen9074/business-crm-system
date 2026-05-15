"""
LoginLog model — tracks user login/logout sessions.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, func
from app.database import Base


class LoginLog(Base):
    __tablename__ = "login_logs"

    login_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    username = Column(String(50), nullable=False)
    role = Column(Enum("admin", "manager", "employee", name="log_role"), nullable=False)
    login_time = Column(DateTime, server_default=func.now())
    logout_time = Column(DateTime, nullable=True)
    status = Column(
        Enum("logged_in", "logged_out", name="login_status"),
        default="logged_in",
        server_default="logged_in",
    )
    created_at = Column(DateTime, server_default=func.now())
