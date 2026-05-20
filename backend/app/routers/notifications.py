"""
Notification routes — create, list, read, mark-all-read, delete notifications.
Role-based: Admin→Manager/Employee, Manager→Employee, Employee→view only.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas import NotificationCreate, NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.post("")
def create_notification(
    req: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a notification/reminder. Admin→any, Manager→employee only."""
    # Permission checks
    if current_user.role == "employee":
        raise HTTPException(403, "Employees cannot send notifications")

    if current_user.role == "manager" and req.receiver_role == "manager":
        raise HTTPException(403, "Managers can only send notifications to employees")

    if req.receiver_id:
        # Validate receiver exists
        receiver = db.query(User).filter(User.user_id == req.receiver_id).first()
        if not receiver:
            raise HTTPException(404, "Receiver user not found")
        if current_user.role == "manager" and receiver.role != "employee":
            raise HTTPException(403, "Managers can only send notifications to employees")

        notif = Notification(
            sender_id=current_user.user_id,
            receiver_id=req.receiver_id,
            receiver_role=None,
            title=req.title,
            message=req.message,
            module_name=req.module_name,
            notification_type=req.notification_type or "manual",
            status="unread",
        )
        db.add(notif)
        db.commit()
        return {"success": True, "message": "Notification sent successfully"}

    elif req.receiver_role:
        # Broadcast to all users of a role
        if req.receiver_role not in ("manager", "employee"):
            raise HTTPException(400, "receiver_role must be 'manager' or 'employee'")

        receivers = db.query(User).filter(
            User.role == req.receiver_role,
            User.status == "active",
        ).all()

        for recv in receivers:
            notif = Notification(
                sender_id=current_user.user_id,
                receiver_id=recv.user_id,
                receiver_role=req.receiver_role,
                title=req.title,
                message=req.message,
                module_name=req.module_name,
                notification_type=req.notification_type or "manual",
                status="unread",
            )
            db.add(notif)
        db.commit()
        return {"success": True, "message": f"Notification sent to all {req.receiver_role}s"}

    else:
        raise HTTPException(400, "Must specify either receiver_id or receiver_role")


@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all notifications for the current user, newest first."""
    rows = (
        db.query(Notification, User.name.label("sender_name"))
        .outerjoin(User, Notification.sender_id == User.user_id)
        .filter(Notification.receiver_id == current_user.user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    result = []
    for notif, sender_name in rows:
        d = NotificationOut.from_orm(notif).model_dump()
        d["sender_name"] = sender_name
        result.append(d)
    return {"notifications": result}


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get unread notification count for badge display."""
    count = (
        db.query(Notification)
        .filter(
            Notification.receiver_id == current_user.user_id,
            Notification.status == "unread",
        )
        .count()
    )
    return {"unread_count": count}


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a single notification as read."""
    notif = (
        db.query(Notification)
        .filter(
            Notification.notification_id == notification_id,
            Notification.receiver_id == current_user.user_id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(404, "Notification not found")
    notif.status = "read"
    notif.read_at = datetime.utcnow()
    db.commit()
    return {"success": True, "message": "Notification marked as read"}


@router.put("/mark-all-read")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all of current user's notifications as read."""
    db.query(Notification).filter(
        Notification.receiver_id == current_user.user_id,
        Notification.status == "unread",
    ).update({"status": "read", "read_at": datetime.utcnow()})
    db.commit()
    return {"success": True, "message": "All notifications marked as read"}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a notification."""
    notif = (
        db.query(Notification)
        .filter(
            Notification.notification_id == notification_id,
            Notification.receiver_id == current_user.user_id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(404, "Notification not found")
    db.delete(notif)
    db.commit()
    return {"success": True, "message": "Notification deleted"}


@router.get("/users-list")
def get_users_for_notification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get list of users the current user can send notifications to."""
    if current_user.role == "employee":
        raise HTTPException(403, "Employees cannot send notifications")

    if current_user.role == "admin":
        users = db.query(User).filter(
            User.role.in_(["manager", "employee"]),
            User.status == "active",
        ).all()
    elif current_user.role == "manager":
        users = db.query(User).filter(
            User.role == "employee",
            User.status == "active",
        ).all()
    else:
        users = []

    return {
        "users": [
            {
                "user_id": u.user_id,
                "name": u.name,
                "username": u.username,
                "role": u.role,
            }
            for u in users
        ]
    }
