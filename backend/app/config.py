from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parent.parent / '.env'

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), env_file_encoding='utf-8', extra='ignore')

    DATABASE_URL: str = 'sqlite+aiosqlite:///./duolingo.db'
    GROQ_API_KEY: str = ''
    AI_MODEL: str = 'groq/compound-mini'
    AI_PROVIDER: str = 'groq'
    CORS_ORIGINS: str = '*'

settings = Settings()
