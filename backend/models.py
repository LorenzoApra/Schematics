from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=True)

    models = relationship("DeviceModel", back_populates="category")


class DeviceModel(Base):
    __tablename__ = "device_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    category = relationship("Category", back_populates="models")
    ports = relationship("ModelPort", back_populates="model", cascade="all, delete-orphan")


class ModelPort(Base):
    __tablename__ = "model_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    direction = Column(String, nullable=False)  # "in", "out", "inout"
    model_id = Column(Integer, ForeignKey("device_models.id"), nullable=False)

    model = relationship("DeviceModel", back_populates="ports")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    x = Column(Integer, default=100)
    y = Column(Integer, default=100)
    color = Column(String, default="#000000")
    model_id = Column(Integer, ForeignKey("device_models.id"), nullable=True)

    model = relationship("DeviceModel")
    ports = relationship("DevicePort", back_populates="device", cascade="all, delete-orphan")


class DevicePort(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    direction = Column(String, nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)

    device = relationship("Device", back_populates="ports")

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_port_id = Column(Integer, ForeignKey("device_ports.id"), nullable=False)
    to_port_id = Column(Integer, ForeignKey("device_ports.id"), nullable=False)
