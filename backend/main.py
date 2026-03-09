from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, database, crud, schemas
from .routers.device_models import router as device_models_router
from .routers.devices import router as devices_router

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# DB dependency
# ------------------------------------------------------------
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------------------------------------
# ROOT
# ------------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "Schematics backend is running"}


# ------------------------------------------------------------
# CATEGORY ENDPOINTS
# ------------------------------------------------------------

@app.get("/categories", response_model=list[schemas.Category])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@app.post("/categories", response_model=schemas.Category)
def create_category(cat_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, cat_in)


@app.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, cat_in: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    updated = crud.update_category(db, category_id, cat_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated


@app.delete("/categories/{category_id}", response_model=dict)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_category(db, category_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True}


# ------------------------------------------------------------
# ROUTERS
# ------------------------------------------------------------
app.include_router(device_models_router)
app.include_router(devices_router)
