from pydantic import BaseModel, EmailStr
from typing import Optional

class InstitutionBase(BaseModel):
    name: str
    code: str
    district: Optional[str] = None
    panchayat: Optional[str] = None
    contact_person_name: str
    contact_person_mobile: str
    contact_person_email: EmailStr
    total_students: Optional[int] = 0

class InstitutionCreate(InstitutionBase):
    pass

class InstitutionResponse(InstitutionBase):
    id: int

    class Config:
        orm_mode = True
