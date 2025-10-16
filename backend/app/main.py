# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products
from app.core.database import Base, engine
from app.routers import admins
from app.routers import orders

from app.routers import invoice

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trendz Shop API", version="1.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # ✅ your Next.js dev URL
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,  # ✅ needed for cookies/session
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(products.router)


app.include_router(invoice.router)

app.include_router(admins.router)


app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "Trendz Shop API running successfully!"}


