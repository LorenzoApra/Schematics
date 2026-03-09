from typing import List, Optional
from sqlalchemy.orm import Session

from . import models, schemas


# Categories
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


# Templates
def get_templates(db: Session) -> List[models.Template]:
    return db.query(models.Template).all()


def get_template(db: Session, template_id: int) -> Optional[models.Template]:
    return db.query(models.Template).filter(models.Template.id == template_id).first()


def create_template(db: Session, data: schemas.TemplateCreate) -> models.Template:
    obj = models.Template(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_template(db: Session, template_id: int, data: schemas.TemplateUpdate) -> Optional[models.Template]:
    obj = get_template(db, template_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_template(db: Session, template_id: int) -> bool:
    obj = get_template(db, template_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# Template ports
def get_template_ports(db: Session, template_id: int) -> List[models.TemplatePort]:
    return db.query(models.TemplatePort).filter(models.TemplatePort.template_id == template_id).all()


def get_template_port(db: Session, port_id: int) -> Optional[models.TemplatePort]:
    return db.query(models.TemplatePort).filter(models.TemplatePort.id == port_id).first()


def create_template_port(db: Session, template_id: int, data: schemas.TemplatePortCreate) -> models.TemplatePort:
    obj = models.TemplatePort(**data.dict(), template_id=template_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_template_port(db: Session, port_id: int, data: schemas.TemplatePortUpdate) -> Optional[models.TemplatePort]:
    obj = get_template_port(db, port_id)
    if not obj:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_template_port(db: Session, port_id: int) -> bool:
    obj = get_template_port(db, port_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# Devices
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


# Device ports
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
