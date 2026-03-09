from typing import List, Optional
from sqlalchemy.orm import Session

from . import models, schemas


# ============================================================
# CATEGORY CRUD
# ============================================================

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).all()


def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    obj = models.Category(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_category(db: Session, category_id: int, data: schemas.CategoryUpdate) -> Optional[models.Category]:
    obj = get_category(db, category_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_category(db: Session, category_id: int) -> bool:
    obj = get_category(db, category_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ============================================================
# DEVICE MODEL CRUD (ex Template)
# ============================================================

def get_device_models(db: Session) -> List[models.DeviceModel]:
    return db.query(models.DeviceModel).all()


def get_device_model(db: Session, model_id: int) -> Optional[models.DeviceModel]:
    return db.query(models.DeviceModel).filter(models.DeviceModel.id == model_id).first()


def create_device_model(db: Session, data: schemas.DeviceModelCreate) -> models.DeviceModel:
    obj = models.DeviceModel(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_device_model(db: Session, model_id: int, data: schemas.DeviceModelUpdate) -> Optional[models.DeviceModel]:
    obj = get_device_model(db, model_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_device_model(db: Session, model_id: int) -> bool:
    obj = get_device_model(db, model_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ============================================================
# MODEL PORT CRUD (ex TemplatePort)
# ============================================================

def get_model_ports(db: Session, model_id: int) -> List[models.ModelPort]:
    return db.query(models.ModelPort).filter(models.ModelPort.model_id == model_id).all()


def get_model_port(db: Session, port_id: int) -> Optional[models.ModelPort]:
    return db.query(models.ModelPort).filter(models.ModelPort.id == port_id).first()


def create_model_port(db: Session, model_id: int, data: schemas.ModelPortCreate) -> models.ModelPort:
    obj = models.ModelPort(**data.dict(), model_id=model_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_model_port(db: Session, port_id: int, data: schemas.ModelPortUpdate) -> Optional[models.ModelPort]:
    obj = get_model_port(db, port_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_model_port(db: Session, port_id: int) -> bool:
    obj = get_model_port(db, port_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ============================================================
# DEVICE INSTANCE CRUD
# ============================================================

def get_devices(db: Session) -> List[models.Device]:
    return db.query(models.Device).all()


def get_device(db: Session, device_id: int) -> Optional[models.Device]:
    return db.query(models.Device).filter(models.Device.id == device_id).first()


def create_device(db: Session, payload: dict) -> models.Device:
    obj = models.Device(**payload)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_device(db: Session, device_id: int, data: schemas.DeviceUpdate) -> Optional[models.Device]:
    obj = get_device(db, device_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_device(db: Session, device_id: int) -> bool:
    obj = get_device(db, device_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ============================================================
# DEVICE PORT INSTANCE CRUD
# ============================================================

def get_device_ports(db: Session, device_id: int) -> List[models.DevicePort]:
    return db.query(models.DevicePort).filter(models.DevicePort.device_id == device_id).all()


def get_device_port(db: Session, port_id: int) -> Optional[models.DevicePort]:
    return db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()


def create_device_port(db: Session, device_id: int, data: dict) -> models.DevicePort:
    obj = models.DevicePort(**data, device_id=device_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_device_port(db: Session, port_id: int, data: dict) -> Optional[models.DevicePort]:
    obj = get_device_port(db, port_id)
    if not obj:
        return None
    for k, v in data.items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_device_port(db: Session, port_id: int) -> bool:
    obj = get_device_port(db, port_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
