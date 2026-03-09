from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/templates", tags=["templates"])


# --------------------------------------------------
#   GET ALL TEMPLATES
# --------------------------------------------------
@router.get("/", response_model=list[schemas.Template])
def get_templates(db: Session = Depends(get_db)):
    return crud.get_templates(db)


# --------------------------------------------------
#   CREATE TEMPLATE
# --------------------------------------------------
@router.post("/", response_model=schemas.Template)
def create_template(data: schemas.TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db, data)


# --------------------------------------------------
#   UPDATE TEMPLATE
# --------------------------------------------------
@router.put("/{template_id}", response_model=schemas.Template)
def update_template(template_id: int, data: dict, db: Session = Depends(get_db)):
    updated = crud.update_template(db, template_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Template not found")
    return updated


# --------------------------------------------------
#   DELETE TEMPLATE
# --------------------------------------------------
@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_template(db, template_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Template not found")
    return deleted


# --------------------------------------------------
#   GET TEMPLATE PORTS
# --------------------------------------------------
@router.get("/{template_id}/ports", response_model=list[schemas.TemplatePort])
def get_template_ports(template_id: int, db: Session = Depends(get_db)):
    return crud.get_template_ports(db, template_id)


# --------------------------------------------------
#   ADD PORT TO TEMPLATE
# --------------------------------------------------
@router.post("/{template_id}/ports", response_model=schemas.TemplatePort)
def add_template_port(
    template_id: int,
    data: schemas.TemplatePortCreate,
    db: Session = Depends(get_db),
):
    return crud.create_template_port(db, template_id, data)


# --------------------------------------------------
#   INSTANTIATE TEMPLATE → CREATE DEVICE + PORTS
# --------------------------------------------------
@router.post("/{template_id}/instantiate", response_model=schemas.Device)
def instantiate_template(template_id: int, db: Session = Depends(get_db)):
    device = crud.instantiate_template(db, template_id)
    if not device:
        raise HTTPException(status_code=404, detail="Template not found")
    return device
