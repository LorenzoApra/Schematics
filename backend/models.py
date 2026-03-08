from sqlalchemy import Column, Integer, String
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


class DeviceTemplate(Base):
    __tablename__ = "device_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    color = Column(String, default="#dddddd")
