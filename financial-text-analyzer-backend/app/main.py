from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze_route import router as analyze_router

app = FastAPI(
    title="ML API",
    description="A FastAPI app to serve ML model predictions.",
    version="1.0.0"
)

# CORS configuration (edit origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Welcome to the ML API"}