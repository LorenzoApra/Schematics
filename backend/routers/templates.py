from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, schemas, database

router = APIRouter(prefix="/templates", tags=["templates"])


def get_db():
  db = database.SessionLocal()
  try:
    yield db
  finally:
    db.close()


def _get_category_color(db: Session, category_id: Optional[int]) -> str:
  if category_id is not None:
    cat = crud.get_category(db, category_id)
    if cat and getattr(cat, "color", None):
      return cat.color
  cat1000 = crud.get_category(db, 1000)
  if cat1000 and getattr(cat1000, "color", None):
    return cat1000.color
  return "#cccccc"


@router.get("/", response_model=List[schemas.Template])
def list_templates(db: Session = Depends(get_db)):
  return crud.get_templates(db)


@router.post("/", response_model=schemas.Template)
def create_template(template_in: schemas.TemplateCreate, db: Session = Depends(get_db)):
  return crud.create_template(db, template_in)


@router.put("/{template_id}", response_model=schemas.Template)
def update_template(template_id: int, template_in: schemas.TemplateUpdate, db: Session = Depends(get_db)):
  updated = crud.update_template(db, template_id, template_in)
  if not updated:
    raise HTTPException(status_code=404, detail="Template not found")
  return updated


@router.delete("/{template_id}", response_model=dict)
def delete_template(template_id: int, db: Session = Depends(get_db)):
  ok = crud.delete_template(db, template_id)
  if not ok:
    raise HTTPException(status_code=404, detail="Template not found")
  return {"ok": True}


# ---------- TEMPLATE PORTS ----------

@router.get("/{template_id}/ports", response_model=List[schemas.TemplatePort])
def list_template_ports(template_id: int, db: Session = Depends(get_db)):
  tpl = crud.get_template(db, template_id)
  if not tpl:
    raise HTTPException(status_code=404, detail="Template not found")
  return crud.get_template_ports(db, template_id)


@router.post("/{template_id}/ports", response_model=schemas.TemplatePort)
def create_template_port(template_id: int, port_in: schemas.TemplatePortCreate, db: Session = Depends(get_db)):
  tpl = crud.get_template(db, template_id)
  if not tpl:
    raise HTTPException(status_code=404, detail="Template not found")
  return crud.create_template_port(db, template_id, port_in)


# ---------- INSTANTIATE TEMPLATE ----------

@router.post("/{template_id}/instantiate", response_model=schemas.Device)
def instantiate_template(template_id: int, db: Session = Depends(get_db)):
  tpl = crud.get_template(db, template_id)
  if not tpl:
    raise HTTPException(status_code=404, detail="Template not found")

  color = _get_category_color(db, tpl.category_id)

  payload = {
    "name": tpl.name,
    "color": color,
    "template_id": tpl.id,
    "x": 100,
    "y": 100,
  }

  device = crud.create_device(db, payload)

  template_ports = crud.get_template_ports(db, tpl.id)
  for tp in template_ports:
    crud.create_device_port(db, device.id, {"name": tp.name, "type": tp.type})

  return device
