from sqlalchemy import Column, Integer, String
from database import Base

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)  # Institution Code/ID
    district = Column(String, nullable=True)
    panchayat = Column(String, nullable=True)
    contact_person_name = Column(String, nullable=False)
    contact_person_mobile = Column(String, nullable=False)
    contact_person_email = Column(String, nullable=False)
    total_students = Column(Integer, default=0)