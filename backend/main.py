from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Device, Connection, DeviceTemplate

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

    device.x = data.get("x", device.x)
    device.y = data.get("y", device.y)
    device.color = data.get("color", device.color)
    device.name = data.get("name", device.name)

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


# -------------------------
#      CONNECTIONS
# -------------------------

@app.post("/connections")
def add_connection(conn: dict, db: Session = Depends(get_db)):
    c = Connection(**conn)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


# -------------------------
#      PATCHLIST
# -------------------------

@app.get("/patchlist")
def generate_patchlist(db: Session = Depends(get_db)):
    conns = db.query(Connection).all()
    devices = {d.id: d for d in db.query(Device).all()}

    patchlist = []
    for c in conns:
        patchlist.append({
            "from": f"{devices[c.from_device].name} - {c.from_port}",
            "to": f"{devices[c.to_device].name} - {c.to_port}"
        })
    return patchlist
