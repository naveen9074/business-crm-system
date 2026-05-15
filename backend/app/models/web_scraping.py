"""
Web scraping models — preferences set by Employee, results stored by system.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, ForeignKey, func
from app.database import Base


class WebScrapingPreference(Base):
    __tablename__ = "web_scraping_preferences"

    preference_id = Column(Integer, primary_key=True, autoincrement=True)
    emp_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    website_url = Column(String(500), nullable=False)
    keyword = Column(String(200), nullable=False)
    category = Column(String(100), nullable=True)  # product, tender, quotation
    preference_status = Column(
        Enum("active", "inactive", name="preference_status"),
        default="active",
        server_default="active",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class ScrapingResult(Base):
    __tablename__ = "scraping_results"

    result_id = Column(Integer, primary_key=True, autoincrement=True)
    preference_id = Column(Integer, ForeignKey("web_scraping_preferences.preference_id"), nullable=False)
    title = Column(String(300), nullable=True)
    source_url = Column(String(500), nullable=True)
    extracted_message = Column(Text, nullable=True)
    scraped_date = Column(DateTime, server_default=func.now())
    result_status = Column(
        Enum("pending", "processed", name="result_status"),
        default="pending",
        server_default="pending",
    )
    created_at = Column(DateTime, server_default=func.now())
