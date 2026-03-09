from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, database

router = APIRouter(prefix="/device-models", tags=["device_models"])


# ------------------------------------------------------------
# DB dependency
# ------------------------------------------------------------
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------------------------------------
# Helper: get category color (fallback to id=1000)
# ------------------------------------------------------------
def _get_category_color(db: Session, category_id: Optional[int]) -> str:
    # 1) Try category color
    if category_id is not None:
        cat = crud.get_category(db, category_id)
        if cat and cat.color:
            return cat.color

    # 2) Try fallback category
    fallback = crud.get_category(db, 1000)
    if fallback and fallback.color:
        return fallback.color

    # 3) Safe default
    return "#cccccc"


# ------------------------------------------------------------
# DEVICE MODEL CRUD
# ------------------------------------------------------------

@router.get("/", response_model=List[schemas.DeviceModel])
def list_device_models(db: Session = Depends(get_db)):
    return crud.get_device_models(db)


@router.post("/", response_model=schemas.DeviceModel)
def create_device_model(model_in: schemas.DeviceModelCreate, db: Session = Depends(get_db)):
    return crud.create_device_model(db, model_in)


@router.put("/{model_id}", response_model=schemas.DeviceModel)
def update_device_model(model_id: int, model_in: schemas.DeviceModelUpdate, db: Session = Depends(get_db)):
    updated = crud.update_device_model(db, model_id, model_in)
    if not updated:
        raise HTTPException(status_code=404, detail="DeviceModel not found")
    return updated


@router.delete("/{model_id}", response_model=dict)
def delete_device_model(model_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_device_model(db, model_id)
    if not ok:
        raise HTTPException(status_code=404, detail="DeviceModel not found")
    return {"ok": True}


# ------------------------------------------------------------
# MODEL PORT CRUD
# ------------------------------------------------------------

@router.get("/{model_id}/ports", response_model=List[schemas.ModelPort])
def list_model_ports(model_id: int, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="DeviceModel not found")
    return crud.get_model_ports(db, model_id)


@router.post("/{model_id}/ports", response_model=schemas.ModelPort)
def create_model_port(model_id: int, port_in: schemas.ModelPortCreate, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="DeviceModel not found")

    existing = crud.get_model_ports(db, model_id)
    if len(existing) >= 30:
        raise HTTPException(status_code=400, detail="Max 30 ports allowed")

    return crud.create_model_port(db, model_id, port_in)


@router.put("/{model_id}/ports/{port_id}", response_model=schemas.ModelPort)
def update_model_port(model_id: int, port_id: int, port_in: schemas.ModelPortUpdate, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="DeviceModel not found")

    port = crud.get_model_port(db, port_id)
    if not port or port.model_id != model_id:
        raise HTTPException(status_code=404, detail="ModelPort not found")

    return crud.update_model_port(db, port_id, port_in)


@router.delete("/{model_id}/ports/{port_id}", response_model=dict)
def delete_model_port(model_id: int, port_id: int, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="DeviceModel not found")

    port = crud.get_model_port(db, port_id)
    if not port or port.model_id != model_id:
        raise HTTPException(status_code=404, detail="ModelPort not found")

    crud.delete_model_port(db, port_id)
    return {"ok": True}


# ------------------------------------------------------------
# INSTANTIATE DEVICE MODEL → CREATE DEVICE INSTANCE
# ------------------------------------------------------------

@router.post("/{model_id}/instantiate", response_model=schemas.Device)
def instantiate_device_model(model_id: int, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="DeviceModel not found")

    # derive color from category
    color = _get_category_color(db, model.category_id)

    # create device instance
    payload = {
        "name": model.name,
        "color": color,
        "model_id": model.id,
        "x": 100,
        "y": 100,
    }

    device = crud.create_device(db, payload)

    # copy model ports → device ports
    model_ports = crud.get_model_ports(db, model.id)
    for mp in model_ports:
        crud.create_device_port(db, device.id, {"name": mp.name, "type": mp.type})

    return device
