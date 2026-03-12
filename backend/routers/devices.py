from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, database

router = APIRouter(prefix="/devices", tags=["devices"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Device])
def list_devices(db: Session = Depends(get_db)):
    return crud.get_devices(db)


@router.post("/", response_model=schemas.Device)
def create_device(data: schemas.DeviceCreate, db: Session = Depends(get_db)):
    return crud.create_device(db, data)


@router.get("/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db)):
    dev = crud.get_device(db, device_id)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    return dev


@router.put("/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, data: schemas.DeviceCreate, db: Session = Depends(get_db)):
    dev = crud.update_device(db, device_id, data)
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    return dev


@router.post("/{device_id}/ports", response_model=schemas.DevicePort)
def add_device_port(device_id: int, data: schemas.DevicePortCreate, db: Session = Depends(get_db)):
    return crud.create_device_port(db, device_id, data)


@router.delete("/ports/{port_id}")
def delete_device_port(port_id: int, db: Session = Depends(get_db)):
    port = crud.delete_device_port(db, port_id)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return {"ok": True}
