from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/devices", tags=["devices"])


# --------------------------------------------------
#   GET ALL DEVICES
# --------------------------------------------------
@router.get("/", response_model=list[schemas.Device])
def get_devices(db: Session = Depends(get_db)):
    return crud.get_devices(db)


# --------------------------------------------------
#   CREATE DEVICE (rarely used, frontend uses instantiate)
# --------------------------------------------------
@router.post("/", response_model=schemas.Device)
def create_device(data: schemas.DeviceCreate, db: Session = Depends(get_db)):
    return crud.create_device(db, data)


# --------------------------------------------------
#   UPDATE DEVICE
# --------------------------------------------------
@router.put("/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, data: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    updated = crud.update_device(db, device_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated


# --------------------------------------------------
#   DELETE DEVICE
# --------------------------------------------------
@router.delete("/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_device(db, device_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Device not found")
    return deleted


# --------------------------------------------------
#   GET DEVICE PORTS
# --------------------------------------------------
@router.get("/{device_id}/ports", response_model=list[schemas.DevicePort])
def get_device_ports(device_id: int, db: Session = Depends(get_db)):
    return crud.get_device_ports(db, device_id)
