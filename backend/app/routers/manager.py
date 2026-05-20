"""
Manager module routes — Customer CRUD, View Products/Orders/Stock/Delivery/Payments,
Generate Invoices, View Follow-ups, View Alerts (verified only).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from decimal import Decimal

from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
from app.models.customer import Customer
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.order import Order
from app.models.stock import Stock
from app.models.delivery import Delivery
from app.models.payment import Payment
from app.models.follow_up import FollowUp
from app.models.alert import Alert
from app.models.invoice import Invoice
from app.schemas import (
    CustomerCreate, CustomerUpdate, CustomerOut,
    ProductOut, OrderOut, StockOut, DeliveryOut,
    PaymentCreate, PaymentUpdate, PaymentOut,
    InvoiceCreate, InvoiceOut,
    FollowUpOut, AlertOut,
)

router = APIRouter(prefix="/api/manager", tags=["Manager Module"])
mgr_dep = require_role("manager")


# ════════════════════════════════════════════════════════════════════
#  ADD / DELETE CUSTOMER (CRUD)
# ════════════════════════════════════════════════════════════════════

@router.post("/customers")
def create_customer(req: CustomerCreate, db: Session = Depends(get_db), user: User = Depends(mgr_dep)):
    c = Customer(**req.model_dump(), added_by=user.user_id)
    db.add(c); db.commit(); db.refresh(c)
    return {"success": True, "cust_id": c.cust_id}


@router.get("/customers")
def list_customers(db: Session = Depends(get_db), _=Depends(mgr_dep)):
    rows = db.query(Customer).all()
    return {"customers": [CustomerOut.from_orm(r) for r in rows]}


@router.get("/customers/{cust_id}")
def get_customer(cust_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    c = db.query(Customer).filter(Customer.cust_id == cust_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    return CustomerOut.from_orm(c)


@router.put("/customers/{cust_id}")
def update_customer(cust_id: int, req: CustomerUpdate, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    c = db.query(Customer).filter(Customer.cust_id == cust_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(c, k, v)
    db.commit()
    return {"success": True, "message": "Customer updated"}


@router.delete("/customers/{cust_id}")
def delete_customer(cust_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    c = db.query(Customer).filter(Customer.cust_id == cust_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    c.status = "inactive"
    db.commit()
    return {"success": True, "message": "Customer deactivated"}


# ════════════════════════════════════════════════════════════════════
#  VIEW PRODUCTS (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/products")
def list_products(db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
def get_product(product_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
#  VIEW ORDERS (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/orders")
def list_orders(db: Session = Depends(get_db), _=Depends(mgr_dep)):
    rows = (
        db.query(Order, Customer.customer_name, Product.product_name)
        .outerjoin(Customer, Order.cust_id == Customer.cust_id)
        .outerjoin(Product, Order.product_id == Product.product_id)
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
def get_order(order_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
#  VIEW STOCK (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/stock")
def list_stock(db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
def get_stock(stock_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    row = (
        db.query(Stock, Product.product_name)
        .outerjoin(Product, Stock.product_id == Product.product_id)
        .filter(Stock.stock_id == stock_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Stock not found")
    s, pname = row
    d = StockOut.from_orm(s).model_dump()
    d["product_name"] = pname
    return d


# ════════════════════════════════════════════════════════════════════
#  VIEW DELIVERY (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/deliveries")
def list_deliveries(db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
def get_delivery(delivery_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
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


# ════════════════════════════════════════════════════════════════════
#  PAYMENTS — Manager can CREATE and UPDATE
# ════════════════════════════════════════════════════════════════════

@router.post("/payments")
def create_payment(req: PaymentCreate, db: Session = Depends(get_db), user: User = Depends(mgr_dep)):
    """Manager creates a new payment record."""
    # Validate order exists
    order = db.query(Order).filter(Order.order_id == req.order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.cust_id == req.cust_id).first()
    if not customer:
        raise HTTPException(404, "Customer not found")
    p = Payment(
        order_id=req.order_id,
        cust_id=req.cust_id,
        inv_id=req.inv_id,
        amount=req.amount,
        payment_method=req.payment_method,
        payment_status=req.payment_status or "pending",
        payment_date=req.payment_date,
        remarks=req.remarks,
    )
    db.add(p); db.commit(); db.refresh(p)
    return {"success": True, "payment_id": p.payment_id}


@router.get("/payments")
def list_payments(db: Session = Depends(get_db), _=Depends(mgr_dep)):
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
def get_payment(payment_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
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


@router.put("/payments/{payment_id}")
def update_payment(payment_id: int, req: PaymentUpdate, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    """Manager updates payment status and details."""
    p = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not p:
        raise HTTPException(404, "Payment not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(p, k, v)
    db.commit()
    return {"success": True, "message": "Payment updated"}


# ════════════════════════════════════════════════════════════════════
#  GENERATE INVOICE
# ════════════════════════════════════════════════════════════════════

@router.post("/invoices")
def generate_invoice(req: InvoiceCreate, db: Session = Depends(get_db), user: User = Depends(mgr_dep)):
    """Generate a new invoice from an order, calculating tax and totals."""
    order = db.query(Order).filter(Order.order_id == req.order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")

    product = db.query(Product).filter(Product.product_id == order.product_id).first()
    if not product:
        raise HTTPException(404, "Product not found for this order")

    # Calculate amounts
    total_amount = Decimal(str(product.price)) * order.quantity
    tax_amount = (total_amount * Decimal(str(req.tax_percent))) / Decimal("100")
    final_amount = total_amount + tax_amount

    # Generate invoice number: INV-YYYYMMDD-XXX
    today = date.today()
    count = db.query(Invoice).filter(Invoice.invoice_date == today).count()
    invoice_number = f"INV-{today.strftime('%Y%m%d')}-{count + 1:03d}"

    invoice = Invoice(
        order_id=req.order_id,
        cust_id=req.cust_id,
        payment_id=req.payment_id,
        invoice_number=invoice_number,
        invoice_date=today,
        total_amount=total_amount,
        tax_amount=tax_amount,
        final_amount=final_amount,
        invoice_status="issued",
        generated_by=user.user_id,
    )
    db.add(invoice); db.commit(); db.refresh(invoice)
    return {
        "success": True,
        "inv_id": invoice.inv_id,
        "invoice_number": invoice.invoice_number,
        "total_amount": float(total_amount),
        "tax_amount": float(tax_amount),
        "final_amount": float(final_amount),
    }


@router.get("/invoices")
def list_invoices(db: Session = Depends(get_db), _=Depends(mgr_dep)):
    rows = (
        db.query(Invoice, Customer.customer_name)
        .outerjoin(Customer, Invoice.cust_id == Customer.cust_id)
        .all()
    )
    result = []
    for inv, cname in rows:
        d = InvoiceOut.from_orm(inv).model_dump()
        d["customer_name"] = cname
        result.append(d)
    return {"invoices": result}


@router.get("/invoices/{inv_id}")
def get_invoice(inv_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    row = (
        db.query(Invoice, Customer.customer_name)
        .outerjoin(Customer, Invoice.cust_id == Customer.cust_id)
        .filter(Invoice.inv_id == inv_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Invoice not found")
    inv, cname = row
    d = InvoiceOut.from_orm(inv).model_dump()
    d["customer_name"] = cname
    return d


# ════════════════════════════════════════════════════════════════════
#  VIEW FOLLOW-UPS (Read-Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/follow-ups")
def list_follow_ups(db: Session = Depends(get_db), _=Depends(mgr_dep)):
    rows = (
        db.query(FollowUp, Customer.customer_name)
        .outerjoin(Customer, FollowUp.cust_id == Customer.cust_id)
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
def get_follow_up(followup_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
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


# ════════════════════════════════════════════════════════════════════
#  VIEW ALERTS (Verified / Forwarded Only)
# ════════════════════════════════════════════════════════════════════

@router.get("/alerts")
def list_alerts(db: Session = Depends(get_db), _=Depends(mgr_dep)):
    rows = (
        db.query(Alert, User.name)
        .outerjoin(User, Alert.verified_by == User.user_id)
        .filter(Alert.alert_status.in_(["verified", "forwarded"]))
        .all()
    )
    result = []
    for a, vname in rows:
        d = AlertOut.from_orm(a).model_dump()
        d["verified_by_name"] = vname
        result.append(d)
    return {"alerts": result}


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: int, db: Session = Depends(get_db), _=Depends(mgr_dep)):
    a = db.query(Alert).filter(Alert.alert_id == alert_id).first()
    if not a:
        raise HTTPException(404, "Alert not found")
    return AlertOut.from_orm(a)
