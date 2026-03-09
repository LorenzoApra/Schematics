from pydantic import BaseModel
from typing import Optional, List


# --------------------------------------------------
#   CATEGORY
# --------------------------------------------------
class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#cccccc"


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


# --------------------------------------------------
#   TEMPLATE PORT
# --------------------------------------------------
class TemplatePortBase(BaseModel):
    name: str
    type: str


class TemplatePortCreate(TemplatePortBase):
    pass


class TemplatePort(TemplatePortBase):
    id: int

    class Config:
        orm_mode = True


# --------------------------------------------------
#   TEMPLATE
# --------------------------------------------------
class TemplateBase(BaseModel):
    name: str
    color: Optional[str] = "#cccccc"
    category_id: Optional[int]


class TemplateCreate(TemplateBase):
    pass


class Template(TemplateBase):
    id: int
    ports: List[TemplatePort] = []

    class Config:
        orm_mode = True


# --------------------------------------------------
#   DEVICE PORT
# --------------------------------------------------
class DevicePortBase(BaseModel):
    name: str
    type: str


class DevicePortCreate(DevicePortBase):
    pass


class DevicePort(DevicePortBase):
    id: int

    class Config:
        orm_mode = True


# --------------------------------------------------
#   DEVICE
# --------------------------------------------------
class DeviceBase(BaseModel):
    name: str
    color: Optional[str] = "#cccccc"
    x: Optional[int] = 100
    y: Optional[int] = 100
    template_id: Optional[int]


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    name: Optional[str]
    color: Optional[str]
    x: Optional[int]
    y: Optional[int]


class Device(DeviceBase):
    id: int
    ports: List[DevicePort] = []

    class Config:
        orm_mode = True
