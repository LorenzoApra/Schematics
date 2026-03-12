from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import database, models, schemas

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Category])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.post("/", response_model=schemas.Category)
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_cat = models.Category(name=cat.name, color=cat.color)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@router.put("/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = cat.name
    category.color = cat.color

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"ok": True}
