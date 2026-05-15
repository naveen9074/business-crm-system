"""
Application configuration loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Business CRM System"
    DEBUG: bool = True
    SECRET_KEY: str = "supersecretkey-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    # Database (MySQL)
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/crms"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
