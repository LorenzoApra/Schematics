from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/devices", tags=["devices"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[schemas.Device])
def list_devices(db: Session = Depends(get_db)):
    return db.query(models.Device).all()


@router.get("/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db)):
    d = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    return d


@router.post("", response_model=schemas.Device)
def create_device(data: schemas.DeviceCreate, db: Session = Depends(get_db)):
    d = models.Device(
      name=data.name,
      x=data.x,
      y=data.y,
      color=data.color,
      model_id=data.model_id,
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d


@router.put("/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, data: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    d = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")

    d.name = data.name
    d.x = data.x
    d.y = data.y
    d.color = data.color
    d.model_id = data.model_id
    db.commit()
    db.refresh(d)
    return d


@router.delete("/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    d = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(d)
    db.commit()
    return {"status": "ok"}


# ---------- DEVICE PORTS ----------

@router.post("/{device_id}/ports", response_model=schemas.DevicePort)
def create_device_port(device_id: int, data: schemas.DevicePortCreate, db: Session = Depends(get_db)):
    dev = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")

    p = models.DevicePort(
        name=data.name,
        type=data.type,
        direction=data.direction,
        device_id=device_id,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.put("/ports/{port_id}", response_model=schemas.DevicePort)
def update_device_port(port_id: int, data: schemas.DevicePortCreate, db: Session = Depends(get_db)):
    p = db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Device port not found")

    p.name = data.name
    p.type = data.type
    p.direction = data.direction
    db.commit()
    db.refresh(p)
    return p


@router.delete("/ports/{port_id}")
def delete_device_port(port_id: int, db: Session = Depends(get_db)):
    p = db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Device port not found")
    db.delete(p)
    db.commit()
    return {"status": "ok"}

@router.post("/from-model/{model_id}", response_model=schemas.Device)
def instantiate_from_model(model_id: int, db: Session = Depends(get_db)):
    m = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")

    d = models.Device(
        name=m.name,
        x=100,
        y=100,
        color="#000000",
        model_id=m.id,
    )
    db.add(d)
    db.commit()
    db.refresh(d)

    for mp in m.ports:
        dp = models.DevicePort(
            name=mp.name,
            type=mp.type,
            direction=mp.direction,
            device_id=d.id,
        )
        db.add(dp)

    db.commit()
    db.refresh(d)
    return d
