from typing import Optional, List
from pydantic import BaseModel


# ============================================================
# CATEGORY
# ============================================================

class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class Category(CategoryBase):
    id: int

    model_config = {"from_attributes": True}


# ============================================================
# MODEL PORT (ex TemplatePort)
# ============================================================

class ModelPortBase(BaseModel):
    name: str
    type: str


class ModelPortCreate(ModelPortBase):
    pass


class ModelPortUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None


class ModelPort(ModelPortBase):
    id: int
    model_id: int

    model_config = {"from_attributes": True}


# ============================================================
# DEVICE MODEL (ex Template)
# ============================================================

class DeviceModelBase(BaseModel):
    name: str
    color: Optional[str] = None
    category_id: Optional[int] = None


class DeviceModelCreate(DeviceModelBase):
    pass


class DeviceModelUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    category_id: Optional[int] = None


class DeviceModel(DeviceModelBase):
    id: int

    model_config = {"from_attributes": True}


# ============================================================
# DEVICE PORT INSTANCE
# ============================================================

class DevicePortBase(BaseModel):
    name: str
    type: str


class DevicePortCreate(DevicePortBase):
    pass


class DevicePortUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None


class DevicePort(DevicePortBase):
    id: int
    device_id: int

    model_config = {"from_attributes": True}


# ============================================================
# DEVICE INSTANCE
# ============================================================

class DeviceBase(BaseModel):
    name: str
    color: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None
    model_id: Optional[int] = None


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None
    model_id: Optional[int] = None


class Device(DeviceBase):
    id: int

    model_config = {"from_attributes": True}
