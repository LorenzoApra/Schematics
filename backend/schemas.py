from pydantic import BaseModel

# ---------- CATEGORY ----------

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# ---------- MODEL PORT ----------

class ModelPortBase(BaseModel):
    name: str
    type: str
    direction: str

class ModelPortCreate(ModelPortBase):
    pass

class ModelPort(ModelPortBase):
    id: int
    model_id: int

    class Config:
        from_attributes = True


# ---------- DEVICE MODEL ----------

class DeviceModelBase(BaseModel):
    name: str
    category_id: int | None = None

class DeviceModelCreate(DeviceModelBase):
    pass

class DeviceModelUpdate(DeviceModelBase):
    pass

class DeviceModel(DeviceModelBase):
    id: int
    ports: list[ModelPort] = []

    class Config:
        from_attributes = True


# ---------- DEVICE PORT ----------

class DevicePortBase(BaseModel):
    name: str
    type: str
    direction: str

class DevicePortCreate(DevicePortBase):
    pass

class DevicePort(DevicePortBase):
    id: int
    device_id: int

    class Config:
        from_attributes = True


# ---------- DEVICE ----------

class DeviceBase(BaseModel):
    name: str
    x: int
    y: int
    color: str
    model_id: int | None = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    ports: list[DevicePort] = []

    class Config:
        from_attributes = True


# ---------- CONNECTION ----------

class ConnectionBase(BaseModel):
    from_port_id: int
    to_port_id: int

class ConnectionCreate(ConnectionBase):
    pass

class Connection(ConnectionBase):
    id: int

    class Config:
        from_attributes = True
