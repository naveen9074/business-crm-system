"""
Admin module routes — Manage Managers, Employees, Customers (view), Suppliers,
Import Equipment, Stock (view), Payments (view), User Approvals.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.import_equipment import ImportEquipment
from app.models.stock import Stock
from app.models.product import Product
from app.models.payment import Payment
from app.models.invoice import Invoice
from app.models.notification import Notification
from app.schemas import (
    UserCreate, UserUpdate, UserOut, PendingUserOut,
    CustomerOut,
    SupplierCreate, SupplierUpdate, SupplierOut,
    ImportEquipmentCreate, ImportEquipmentUpdate, ImportEquipmentOut,
    StockOut, PaymentOut,
)
from app.utils import hash_password
from app.dependencies import require_role, get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin Module"])
admin_dep = require_role("admin")


# ════════════════════════════════════════════════════════════════════
#  USER APPROVAL MANAGEMENT
# ════════════════════════════════════════════════════════════════════

@router.get("/pending-users")
def list_pending_users(db: Session = Depends(get_db), _=Depends(admin_dep)):
    """Get all users with status='pending' awaiting admin approval."""
    rows = db.query(User).filter(User.status == "pending").all()
    return {"pending_users": [PendingUserOut.from_orm(r) for r in rows]}


@router.put("/users/{user_id}/approve")
def approve_user(user_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    """Approve a pending manager or employee — set status to active."""
    u = db.query(User).filter(User.user_id == user_id).first()
    if not u:
        raise HTTPException(404, "User not found")
    if u.role == "admin":
        raise HTTPException(400, "Cannot modify admin accounts via this endpoint")
    u.status = "active"
    db.commit()
    return {"success": True, "message": f"{u.name} approved successfully"}


@router.put("/users/{user_id}/reject")
def reject_user(user_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    """Reject a pending user — set status to rejected."""
    u = db.query(User).filter(User.user_id == user_id).first()
    if not u:
        raise HTTPException(404, "User not found")
    if u.role == "admin":
        raise HTTPException(400, "Cannot modify admin accounts via this endpoint")
    u.status = "rejected"
    db.commit()
    return {"success": True, "message": f"{u.name} rejected"}


@router.put("/users/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    """Deactivate an active user."""
    u = db.query(User).filter(User.user_id == user_id).first()
    if not u:
        raise HTTPException(404, "User not found")
    if u.role == "admin":
        raise HTTPException(400, "Cannot modify admin accounts via this endpoint")
    u.status = "deactivated"
    db.commit()
    return {"success": True, "message": f"{u.name} deactivated"}


# ════════════════════════════════════════════════════════════════════
#  MANAGE MANAGERS
# ════════════════════════════════════════════════════════════════════

@router.post("/managers")
def create_manager(req: UserCreate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(400, "Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(400, "Email already exists")
    user = User(
        name=req.name, username=req.username, email=req.email,
        password_hash=hash_password(req.password), role="manager",
        phone=req.phone, status="active",
    )
    db.add(user); db.commit(); db.refresh(user)
    return {"success": True, "manager_id": user.user_id}


@router.get("/managers")
def list_managers(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = db.query(User).filter(
        User.role == "manager",
        User.status.in_(["active", "inactive", "deactivated"])
    ).all()
    return {"managers": [UserOut.from_orm(r) for r in rows]}


@router.get("/managers/{manager_id}")
def get_manager(manager_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == manager_id, User.role == "manager").first()
    if not u:
        raise HTTPException(404, "Manager not found")
    return UserOut.from_orm(u)


@router.put("/managers/{manager_id}")
def update_manager(manager_id: int, req: UserUpdate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == manager_id, User.role == "manager").first()
    if not u:
        raise HTTPException(404, "Manager not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(u, k, v)
    db.commit()
    return {"success": True, "message": "Manager updated"}


@router.delete("/managers/{manager_id}")
def delete_manager(manager_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == manager_id, User.role == "manager").first()
    if not u:
        raise HTTPException(404, "Manager not found")
    u.status = "deactivated"
    db.commit()
    return {"success": True, "message": "Manager deactivated"}


# ════════════════════════════════════════════════════════════════════
#  MANAGE EMPLOYEES
# ════════════════════════════════════════════════════════════════════

@router.post("/employees")
def create_employee(req: UserCreate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(400, "Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(400, "Email already exists")
    user = User(
        name=req.name, username=req.username, email=req.email,
        password_hash=hash_password(req.password), role="employee",
        phone=req.phone, status="active",
    )
    db.add(user); db.commit(); db.refresh(user)
    return {"success": True, "emp_id": user.user_id}


@router.get("/employees")
def list_employees(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = db.query(User).filter(
        User.role == "employee",
        User.status.in_(["active", "inactive", "deactivated"])
    ).all()
    return {"employees": [UserOut.from_orm(r) for r in rows]}


@router.get("/employees/{emp_id}")
def get_employee(emp_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == emp_id, User.role == "employee").first()
    if not u:
        raise HTTPException(404, "Employee not found")
    return UserOut.from_orm(u)


@router.put("/employees/{emp_id}")
def update_employee(emp_id: int, req: UserUpdate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == emp_id, User.role == "employee").first()
    if not u:
        raise HTTPException(404, "Employee not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(u, k, v)
    db.commit()
    return {"success": True, "message": "Employee updated"}


@router.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    u = db.query(User).filter(User.user_id == emp_id, User.role == "employee").first()
    if not u:
        raise HTTPException(404, "Employee not found")
    u.status = "deactivated"
    db.commit()
    return {"success": True, "message": "Employee deactivated"}


# ════════════════════════════════════════════════════════════════════
#  VIEW CUSTOMERS (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/customers")
def list_customers(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = db.query(Customer).all()
    return {"customers": [CustomerOut.from_orm(r) for r in rows]}


@router.get("/customers/{cust_id}")
def get_customer(cust_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    c = db.query(Customer).filter(Customer.cust_id == cust_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    return CustomerOut.from_orm(c)


# ════════════════════════════════════════════════════════════════════
#  MANAGE SUPPLIERS (CRUD)
# ════════════════════════════════════════════════════════════════════

@router.post("/suppliers")
def create_supplier(req: SupplierCreate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    s = Supplier(**req.model_dump())
    db.add(s); db.commit(); db.refresh(s)
    return {"success": True, "sup_id": s.sup_id}


@router.get("/suppliers")
def list_suppliers(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = db.query(Supplier).all()
    return {"suppliers": [SupplierOut.from_orm(r) for r in rows]}


@router.get("/suppliers/{sup_id}")
def get_supplier(sup_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    s = db.query(Supplier).filter(Supplier.sup_id == sup_id).first()
    if not s:
        raise HTTPException(404, "Supplier not found")
    return SupplierOut.from_orm(s)


@router.put("/suppliers/{sup_id}")
def update_supplier(sup_id: int, req: SupplierUpdate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    s = db.query(Supplier).filter(Supplier.sup_id == sup_id).first()
    if not s:
        raise HTTPException(404, "Supplier not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(s, k, v)
    db.commit()
    return {"success": True, "message": "Supplier updated"}


@router.delete("/suppliers/{sup_id}")
def delete_supplier(sup_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    s = db.query(Supplier).filter(Supplier.sup_id == sup_id).first()
    if not s:
        raise HTTPException(404, "Supplier not found")
    s.status = "inactive"
    db.commit()
    return {"success": True, "message": "Supplier deactivated"}


# ════════════════════════════════════════════════════════════════════
#  MANAGE IMPORT EQUIPMENT (CRUD)
# ════════════════════════════════════════════════════════════════════

@router.post("/import-equipment")
def create_import_equipment(req: ImportEquipmentCreate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    ie = ImportEquipment(**req.model_dump())
    db.add(ie); db.commit(); db.refresh(ie)
    return {"success": True, "imp_id": ie.imp_id}


@router.get("/import-equipment")
def list_import_equipment(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = (
        db.query(ImportEquipment, Supplier.supplier_name)
        .outerjoin(Supplier, ImportEquipment.sup_id == Supplier.sup_id)
        .all()
    )
    result = []
    for ie, sname in rows:
        d = ImportEquipmentOut.from_orm(ie).model_dump()
        d["supplier_name"] = sname
        result.append(d)
    return {"equipment": result}


@router.get("/import-equipment/{imp_id}")
def get_import_equipment(imp_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    ie = db.query(ImportEquipment).filter(ImportEquipment.imp_id == imp_id).first()
    if not ie:
        raise HTTPException(404, "Import equipment not found")
    return ImportEquipmentOut.from_orm(ie)


@router.put("/import-equipment/{imp_id}")
def update_import_equipment(imp_id: int, req: ImportEquipmentUpdate, db: Session = Depends(get_db), _=Depends(admin_dep)):
    ie = db.query(ImportEquipment).filter(ImportEquipment.imp_id == imp_id).first()
    if not ie:
        raise HTTPException(404, "Import equipment not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(ie, k, v)
    db.commit()
    return {"success": True, "message": "Import equipment updated"}


@router.delete("/import-equipment/{imp_id}")
def delete_import_equipment(imp_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    ie = db.query(ImportEquipment).filter(ImportEquipment.imp_id == imp_id).first()
    if not ie:
        raise HTTPException(404, "Import equipment not found")
    ie.import_status = "pending"  # soft-delete behaviour
    db.commit()
    return {"success": True, "message": "Import equipment removed"}


# ════════════════════════════════════════════════════════════════════
#  VIEW STOCK (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/stock")
def list_stock(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = (
        db.query(Stock, Product.product_name)
        .outerjoin(Product, Stock.product_id == Product.product_id)
        .all()
    )
    result = []
    for s, pname in rows:
        d = StockOut.from_orm(s).model_dump()
        d["product_name"] = pname
        result.append(d)
    return {"stock": result}


@router.get("/stock/{stock_id}")
def get_stock(stock_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    row = (
        db.query(Stock, Product.product_name)
        .outerjoin(Product, Stock.product_id == Product.product_id)
        .filter(Stock.stock_id == stock_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Stock record not found")
    s, pname = row
    d = StockOut.from_orm(s).model_dump()
    d["product_name"] = pname
    return d


# ════════════════════════════════════════════════════════════════════
#  VIEW PAYMENTS (Read-Only) + Send Reminder
# ════════════════════════════════════════════════════════════════════

@router.get("/payments")
def list_payments(db: Session = Depends(get_db), _=Depends(admin_dep)):
    rows = (
        db.query(Payment, Customer.customer_name, Invoice.invoice_number)
        .outerjoin(Customer, Payment.cust_id == Customer.cust_id)
        .outerjoin(Invoice, Payment.inv_id == Invoice.inv_id)
        .all()
    )
    result = []
    for p, cname, inv_num in rows:
        d = PaymentOut.from_orm(p).model_dump()
        d["customer_name"] = cname
        d["invoice_number"] = inv_num
        result.append(d)
    return {"payments": result}


@router.get("/payments/{payment_id}")
def get_payment(payment_id: int, db: Session = Depends(get_db), _=Depends(admin_dep)):
    row = (
        db.query(Payment, Customer.customer_name, Invoice.invoice_number)
        .outerjoin(Customer, Payment.cust_id == Customer.cust_id)
        .outerjoin(Invoice, Payment.inv_id == Invoice.inv_id)
        .filter(Payment.payment_id == payment_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Payment not found")
    p, cname, inv_num = row
    d = PaymentOut.from_orm(p).model_dump()
    d["customer_name"] = cname
    d["invoice_number"] = inv_num
    return d


@router.post("/payments/{payment_id}/send-reminder")
def send_payment_reminder(
    payment_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_dep),
):
    """Admin sends a payment reminder notification to all active managers."""
    row = (
        db.query(Payment, Customer.customer_name)
        .outerjoin(Customer, Payment.cust_id == Customer.cust_id)
        .filter(Payment.payment_id == payment_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Payment not found")
    p, cname = row

    # Find all active managers
    managers = db.query(User).filter(User.role == "manager", User.status == "active").all()
    if not managers:
        raise HTTPException(404, "No active managers found")

    title = f"Payment Reminder — Order #{p.order_id}"
    message = (
        f"Payment #{p.payment_id} for Order #{p.order_id}"
        + (f" ({cname})" if cname else "")
        + f" is still {p.payment_status}. Please review and update the payment status."
    )

    for mgr in managers:
        notif = Notification(
            sender_id=admin.user_id,
            receiver_id=mgr.user_id,
            receiver_role=None,
            title=title,
            message=message,
            module_name="Payments",
            notification_type="reminder",
            status="unread",
        )
        db.add(notif)
    db.commit()
    return {"success": True, "message": f"Reminder sent to {len(managers)} manager(s)"}
