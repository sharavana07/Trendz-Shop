# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products
from app.core.database import Base, engine
from app.routers import admins

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trendz Shop API", version="1.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(products.router)


app.include_router(admins.router)

@app.get("/")
def root():
    return {"message": "Trendz Shop API running successfully!"}
