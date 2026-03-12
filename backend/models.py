from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)

    device_models = relationship("DeviceModel", back_populates="category")


class DeviceModel(Base):
    __tablename__ = "device_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category", back_populates="device_models")
    ports = relationship("ModelPort", back_populates="model", cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="model")


class ModelPort(Base):
    __tablename__ = "model_ports"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("device_models.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    direction = Column(String, default="in")

    model = relationship("DeviceModel", back_populates="ports")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    color = Column(String, nullable=False)
    model_id = Column(Integer, ForeignKey("device_models.id"))

    model = relationship("DeviceModel", back_populates="devices")
    ports = relationship("DevicePort", back_populates="device", cascade="all, delete-orphan")


class DevicePort(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    direction = Column(String, default="in")

    device = relationship("Device", back_populates="ports")
