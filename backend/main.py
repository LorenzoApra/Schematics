from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import categories
from .database import engine
from . import models
from .routers import device_models, devices

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(device_models.router)
app.include_router(devices.router)
app.include_router(categories.router)


