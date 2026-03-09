from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/categories", tags=["categories"])


# --------------------------------------------------
#   GET ALL CATEGORIES
# --------------------------------------------------
@router.get("/", response_model=list[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


# --------------------------------------------------
#   CREATE CATEGORY
# --------------------------------------------------
@router.post("/", response_model=schemas.Category)
def create_category(data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, data)