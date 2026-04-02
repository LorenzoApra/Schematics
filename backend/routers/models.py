from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/models", tags=["models"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[schemas.DeviceModel])
def list_models(db: Session = Depends(get_db)):
    return db.query(models.DeviceModel).all()


@router.get("/{model_id}", response_model=schemas.DeviceModel)
def get_model(model_id: int, db: Session = Depends(get_db)):
    m = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")
    return m


@router.post("", response_model=schemas.DeviceModel)
def create_model(data: schemas.DeviceModelCreate, db: Session = Depends(get_db)):
    m = models.DeviceModel(
        name=data.name,
        category_id=data.category_id,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@router.put("/{model_id}", response_model=schemas.DeviceModel)
def update_model(model_id: int, data: schemas.DeviceModelUpdate, db: Session = Depends(get_db)):
    m = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")
    m.name = data.name
    m.category_id = data.category_id
    db.commit()
    db.refresh(m)
    return m


@router.delete("/{model_id}")
def delete_model(model_id: int, db: Session = Depends(get_db)):
    m = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(m)
    db.commit()
    return {"status": "ok"}


# ---------- MODEL PORTS ----------

@router.post("/{model_id}/ports", response_model=schemas.ModelPort)
def create_model_port(model_id: int, data: schemas.ModelPortCreate, db: Session = Depends(get_db)):
    m = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")

    p = models.ModelPort(
        name=data.name,
        type=data.type,
        direction=data.direction,
        model_id=model_id,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.put("/ports/{port_id}", response_model=schemas.ModelPort)
def update_model_port(port_id: int, data: schemas.ModelPortCreate, db: Session = Depends(get_db)):
    p = db.query(models.ModelPort).filter(models.ModelPort.id == port_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Model port not found")

    p.name = data.name
    p.type = data.type
    p.direction = data.direction
    db.commit()
    db.refresh(p)
    return p


@router.delete("/ports/{port_id}")
def delete_model_port(port_id: int, db: Session = Depends(get_db)):
    p = db.query(models.ModelPort).filter(models.ModelPort.id == port_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Model port not found")
    db.delete(p)
    db.commit()
    return {"status": "ok"}
