"""
Authentication routes — register, login, logout, profile.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.login_log import LoginLog
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.utils import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user with hashed password."""
    # Check unique username
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    # Check unique email
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    # Validate role
    if req.role not in ("admin", "manager", "employee"):
        raise HTTPException(status_code=400, detail="Invalid role. Must be admin, manager, or employee")

    user = User(
        name=req.name,
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role,
        phone=req.phone,
        status="active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True, "message": "Registration successful", "user_id": user.user_id}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user, generate JWT, and log the session."""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status == "deactivated":
        raise HTTPException(status_code=403, detail="Account has been deactivated")

    token = create_access_token({"user_id": user.user_id, "role": user.role})

    # Log the login
    log = LoginLog(
        user_id=user.user_id,
        username=user.username,
        role=user.role,
        login_time=datetime.utcnow(),
        status="logged_in",
    )
    db.add(log)
    db.commit()

    return TokenResponse(
        success=True,
        token=token,
        user_id=user.user_id,
        role=user.role,
        name=user.name,
    )


@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log out user — update their latest login_log entry."""
    log = (
        db.query(LoginLog)
        .filter(LoginLog.user_id == current_user.user_id, LoginLog.status == "logged_in")
        .order_by(LoginLog.login_time.desc())
        .first()
    )
    if log:
        log.logout_time = datetime.utcnow()
        log.status = "logged_out"
        db.commit()
    return {"success": True, "message": "Logged out successfully"}


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    """Return authenticated user's profile."""
    return current_user
