from pydantic import BaseModel
from typing import List


class CategoryBase(BaseModel):
    name: str
    color: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ModelPortCreate(BaseModel):
    name: str
    type: str
    direction: str = "in"


class ModelPort(BaseModel):
    id: int
    name: str
    type: str
    direction: str

    class Config:
        from_attributes = True


class DeviceModelCreate(BaseModel):
    name: str
    category_id: int


class DeviceModel(BaseModel):
    id: int
    name: str
    category_id: int
    ports: List[ModelPort] = []

    class Config:
        from_attributes = True


class DevicePortCreate(BaseModel):
    name: str
    type: str
    direction: str = "in"


class DevicePort(BaseModel):
    id: int
    name: str
    type: str
    direction: str

    class Config:
        from_attributes = True


class DeviceCreate(BaseModel):
    name: str
    x: float
    y: float
    color: str
    model_id: int


class Device(BaseModel):
    id: int
    name: str
    x: float
    y: float
    color: str
    model_id: int
    ports: List[DevicePort] = []

    class Config:
        from_attributes = True
