from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# The physical file will be created in the root of the backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./duolingo.db"

# create_engine establishes the core connection to the database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# SessionLocal will be used to create independent database sessions for each web request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models to inherit from
Base = declarative_base()