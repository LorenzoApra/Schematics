from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[schemas.Category])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.post("", response_model=schemas.Category)
def create_category(data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    c = models.Category(name=data.name)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c
