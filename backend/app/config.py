from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./pos_local.db"
    JWT_SECRET: str = "tamil_dress_pos_default_secret_key_2026"
    ALLOW_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOW_ORIGINS.split(",") if origin.strip()]

settings = Settings()
