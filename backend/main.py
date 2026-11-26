from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.asset_routes import router as asset_router

app = FastAPI(
    title="AI Asset Management System",
    description="AI-Based Employee Asset Request Management",
    version="1.0.0"
)
app.include_router(asset_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "message": "AI Asset Management API is running"
    }