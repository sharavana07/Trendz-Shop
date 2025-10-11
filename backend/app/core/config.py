# backend/app/core/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    
    class Config:
        env_file = ".env"
        

settings = Settings()
# You can access settings like this:
# settings.DATABASE_URL # Example usage
print("DATABASE_URL:", settings.DATABASE_URL)
