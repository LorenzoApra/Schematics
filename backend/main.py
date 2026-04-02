from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import categories, models, devices, connections

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(models.router)
app.include_router(devices.router)
app.include_router(connections.router)
