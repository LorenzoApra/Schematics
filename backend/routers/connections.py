from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/connections", tags=["connections"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[schemas.Connection])
def list_connections(db: Session = Depends(get_db)):
    return db.query(models.Connection).all()


@router.post("", response_model=schemas.Connection)
def create_connection(data: schemas.ConnectionCreate, db: Session = Depends(get_db)):
    # opzionale: controlli di esistenza porte
    c = models.Connection(
        from_port_id=data.from_port_id,
        to_port_id=data.to_port_id,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/{connection_id}")
def delete_connection(connection_id: int, db: Session = Depends(get_db)):
    c = db.query(models.Connection).filter(models.Connection.id == connection_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(c)
    db.commit()
    return {"status": "ok"}
