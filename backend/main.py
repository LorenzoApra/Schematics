from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Device, Connection, DeviceTemplate, DeviceCategory

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
#        DEVICES
# -------------------------

@app.get("/devices")
def get_devices(db: Session = Depends(get_db)):
    return db.query(Device).all()


@app.post("/devices")
def add_device(device: dict, db: Session = Depends(get_db)):
    d = Device(**device)
    db.add(d)
    db.commit()
    db.refresh(d)
    return d


@app.put("/devices/{device_id}")
def update_device(device_id: int, data: dict, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        return {"error": "Device not found"}

    for key, value in data.items():
        setattr(device, key, value)

    db.commit()
    db.refresh(device)
    return device


@app.delete("/devices/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        return {"error": "Device not found"}

    db.delete(device)
    db.commit()
    return {"status": "deleted"}


# -------------------------
#     DEVICE CATEGORIES
# -------------------------

@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(DeviceCategory).all()


@app.post("/categories")
def add_category(cat: dict, db: Session = Depends(get_db)):
    c = DeviceCategory(**cat)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@app.put("/categories/{cat_id}")
def update_category(cat_id: int, data: dict, db: Session = Depends(get_db)):
    cat = db.query(DeviceCategory).filter(DeviceCategory.id == cat_id).first()
    if not cat:
        return {"error": "Category not found"}

    for key, value in data.items():
        setattr(cat, key, value)

    db.commit()
    db.refresh(cat)
    return cat


@app.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(DeviceCategory).filter(DeviceCategory.id == cat_id).first()
    if not cat:
        return {"error": "Category not found"}

    db.delete(cat)
    db.commit()
    return {"status": "deleted"}


# -------------------------
#     DEVICE TEMPLATES
# -------------------------

@app.get("/templates")
def get_templates(db: Session = Depends(get_db)):
    return db.query(DeviceTemplate).all()


@app.post("/templates")
def add_template(template: dict, db: Session = Depends(get_db)):
    t = DeviceTemplate(**template)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@app.put("/templates/{template_id}")
def update_template(template_id: int, data: dict, db: Session = Depends(get_db)):
    t = db.query(DeviceTemplate).filter(DeviceTemplate.id == template_id).first()
    if not t:
        return {"error": "Template not found"}

    for key, value in data.items():
        setattr(t, key, value)

    db.commit()
    db.refresh(t)
    return t


@app.delete("/templates/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    t = db.query(DeviceTemplate).filter(DeviceTemplate.id == template_id).first()
    if not t:
        return {"error": "Template not found"}

    db.delete(t)
    db.commit()
    return {"status": "deleted"}
