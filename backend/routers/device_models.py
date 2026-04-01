from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, database, models

router = APIRouter(prefix="/device-models", tags=["device-models"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.DeviceModel])
def list_device_models(db: Session = Depends(get_db)):
    return crud.get_device_models(db)


@router.post("/", response_model=schemas.DeviceModel)
def create_device_model(data: schemas.DeviceModelCreate, db: Session = Depends(get_db)):
    return crud.create_device_model(db, data)


@router.put("/{model_id}", response_model=schemas.DeviceModel)
def update_device_model(model_id: int, data: schemas.DeviceModelCreate, db: Session = Depends(get_db)):
    model = crud.update_device_model(db, model_id, data)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@router.post("/{model_id}/ports", response_model=schemas.ModelPort)
def add_model_port(model_id: int, data: schemas.ModelPortCreate, db: Session = Depends(get_db)):
    return crud.create_model_port(db, model_id, data)


@router.delete("/ports/{port_id}")
def delete_model_port(port_id: int, db: Session = Depends(get_db)):
    port = crud.delete_model_port(db, port_id)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return {"ok": True}


# eliminare device
@router.delete("/{model_id}")
def delete_device_model(model_id: int, db: Session = Depends(get_db)):
    model = db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Elimina anche le porte associate
    for port in model.ports:
        db.delete(port)

    db.delete(model)
    db.commit()
    return {"status": "deleted"}

# INSTANTIATE DEVICE FROM MODEL
@router.post("/{model_id}/instantiate", response_model=schemas.Device)
def instantiate_device(model_id: int, db: Session = Depends(get_db)):
    model = crud.get_device_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    device = models.Device(
        name=model.name,
        x=100,
        y=100,
        color=model.category.color if model.category else "#888888",
        model_id=model.id,
    )
    db.add(device)
    db.commit()
    db.refresh(device)

    for p in model.ports:
        dp = models.DevicePort(
            device_id=device.id,
            name=p.name,
            type=p.type,
            direction=p.direction,
        )
        db.add(dp)

    db.commit()
    db.refresh(device)

    return device
