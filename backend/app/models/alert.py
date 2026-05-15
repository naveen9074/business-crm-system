"""
Alert model — created from scraping results, verified by Employee, viewed by Manager.
"""
from sqlalchemy import Column, Integer, Enum, DateTime, Text, Boolean, ForeignKey, func
from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    preference_id = Column(Integer, ForeignKey("web_scraping_preferences.preference_id"), nullable=True)
    result_id = Column(Integer, ForeignKey("scraping_results.result_id"), nullable=True)
    message = Column(Text, nullable=True)
    alert_status = Column(
        Enum("pending", "verified", "rejected", "forwarded", name="alert_status"),
        default="pending",
        server_default="pending",
    )
    verified_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    forwarded_to_manager = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
