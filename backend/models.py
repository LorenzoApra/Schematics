from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    color = Column(String, default="#dddddd")
    x = Column(Integer)
    y = Column(Integer)


class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_device = Column(Integer)
    from_port = Column(String)
    to_device = Column(Integer)
    to_port = Column(String)


class DeviceCategory(Base):
    __tablename__ = "device_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    color = Column(String, default="#cccccc")

    templates = relationship("DeviceTemplate", back_populates="category")


class DeviceTemplate(Base):
    __tablename__ = "device_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category_id = Column(Integer, ForeignKey("device_categories.id"))

    category = relationship("DeviceCategory", back_populates="templates")
