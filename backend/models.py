from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


# -------------------------
#       DEVICES
# -------------------------

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    color = Column(String, default="#dddddd")
    x = Column(Integer)
    y = Column(Integer)

    ports = relationship("DevicePort", back_populates="device", cascade="all, delete-orphan")


class DevicePort(Base):
    __tablename__ = "device_ports"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    name = Column(String)
    type = Column(String)
    direction = Column(String)  # "in" or "out"
    order = Column(Integer)

    device = relationship("Device", back_populates="ports")


# -------------------------
#       CONNECTIONS
# -------------------------

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_device = Column(Integer)
    from_port = Column(String)
    to_device = Column(Integer)
    to_port = Column(String)


# -------------------------
#       CATEGORIES
# -------------------------

class DeviceCategory(Base):
    __tablename__ = "device_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    color = Column(String, default="#cccccc")

    templates = relationship("DeviceTemplate", back_populates="category")


# -------------------------
#       TEMPLATES
# -------------------------

class DeviceTemplate(Base):
    __tablename__ = "device_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category_id = Column(Integer, ForeignKey("device_categories.id"))

    category = relationship("DeviceCategory", back_populates="templates")
    ports = relationship("TemplatePort", back_populates="template", cascade="all, delete-orphan")


class TemplatePort(Base):
    __tablename__ = "template_ports"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("device_templates.id"))
    name = Column(String)
    type = Column(String)
    direction = Column(String)
    order = Column(Integer)

    template = relationship("DeviceTemplate", back_populates="ports")
