"""
Business CRM System — FastAPI application entry point.
Creates tables, seeds demo data, and registers all module routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import Base, engine

# Import all models so SQLAlchemy discovers them
import app.models  # noqa: F401

# Routers
from app.routers import auth, admin, manager, employee, system, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """On startup: create tables and seed initial admin user."""
    try:
        Base.metadata.create_all(bind=engine)
        _seed_demo_data()
    except Exception as e:
        import logging
        logging.getLogger("uvicorn").warning(
            f"[Startup] DB connection failed: {e}\n"
            "The app will start — DB-dependent endpoints will return 500 until the DB is available."
        )
    yield


def _seed_demo_data():
    """Create a default admin account on first run."""
    from app.database import SessionLocal
    from app.models.user import User
    from app.utils import hash_password

    db = SessionLocal()
    try:
        # Seed admin user
        if not db.query(User).filter(User.username == "admin").first():
            admin_user = User(
                name="System Admin",
                username="admin",
                email="admin@crms.com",
                password_hash=hash_password("admin123"),
                role="admin",
                phone="9999999999",
                status="active",
            )
            db.add(admin_user)

        # Seed a demo manager
        if not db.query(User).filter(User.username == "manager1").first():
            mgr = User(
                name="Demo Manager",
                username="manager1",
                email="manager@crms.com",
                password_hash=hash_password("manager123"),
                role="manager",
                phone="8888888888",
                status="active",
            )
            db.add(mgr)

        # Seed a demo employee
        if not db.query(User).filter(User.username == "employee1").first():
            emp = User(
                name="Demo Employee",
                username="employee1",
                email="employee@crms.com",
                password_hash=hash_password("employee123"),
                role="employee",
                phone="7777777777",
                status="active",
            )
            db.add(emp)

        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


app = FastAPI(
    title=settings.APP_NAME,
    description="Business CRM System — DFD-Aligned REST API with Admin, Manager, Employee Modules",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(manager.router)
app.include_router(employee.router)
app.include_router(system.router)
app.include_router(notifications.router)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0"}
