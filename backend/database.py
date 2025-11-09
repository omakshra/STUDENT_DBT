import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

USE_SUPABASE = os.getenv("USE_SUPABASE", "False").strip().lower() == "true"

DATABASE_URL = (
    os.getenv("DATABASE_URL") if USE_SUPABASE else "sqlite:///./test.db"
)

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is required when USE_SUPABASE=True")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
