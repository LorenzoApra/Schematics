from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas, database

router = APIRouter(prefix="/devices", tags=["devices"])


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
def _get_category_color(db: Session, model_id: Optional[int]) -> str:
    if model_id is not None:
        model = crud.get_device_model(db, model_id)
        if model and model.category_id:
            cat = crud.get_category(db, model.category_id)
            if cat and getattr(cat, "color", None):
                return cat.color

    fallback = crud.get_category(db, 1000)
    if fallback and getattr(fallback, "color", None):
        return fallback.color

    return "#cccccc"


# ------------------------------------------------------------
# DEVICE CRUD
# ------------------------------------------------------------

@router.get("/", response_model=List[schemas.Device])
def list_devices(db: Session = Depends(get_db)):
    return crud.get_devices(db)


@router.post("/", response_model=schemas.Device)
def create_device(device_in: schemas.DeviceCreate, db: Session = Depends(get_db)):
    # derive color if not provided
    color = device_in.color
    if not color:
        color = _get_category_color(db, device_in.model_id)

    payload = device_in.dict()
    payload["color"] = color

    created = crud.create_device(db, payload)
    return created


@router.get("/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    return dev


@router.put("/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, device_in: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    updated = crud.update_device(db, device_id, device_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated


@router.delete("/{device_id}", response_model=dict)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_device(db, device_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"ok": True}


# ------------------------------------------------------------
# DEVICE PORT CRUD
# ------------------------------------------------------------

@router.get("/{device_id}/ports", response_model=List[schemas.DevicePort])
def list_device_ports(device_id: int, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    return crud.get_device_ports(db, device_id)


@router.post("/{device_id}/ports", response_model=schemas.DevicePort)
def create_device_port(device_id: int, port_in: schemas.DevicePortCreate, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")

    existing = crud.get_device_ports(db, device_id)
    if len(existing) >= 30:
        raise HTTPException(status_code=400, detail="Max 30 ports allowed")

    created = crud.create_device_port(db, device_id, port_in.dict())
    return created


@router.put("/{device_id}/ports/{port_id}", response_model=schemas.DevicePort)
def update_device_port(device_id: int, port_id: int, port_in: schemas.DevicePortUpdate, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")

    port = crud.get_device_port(db, port_id)
    if not port or port.device_id != device_id:
        raise HTTPException(status_code=404, detail="DevicePort not found")

    updated = crud.update_device_port(db, port_id, port_in.dict(exclude_unset=True))
    return updated


@router.delete("/{device_id}/ports/{port_id}", response_model=dict)
def delete_device_port(device_id: int, port_id: int, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")

    port = crud.get_device_port(db, port_id)
    if not port or port.device_id != device_id:
        raise HTTPException(status_code=404, detail="DevicePort not found")

    crud.delete_device_port(db, port_id)
    return {"ok": True}
