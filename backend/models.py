from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


# --------------------------------------------------
#   CATEGORY
# --------------------------------------------------
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#cccccc")

    templates = relationship("Template", back_populates="category")


# --------------------------------------------------
#   TEMPLATE
# --------------------------------------------------
class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#cccccc")

    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="templates")

    ports = relationship("TemplatePort", back_populates="template")


# --------------------------------------------------
#   TEMPLATE PORT
# --------------------------------------------------
class TemplatePort(Base):
    __tablename__ = "template_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)

    template_id = Column(Integer, ForeignKey("templates.id"))
    template = relationship("Template", back_populates="ports")


# --------------------------------------------------
#   DEVICE
# --------------------------------------------------
class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#cccccc")

    x = Column(Integer, default=100)
    y = Column(Integer, default=100)

    template_id = Column(Integer, ForeignKey("templates.id"))
    template = relationship("Template")

    ports = relationship("DevicePort", back_populates="device")


# --------------------------------------------------
#   DEVICE PORT
# --------------------------------------------------
class DevicePort(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)

    device_id = Column(Integer, ForeignKey("devices.id"))
    device = relationship("Device", back_populates="ports")