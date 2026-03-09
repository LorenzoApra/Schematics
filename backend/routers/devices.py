from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas, database

router = APIRouter(prefix="/devices", tags=["devices"])


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


@router.get("/", response_model=List[schemas.Device])
def list_devices(db: Session = Depends(get_db)):
    return crud.get_devices(db)


@router.post("/", response_model=schemas.Device)
def create_device(device_in: schemas.DeviceCreate, db: Session = Depends(get_db)):
    color = device_in.color
    if not color:
        if device_in.template_id is not None:
            tpl = crud.get_template(db, device_in.template_id)
            cat_id = tpl.category_id if tpl else None
            color = _get_category_color(db, cat_id)
        else:
            color = _get_category_color(db, None)

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


# Device ports
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
        raise HTTPException(status_code=404, detail="Port not found")
    updated = crud.update_device_port(db, port_id, port_in.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update port")
    return updated


@router.delete("/{device_id}/ports/{port_id}", response_model=dict)
def delete_device_port(device_id: int, port_id: int, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    port = crud.get_device_port(db, port_id)
    if not port or port.device_id != device_id:
        raise HTTPException(status_code=404, detail="Port not found")
    crud.delete_device_port(db, port_id)
    return {"ok": True}
