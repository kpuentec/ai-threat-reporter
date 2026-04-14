from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router
from contextlib import asynccontextmanager
from services.db_service import init_db, close_db
from config import FRONTEND_ORIGIN

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()
 
app = FastAPI(
    title="AI Cyber Threat Reporter API",
    version="2.0",
    lifespan=lifespan,
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
app.include_router(router)
 
@app.get("/")
def root():
    return {"message": "AI Threat Reporter API v2 is running."}
 
@app.get("/health")
def health():
    return {"status": "ok"}