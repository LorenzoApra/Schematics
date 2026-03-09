from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


# -------------------------
# CATEGORY
# -------------------------
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=True)

    device_models = relationship("DeviceModel", back_populates="category")


# -------------------------
# DEVICE MODEL (ex Template)
# -------------------------
class DeviceModel(Base):
    __tablename__ = "device_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    category = relationship("Category", back_populates="device_models")
    ports = relationship("ModelPort", back_populates="model", cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="model")


# -------------------------
# MODEL PORT (ex TemplatePort)
# -------------------------
class ModelPort(Base):
    __tablename__ = "model_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    model_id = Column(Integer, ForeignKey("device_models.id"), nullable=False)

    model = relationship("DeviceModel", back_populates="ports")


# -------------------------
# DEVICE INSTANCE
# -------------------------
class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=True)
    x = Column(Integer, nullable=True)
    y = Column(Integer, nullable=True)
    model_id = Column(Integer, ForeignKey("device_models.id"), nullable=True)

    model = relationship("DeviceModel", back_populates="devices")
    ports = relationship("DevicePort", back_populates="device", cascade="all, delete-orphan")


# -------------------------
# DEVICE PORT INSTANCE
# -------------------------
class DevicePort(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)

    device = relationship("Device", back_populates="ports")
