from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
#   DB SESSION
# -------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
#                      DEVICES
# ============================================================

@app.get("/devices")
def get_devices(db: Session = Depends(get_db)):
    return db.query(models.Device).all()


@app.post("/devices")
def create_device(device: dict, db: Session = Depends(get_db)):
    new = models.Device(
        name=device["name"],
        color=device.get("color", "#dddddd"),
        x=device.get("x", 100),
        y=device.get("y", 100),
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.put("/devices/{device_id}")
def update_device(device_id: int, data: dict, db: Session = Depends(get_db)):
    dev = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not dev:
        return {"error": "Device not found"}

    dev.name = data.get("name", dev.name)
    dev.color = data.get("color", dev.color)
    dev.x = data.get("x", dev.x)
    dev.y = data.get("y", dev.y)

    db.commit()
    db.refresh(dev)
    return dev


@app.delete("/devices/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    dev = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not dev:
        return {"error": "Device not found"}

    db.delete(dev)
    db.commit()
    return {"status": "ok"}


# ============================================================
#                      DEVICE PORTS
# ============================================================

@app.get("/devices/{device_id}/ports")
def get_device_ports(device_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.DevicePort)
        .filter(models.DevicePort.device_id == device_id)
        .order_by(models.DevicePort.direction, models.DevicePort.order)
        .all()
    )


@app.post("/devices/{device_id}/ports")
def add_device_port(device_id: int, data: dict, db: Session = Depends(get_db)):
    # Calcola ordine massimo per quella direzione
    max_order = (
        db.query(models.DevicePort)
        .filter(
            models.DevicePort.device_id == device_id,
            models.DevicePort.direction == data["direction"],
        )
        .count()
    )

    new = models.DevicePort(
        device_id=device_id,
        name=data["name"],
        type=data["type"],
        direction=data["direction"],
        order=max_order,
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.put("/device_ports/{port_id}")
def update_device_port(port_id: int, data: dict, db: Session = Depends(get_db)):
    port = db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()
    if not port:
        return {"error": "Port not found"}

    port.name = data.get("name", port.name)
    port.type = data.get("type", port.type)

    db.commit()
    db.refresh(port)
    return port


@app.delete("/device_ports/{port_id}")
def delete_device_port(port_id: int, db: Session = Depends(get_db)):
    port = db.query(models.DevicePort).filter(models.DevicePort.id == port_id).first()
    if not port:
        return {"error": "Port not found"}

    db.delete(port)
    db.commit()
    return {"status": "ok"}


@app.put("/devices/{device_id}/ports/reorder")
def reorder_device_ports(device_id: int, data: dict, db: Session = Depends(get_db)):
    """
    data = {
        "direction": "in" or "out",
        "order": [3,1,2,5,...]  # lista di port_id nell'ordine desiderato
    }
    """
    direction = data["direction"]
    order_list = data["order"]

    ports = (
        db.query(models.DevicePort)
        .filter(
            models.DevicePort.device_id == device_id,
            models.DevicePort.direction == direction,
        )
        .all()
    )

    port_map = {p.id: p for p in ports}

    for index, port_id in enumerate(order_list):
        if port_id in port_map:
            port_map[port_id].order = index

    db.commit()
    return {"status": "ok"}


# ============================================================
#                      CATEGORIES
# ============================================================

@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.DeviceCategory).all()


@app.post("/categories")
def add_category(data: dict, db: Session = Depends(get_db)):
    new = models.DeviceCategory(name=data["name"], color=data["color"])
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.put("/categories/{cat_id}")
def update_category(cat_id: int, data: dict, db: Session = Depends(get_db)):
    cat = db.query(models.DeviceCategory).filter(models.DeviceCategory.id == cat_id).first()
    if not cat:
        return {"error": "Category not found"}

    cat.name = data.get("name", cat.name)
    cat.color = data.get("color", cat.color)

    db.commit()
    db.refresh(cat)
    return cat


@app.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(models.DeviceCategory).filter(models.DeviceCategory.id == cat_id).first()
    if not cat:
        return {"error": "Category not found"}

    db.delete(cat)
    db.commit()
    return {"status": "ok"}


# ============================================================
#                      TEMPLATES
# ============================================================

@app.get("/templates")
def get_templates(db: Session = Depends(get_db)):
    return db.query(models.DeviceTemplate).all()


@app.post("/templates")
def add_template(data: dict, db: Session = Depends(get_db)):
    new = models.DeviceTemplate(
        name=data["name"],
        category_id=data.get("category_id"),
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.put("/templates/{template_id}")
def update_template(template_id: int, data: dict, db: Session = Depends(get_db)):
    t = db.query(models.DeviceTemplate).filter(models.DeviceTemplate.id == template_id).first()
    if not t:
        return {"error": "Template not found"}

    t.name = data.get("name", t.name)
    t.category_id = data.get("category_id", t.category_id)

    db.commit()
    db.refresh(t)
    return t


@app.delete("/templates/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    t = db.query(models.DeviceTemplate).filter(models.DeviceTemplate.id == template_id).first()
    if not t:
        return {"error": "Template not found"}

    db.delete(t)
    db.commit()
    return {"status": "ok"}


# ============================================================
#                      TEMPLATE PORTS
# ============================================================

@app.get("/templates/{template_id}/ports")
def get_template_ports(template_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.TemplatePort)
        .filter(models.TemplatePort.template_id == template_id)
        .order_by(models.TemplatePort.direction, models.TemplatePort.order)
        .all()
    )


@app.post("/templates/{template_id}/ports")
def add_template_port(template_id: int, data: dict, db: Session = Depends(get_db)):
    max_order = (
        db.query(models.TemplatePort)
        .filter(
            models.TemplatePort.template_id == template_id,
            models.TemplatePort.direction == data["direction"],
        )
        .count()
    )

    new = models.TemplatePort(
        template_id=template_id,
        name=data["name"],
        type=data["type"],
        direction=data["direction"],
        order=max_order,
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.put("/template_ports/{port_id}")
def update_template_port(port_id: int, data: dict, db: Session = Depends(get_db)):
    port = db.query(models.TemplatePort).filter(models.TemplatePort.id == port_id).first()
    if not port:
        return {"error": "Port not found"}

    port.name = data.get("name", port.name)
    port.type = data.get("type", port.type)

    db.commit()
    db.refresh(port)
    return port


@app.delete("/template_ports/{port_id}")
def delete_template_port(port_id: int, db: Session = Depends(get_db)):
    port = db.query(models.TemplatePort).filter(models.TemplatePort.id == port_id).first()
    if not port:
        return {"error": "Port not found"}

    db.delete(port)
    db.commit()
    return {"status": "ok"}


@app.put("/templates/{template_id}/ports/reorder")
def reorder_template_ports(template_id: int, data: dict, db: Session = Depends(get_db)):
    direction = data["direction"]
    order_list = data["order"]

    ports = (
        db.query(models.TemplatePort)
        .filter(
            models.TemplatePort.template_id == template_id,
            models.TemplatePort.direction == direction,
        )
        .all()
    )

    port_map = {p.id: p for p in ports}

    for index, port_id in enumerate(order_list):
        if port_id in port_map:
            port_map[port_id].order = index

    db.commit()
    return {"status": "ok"}


# ============================================================
#      CREATE DEVICE FROM TEMPLATE (COPY PORTS)
# ============================================================

@app.post("/templates/{template_id}/instantiate")
def instantiate_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(models.DeviceTemplate).filter(models.DeviceTemplate.id == template_id).first()
    if not template:
        return {"error": "Template not found"}

    # 1) crea device
    new_dev = models.Device(
        name=template.name,
        color="#dddddd",
        x=100,
        y=100,
    )
    db.add(new_dev)
    db.commit()
    db.refresh(new_dev)

    # 2) copia porte
    ports = (
        db.query(models.TemplatePort)
        .filter(models.TemplatePort.template_id == template_id)
        .order_by(models.TemplatePort.direction, models.TemplatePort.order)
        .all()
    )

    for p in ports:
        new_port = models.DevicePort(
            device_id=new_dev.id,
            name=p.name,
            type=p.type,
            direction=p.direction,
            order=p.order,
        )
        db.add(new_port)

    db.commit()

    return new_dev
