from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from database import Base

# Feedback table
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    feedback = Column(Text)
    time = Column(TIMESTAMP)

# Users table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    expert_domain = Column(String)

# Database table (main table)
class DatabaseModel(Base):
    __tablename__ = "Database"  # Quoted table name

    id = Column(Integer, primary_key=True, index=True)
    PA_classification = Column("PA classification", Text)
    Sector_Area = Column("Sector/Area", Text)
    Sub_Sector = Column("Sub-Sector", Text)
    Source_name = Column("Source name", Text)
    Description = Column("Description", Text)
    Type = Column("Type (General DB, specialized, ...)", Text)
    Free_Paid = Column("Free/Paid?", Text)
    Geography = Column("Geography", Text)
    Regional_data = Column("Regional data", Text)
    Country_data = Column("Country data", Text)
    Frequency = Column("Frequency", Text)
    Years = Column("Years", Text)
    Latest_year_available = Column("Latest year available", Text)
    Forecasts = Column("Forecasts?", Text)
    Latest_forecast_year_available = Column("Latest forecast year avalable", Text)
    Tags = Column("Tags", Text)
    Format = Column("Format", Text)
    Expert_opinion = Column("Expert opinion", Text)
    Submitter_email = Column("Submitter_email", Text)
    Submitter_role = Column("Submitter_role", Text)
    Status = Column("Status", Text)
    Reliability_Score = Column("Reliability Score (1-10)", Integer)
    Link = Column("Link", Text)
