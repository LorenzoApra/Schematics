from sqlalchemy.orm import Session
from . import models, schemas


def get_categories(db: Session):
    return db.query(models.Category).all()


def create_category(db: Session, data: schemas.CategoryCreate):
    cat = models.Category(name=data.name, color=data.color)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def get_device_models(db: Session):
    return db.query(models.DeviceModel).all()


def get_device_model(db: Session, model_id: int):
    return db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()


def create_device_model(db: Session, data: schemas.DeviceModelCreate):
    model = models.DeviceModel(name=data.name, category_id=data.category_id)
    db.add(model)
    db.commit()
    db.refresh(model)
    return model


def update_device_model(db: Session, model_id: int, data: schemas.DeviceModelCreate):
    model = get_device_model(db, model_id)
    if not model:
        return None
    model.name = data.name
    model.category_id = data.category_id
    db.commit()
    db.refresh(model)
    return model


def create_model_port(db: Session, model_id: int, data: schemas.ModelPortCreate):
    port = models.ModelPort(
        model_id=model_id,
        name=data.name,
        type=data.type,
        direction=data.direction,
    )
    db.add(port)
    db.commit()
    db.refresh(port)
    return port


def delete_model_port(db: Session, port_id: int):
    port = db.query(models.ModelPort).filter(models.ModelPort.id == port_id).first()
    if port:
        db.delete(port)
        db.commit()
    return port


def get_devices(db: Session):
    return db.query(models.Device).all()


def get_device(db: Session, device_id: int):
    return db.query(models.Device).filter(models.Device.id == device_id).first()


def create_device(db: Session, data: schemas.DeviceCreate):
    dev = models.Device(
        name=data.name,
        x=data.x,
        y=data.y,
        color=data.color,
        model_id=data.model_id,
    )
    db.add(dev)
    db.commit()
    db.refresh(dev)
    return dev


def update_device(db: Session, device_id: int, data: schemas.DeviceCreate):
    dev = get_device(db, device_id)
    if not dev:
        return None
    dev.name = data.name
    dev.x = data.x
    dev.y = data.y
    dev.color = data.color
    dev.model_id = data.model_id
    db.commit()
    db.refresh(dev)
    return dev


def create_device_port(db: Session, device_id: int, data: schemas.DevicePortCreate):
    port = models.DevicePort(
        device_id=device_id,
        name=data.name,
        type=data.type,
        direction=data.direction,
    )
    db.add(port)
    db.commit()
    db.refresh(port)
    return port


def delete_device_port(db: Session, port_id: int):
    port = db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()
    if port:
        db.delete(port)
        db.commit()
    return port
