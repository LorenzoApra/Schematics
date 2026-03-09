from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import templates, devices, categories

# --------------------------------------------------
#   CREATE DATABASE TABLES
# --------------------------------------------------
Base.metadata.create_all(bind=engine)

# --------------------------------------------------
#   FASTAPI APP
# --------------------------------------------------
app = FastAPI(title="Schematics Backend", version="1.0.0")

# --------------------------------------------------
#   CORS (PERMETTE AL FRONTEND DI CHIAMARE L'API)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # puoi restringerlo a ["http://localhost:5173"] se vuoi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
#   ROUTERS
# --------------------------------------------------
app.include_router(templates.router)
app.include_router(devices.router)
app.include_router(categories.router)


# --------------------------------------------------
#   ROOT ENDPOINT (OPZIONALE)
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "Schematics backend is running"}
