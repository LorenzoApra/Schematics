from typing import Optional, List
from pydantic import BaseModel


# Category
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

    class Config:
        orm_mode = True


# TemplatePort
class TemplatePortBase(BaseModel):
    name: str
    type: str


class TemplatePortCreate(TemplatePortBase):
    pass


class TemplatePortUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None


class TemplatePort(TemplatePortBase):
    id: int
    template_id: int

    class Config:
        orm_mode = True


# Template
class TemplateBase(BaseModel):
    name: str
    color: Optional[str] = None
    category_id: Optional[int] = None


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    category_id: Optional[int] = None


class Template(TemplateBase):
    id: int

    class Config:
        orm_mode = True


# DevicePort
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

    class Config:
        orm_mode = True


# Device
class DeviceBase(BaseModel):
    name: str
    color: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None
    template_id: Optional[int] = None


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None
    template_id: Optional[int] = None


class Device(DeviceBase):
    id: int

    class Config:
        orm_mode = True
