from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.institution import Institution
from schemas.institution import InstitutionCreate, InstitutionResponse
from typing import List

router = APIRouter(
    prefix="/institutions",
    tags=["institutions"]
)

@router.post("/", response_model=InstitutionResponse)
def create_institution(institution: InstitutionCreate, db: Session = Depends(get_db)):
    db_institution = Institution(**institution.dict())
    db.add(db_institution)
    db.commit()
    db.refresh(db_institution)
    return db_institution

@router.get("/", response_model=List[InstitutionResponse])
def get_institutions(db: Session = Depends(get_db)):
    return db.query(Institution).all()

@router.get("/{institution_id}", response_model=InstitutionResponse)
def get_institution(institution_id: int, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution

@router.put("/{institution_id}", response_model=InstitutionResponse)
def update_institution(institution_id: int, updated: InstitutionCreate, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    for key, value in updated.dict().items():
        setattr(institution, key, value)
    db.commit()
    db.refresh(institution)
    return institution
