from sqlalchemy.orm import Session
from models import (
    Category,
    Template,
    TemplatePort,
    Device,
    DevicePort,
)
from schemas import (
    CategoryCreate,
    TemplateCreate,
    TemplatePortCreate,
    DeviceCreate,
    DeviceUpdate,
)


# --------------------------------------------------
#   CATEGORY CRUD
# --------------------------------------------------
def get_categories(db: Session):
    return db.query(Category).all()


def create_category(db: Session, data: CategoryCreate):
    category = Category(**data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


# --------------------------------------------------
#   TEMPLATE CRUD
# --------------------------------------------------
def get_templates(db: Session):
    return db.query(Template).all()


def get_template(db: Session, template_id: int):
    return db.query(Template).filter(Template.id == template_id).first()


def create_template(db: Session, data: TemplateCreate):
    template = Template(**data.dict())
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def update_template(db: Session, template_id: int, data: dict):
    template = get_template(db, template_id)
    if not template:
        return None

    for key, value in data.items():
        setattr(template, key, value)

    db.commit()
    db.refresh(template)
    return template


def delete_template(db: Session, template_id: int):
    template = get_template(db, template_id)
    if not template:
        return None

    db.delete(template)
    db.commit()
    return {"status": "deleted"}


# --------------------------------------------------
#   TEMPLATE PORTS
# --------------------------------------------------
def create_template_port(db: Session, template_id: int, data: TemplatePortCreate):
    port = TemplatePort(template_id=template_id, **data.dict())
    db.add(port)
    db.commit()
    db.refresh(port)
    return port


def get_template_ports(db: Session, template_id: int):
    return (
        db.query(TemplatePort)
        .filter(TemplatePort.template_id == template_id)
        .all()
    )


# --------------------------------------------------
#   DEVICE CRUD
# --------------------------------------------------
def get_devices(db: Session):
    return db.query(Device).all()


def get_device(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()


def create_device(db: Session, data: DeviceCreate):
    device = Device(**data.dict())
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


def update_device(db: Session, device_id: int, data: DeviceUpdate):
    device = get_device(db, device_id)
    if not device:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(device, key, value)

    db.commit()
    db.refresh(device)
    return device


def delete_device(db: Session, device_id: int):
    device = get_device(db, device_id)
    if not device:
        return None

    db.delete(device)
    db.commit()
    return {"status": "deleted"}


# --------------------------------------------------
#   DEVICE PORTS
# --------------------------------------------------
def get_device_ports(db: Session, device_id: int):
    return (
        db.query(DevicePort)
        .filter(DevicePort.device_id == device_id)
        .all()
    )


# --------------------------------------------------
#   INSTANTIATE TEMPLATE → CREATE DEVICE + PORTS
# --------------------------------------------------
def instantiate_template(db: Session, template_id: int):
    template = get_template(db, template_id)
    if not template:
        return None

    # 1) CREA DEVICE
    device = Device(
        name=template.name,
        color=template.color,
        template_id=template.id,
        x=100,
        y=100,
    )
    db.add(device)
    db.commit()
    db.refresh(device)

    # 2) DUPLICA PORTE
    for port in template.ports:
        new_port = DevicePort(
            name=port.name,
            type=port.type,
            device_id=device.id,
        )
        db.add(new_port)

    db.commit()
    return device
