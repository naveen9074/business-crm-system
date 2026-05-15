"""
Employee module routes — View Customers, Add Order, Update Stock,
View/Update Delivery, Set Preference, Verify Alert, Add Product, Manage Follow-up.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
from app.models.customer import Customer
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.order import Order
from app.models.stock import Stock
from app.models.delivery import Delivery
from app.models.follow_up import FollowUp
from app.models.web_scraping import WebScrapingPreference
from app.models.alert import Alert
from app.models.audit_log import AuditLog
from app.schemas import (
    CustomerOut,
    ProductCreate, ProductOut,
    OrderCreate, OrderOut,
    StockUpdate, StockOut,
    DeliveryUpdate, DeliveryOut,
    PreferenceCreate, PreferenceOut,
    AlertUpdate, AlertOut,
    FollowUpCreate, FollowUpUpdate, FollowUpOut,
)

router = APIRouter(prefix="/api/employee", tags=["Employee Module"])
emp_dep = require_role("employee")


# ════════════════════════════════════════════════════════════════════
#  VIEW CUSTOMERS (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/customers")
def list_customers(db: Session = Depends(get_db), _=Depends(emp_dep)):
    rows = db.query(Customer).all()
    return {"customers": [CustomerOut.from_orm(r) for r in rows]}


@router.get("/customers/{cust_id}")
def get_customer(cust_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    c = db.query(Customer).filter(Customer.cust_id == cust_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    return CustomerOut.from_orm(c)


# ════════════════════════════════════════════════════════════════════
#  ADD ORDER
# ════════════════════════════════════════════════════════════════════

@router.post("/orders")
def create_order(req: OrderCreate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    o = Order(
        cust_id=req.cust_id,
        product_id=req.product_id,
        sup_id=req.sup_id,
        quantity=req.quantity,
        order_date=req.order_date or date.today(),
        order_status="pending",
        created_by=user.user_id,
    )
    db.add(o); db.commit(); db.refresh(o)

    # Also create a delivery record for this order
    customer = db.query(Customer).filter(Customer.cust_id == req.cust_id).first()
    from app.models.delivery import Delivery as DeliveryModel
    delivery = DeliveryModel(
        order_id=o.order_id,
        cust_id=req.cust_id,
        delivery_address=customer.address if customer else None,
        delivery_status="pending",
    )
    db.add(delivery); db.commit()

    return {"success": True, "order_id": o.order_id}


@router.get("/orders")
def list_orders(db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    rows = (
        db.query(Order, Customer.customer_name, Product.product_name)
        .outerjoin(Customer, Order.cust_id == Customer.cust_id)
        .outerjoin(Product, Order.product_id == Product.product_id)
        .filter(Order.created_by == user.user_id)
        .all()
    )
    result = []
    for o, cname, pname in rows:
        d = OrderOut.from_orm(o).model_dump()
        d["customer_name"] = cname
        d["product_name"] = pname
        result.append(d)
    return {"orders": result}


@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    row = (
        db.query(Order, Customer.customer_name, Product.product_name)
        .outerjoin(Customer, Order.cust_id == Customer.cust_id)
        .outerjoin(Product, Order.product_id == Product.product_id)
        .filter(Order.order_id == order_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Order not found")
    o, cname, pname = row
    d = OrderOut.from_orm(o).model_dump()
    d["customer_name"] = cname
    d["product_name"] = pname
    return d


# ════════════════════════════════════════════════════════════════════
#  UPDATE STOCK
# ════════════════════════════════════════════════════════════════════

@router.get("/stock")
def list_stock(db: Session = Depends(get_db), _=Depends(emp_dep)):
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


@router.put("/stock/{stock_id}")
def update_stock(stock_id: int, req: StockUpdate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    s = db.query(Stock).filter(Stock.stock_id == stock_id).first()
    if not s:
        raise HTTPException(404, "Stock not found")

    s.quantity_available = req.quantity_available
    if req.minimum_stock_level is not None:
        s.minimum_stock_level = req.minimum_stock_level

    # Auto-calculate stock status
    if s.quantity_available == 0:
        s.stock_status = "out_of_stock"
    elif s.quantity_available <= s.minimum_stock_level:
        s.stock_status = "low_stock"
    else:
        s.stock_status = "in_stock"

    s.last_updated_by = user.user_id
    db.commit()

    # Audit log
    audit = AuditLog(
        user_id=user.user_id,
        action="UPDATED",
        module_name="Stock",
        description=f"Updated stock_id={stock_id}, qty={req.quantity_available}, status={s.stock_status}",
    )
    db.add(audit); db.commit()

    return {"success": True, "message": "Stock updated", "stock_status": s.stock_status}


# ════════════════════════════════════════════════════════════════════
#  VIEW / UPDATE DELIVERY
# ════════════════════════════════════════════════════════════════════

@router.get("/deliveries")
def list_deliveries(db: Session = Depends(get_db), _=Depends(emp_dep)):
    rows = (
        db.query(Delivery, Customer.customer_name)
        .outerjoin(Customer, Delivery.cust_id == Customer.cust_id)
        .all()
    )
    result = []
    for d_obj, cname in rows:
        d = DeliveryOut.from_orm(d_obj).model_dump()
        d["customer_name"] = cname
        result.append(d)
    return {"deliveries": result}


@router.get("/deliveries/{delivery_id}")
def get_delivery(delivery_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    row = (
        db.query(Delivery, Customer.customer_name)
        .outerjoin(Customer, Delivery.cust_id == Customer.cust_id)
        .filter(Delivery.delivery_id == delivery_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Delivery not found")
    d_obj, cname = row
    d = DeliveryOut.from_orm(d_obj).model_dump()
    d["customer_name"] = cname
    return d


@router.put("/deliveries/{delivery_id}")
def update_delivery(delivery_id: int, req: DeliveryUpdate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    d = db.query(Delivery).filter(Delivery.delivery_id == delivery_id).first()
    if not d:
        raise HTTPException(404, "Delivery not found")
    d.delivery_status = req.delivery_status
    d.updated_by = user.user_id
    db.commit()

    # If delivered, also update the order status
    if req.delivery_status == "delivered":
        order = db.query(Order).filter(Order.order_id == d.order_id).first()
        if order:
            order.order_status = "delivered"
            db.commit()

    return {"success": True, "message": "Delivery status updated"}


# ════════════════════════════════════════════════════════════════════
#  SET PREFERENCE (Web Scraping)
# ════════════════════════════════════════════════════════════════════

@router.post("/preferences")
def create_preference(req: PreferenceCreate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    pref = WebScrapingPreference(
        emp_id=user.user_id,
        website_url=req.website_url,
        keyword=req.keyword,
        category=req.category,
        preference_status="active",
    )
    db.add(pref); db.commit(); db.refresh(pref)
    return {"success": True, "preference_id": pref.preference_id}


@router.get("/preferences")
def list_preferences(db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    rows = db.query(WebScrapingPreference).filter(WebScrapingPreference.emp_id == user.user_id).all()
    return {"preferences": [PreferenceOut.from_orm(r) for r in rows]}


@router.delete("/preferences/{preference_id}")
def delete_preference(preference_id: int, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    p = db.query(WebScrapingPreference).filter(
        WebScrapingPreference.preference_id == preference_id,
        WebScrapingPreference.emp_id == user.user_id,
    ).first()
    if not p:
        raise HTTPException(404, "Preference not found")
    p.preference_status = "inactive"
    db.commit()
    return {"success": True, "message": "Preference deactivated"}


# ════════════════════════════════════════════════════════════════════
#  VERIFY ALERT
# ════════════════════════════════════════════════════════════════════

@router.get("/alerts")
def list_alerts(db: Session = Depends(get_db), _=Depends(emp_dep)):
    """Employee sees ONLY pending alerts."""
    rows = db.query(Alert).filter(Alert.alert_status == "pending").all()
    return {"alerts": [AlertOut.from_orm(r) for r in rows]}


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    a = db.query(Alert).filter(Alert.alert_id == alert_id).first()
    if not a:
        raise HTTPException(404, "Alert not found")
    return AlertOut.from_orm(a)


@router.put("/alerts/{alert_id}")
def verify_alert(alert_id: int, req: AlertUpdate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    a = db.query(Alert).filter(Alert.alert_id == alert_id).first()
    if not a:
        raise HTTPException(404, "Alert not found")
    a.alert_status = req.alert_status
    a.verified_by = user.user_id
    if req.alert_status == "verified":
        a.forwarded_to_manager = True
    db.commit()
    return {"success": True, "message": f"Alert {req.alert_status}"}


# ════════════════════════════════════════════════════════════════════
#  ADD PRODUCT
# ════════════════════════════════════════════════════════════════════

@router.post("/products")
def create_product(req: ProductCreate, db: Session = Depends(get_db), _=Depends(emp_dep)):
    p = Product(**req.model_dump())
    db.add(p); db.commit(); db.refresh(p)

    # Also create a stock entry for this product
    stock = Stock(product_id=p.product_id, quantity_available=0, minimum_stock_level=10, stock_status="out_of_stock")
    db.add(stock); db.commit()

    return {"success": True, "product_id": p.product_id}


@router.get("/products")
def list_products(db: Session = Depends(get_db), _=Depends(emp_dep)):
    rows = (
        db.query(Product, Supplier.supplier_name)
        .outerjoin(Supplier, Product.sup_id == Supplier.sup_id)
        .all()
    )
    result = []
    for p, sname in rows:
        d = ProductOut.from_orm(p).model_dump()
        d["supplier_name"] = sname
        result.append(d)
    return {"products": result}


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    row = (
        db.query(Product, Supplier.supplier_name)
        .outerjoin(Supplier, Product.sup_id == Supplier.sup_id)
        .filter(Product.product_id == product_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Product not found")
    p, sname = row
    d = ProductOut.from_orm(p).model_dump()
    d["supplier_name"] = sname
    return d


# ════════════════════════════════════════════════════════════════════
#  MANAGE FOLLOW-UP
# ════════════════════════════════════════════════════════════════════

@router.post("/follow-ups")
def create_follow_up(req: FollowUpCreate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    f = FollowUp(
        cust_id=req.cust_id,
        assigned_to=user.user_id,
        follow_up_date=req.follow_up_date,
        follow_up_note=req.follow_up_note,
        status="pending",
        alert_follow_up=False,
    )
    db.add(f); db.commit(); db.refresh(f)
    return {"success": True, "followup_id": f.followup_id}


@router.get("/follow-ups")
def list_follow_ups(db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    rows = (
        db.query(FollowUp, Customer.customer_name)
        .outerjoin(Customer, FollowUp.cust_id == Customer.cust_id)
        .filter(FollowUp.assigned_to == user.user_id)
        .order_by(FollowUp.follow_up_date)
        .all()
    )
    result = []
    for f, cname in rows:
        d = FollowUpOut.from_orm(f).model_dump()
        d["customer_name"] = cname
        result.append(d)
    return {"follow_ups": result}


@router.get("/follow-ups/{followup_id}")
def get_follow_up(followup_id: int, db: Session = Depends(get_db), _=Depends(emp_dep)):
    row = (
        db.query(FollowUp, Customer.customer_name)
        .outerjoin(Customer, FollowUp.cust_id == Customer.cust_id)
        .filter(FollowUp.followup_id == followup_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Follow-up not found")
    f, cname = row
    d = FollowUpOut.from_orm(f).model_dump()
    d["customer_name"] = cname
    return d


@router.put("/follow-ups/{followup_id}")
def update_follow_up(followup_id: int, req: FollowUpUpdate, db: Session = Depends(get_db), user: User = Depends(emp_dep)):
    f = db.query(FollowUp).filter(FollowUp.followup_id == followup_id, FollowUp.assigned_to == user.user_id).first()
    if not f:
        raise HTTPException(404, "Follow-up not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(f, k, v)
    db.commit()
    return {"success": True, "message": "Follow-up updated"}
