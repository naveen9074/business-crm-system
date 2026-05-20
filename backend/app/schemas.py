"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


# ── Auth ─────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    role: str  # admin, manager, employee
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    success: bool
    token: str
    user_id: int
    role: str
    name: str

class UserOut(BaseModel):
    user_id: int
    name: str
    username: str
    email: str
    role: str
    phone: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[str] = None

class PendingUserOut(BaseModel):
    user_id: int
    name: str
    username: str
    email: str
    role: str
    phone: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Customer ─────────────────────────────────────────────────────────
class CustomerCreate(BaseModel):
    customer_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    organization_name: Optional[str] = None
    customer_type: Optional[str] = None

class CustomerUpdate(BaseModel):
    customer_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    organization_name: Optional[str] = None
    customer_type: Optional[str] = None
    status: Optional[str] = None

class CustomerOut(BaseModel):
    cust_id: int
    customer_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    organization_name: Optional[str] = None
    customer_type: Optional[str] = None
    added_by: Optional[int] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Supplier ─────────────────────────────────────────────────────────
class SupplierCreate(BaseModel):
    supplier_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company_name: Optional[str] = None

class SupplierUpdate(BaseModel):
    supplier_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company_name: Optional[str] = None
    status: Optional[str] = None

class SupplierOut(BaseModel):
    sup_id: int
    supplier_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    company_name: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Product ──────────────────────────────────────────────────────────
class ProductCreate(BaseModel):
    product_name: str
    category: Optional[str] = None
    description: Optional[str] = None
    price: float = 0
    sup_id: Optional[int] = None

class ProductOut(BaseModel):
    product_id: int
    product_name: str
    category: Optional[str] = None
    description: Optional[str] = None
    price: float = 0
    sup_id: Optional[int] = None
    supplier_name: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Order ────────────────────────────────────────────────────────────
class OrderCreate(BaseModel):
    cust_id: int
    product_id: int
    sup_id: Optional[int] = None
    quantity: int = 1
    order_date: Optional[date] = None

class OrderOut(BaseModel):
    order_id: int
    cust_id: int
    customer_name: Optional[str] = None
    product_id: int
    product_name: Optional[str] = None
    sup_id: Optional[int] = None
    quantity: int
    order_status: Optional[str] = None
    order_date: Optional[date] = None
    created_by: Optional[int] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Stock ────────────────────────────────────────────────────────────
class StockUpdate(BaseModel):
    quantity_available: int
    minimum_stock_level: Optional[int] = None

class StockOut(BaseModel):
    stock_id: int
    product_id: int
    product_name: Optional[str] = None
    quantity_available: int
    minimum_stock_level: int
    stock_status: Optional[str] = None
    last_updated_by: Optional[int] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Delivery ─────────────────────────────────────────────────────────
class DeliveryCreate(BaseModel):
    order_id: int
    cust_id: int
    delivery_address: Optional[str] = None
    delivery_date: Optional[date] = None
    delivery_status: Optional[str] = "pending"
    remarks: Optional[str] = None

class DeliveryUpdate(BaseModel):
    delivery_status: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_date: Optional[date] = None
    remarks: Optional[str] = None

class DeliveryOut(BaseModel):
    delivery_id: int
    order_id: int
    cust_id: int
    customer_name: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_date: Optional[date] = None
    delivery_status: Optional[str] = None
    updated_by: Optional[int] = None
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Payment ──────────────────────────────────────────────────────────
class PaymentCreate(BaseModel):
    order_id: int
    cust_id: int
    inv_id: Optional[int] = None
    amount: float = 0
    payment_method: Optional[str] = None
    payment_status: Optional[str] = "pending"
    payment_date: Optional[date] = None
    remarks: Optional[str] = None

class PaymentUpdate(BaseModel):
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    amount: Optional[float] = None
    payment_date: Optional[date] = None
    inv_id: Optional[int] = None
    remarks: Optional[str] = None

class PaymentOut(BaseModel):
    payment_id: int
    order_id: int
    inv_id: Optional[int] = None
    cust_id: int
    customer_name: Optional[str] = None
    invoice_number: Optional[str] = None
    amount: float = 0
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    payment_date: Optional[date] = None
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Invoice ──────────────────────────────────────────────────────────
class InvoiceCreate(BaseModel):
    order_id: int
    cust_id: int
    payment_id: Optional[int] = None
    tax_percent: float = 18.0

class InvoiceOut(BaseModel):
    inv_id: int
    order_id: int
    cust_id: int
    customer_name: Optional[str] = None
    payment_id: Optional[int] = None
    invoice_number: str
    invoice_date: Optional[date] = None
    total_amount: float = 0
    tax_amount: float = 0
    final_amount: float = 0
    invoice_status: Optional[str] = None
    generated_by: Optional[int] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Follow-up ────────────────────────────────────────────────────────
class FollowUpCreate(BaseModel):
    cust_id: int
    follow_up_date: date
    follow_up_note: Optional[str] = None

class FollowUpUpdate(BaseModel):
    follow_up_date: Optional[date] = None
    follow_up_note: Optional[str] = None
    status: Optional[str] = None

class FollowUpOut(BaseModel):
    followup_id: int
    cust_id: int
    customer_name: Optional[str] = None
    assigned_to: Optional[int] = None
    follow_up_date: Optional[date] = None
    follow_up_note: Optional[str] = None
    status: Optional[str] = None
    alert_follow_up: Optional[bool] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Web Scraping Preference ─────────────────────────────────────────
class PreferenceCreate(BaseModel):
    website_url: str
    keyword: str
    category: Optional[str] = None

class PreferenceOut(BaseModel):
    preference_id: int
    emp_id: int
    website_url: str
    keyword: str
    category: Optional[str] = None
    preference_status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Alert ────────────────────────────────────────────────────────────
class AlertUpdate(BaseModel):
    alert_status: str  # verified, rejected, filtered

class AlertOut(BaseModel):
    alert_id: int
    preference_id: Optional[int] = None
    result_id: Optional[int] = None
    message: Optional[str] = None
    alert_status: Optional[str] = None
    verified_by: Optional[int] = None
    verified_by_name: Optional[str] = None
    forwarded_to_manager: Optional[bool] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Import Equipment ────────────────────────────────────────────────
class ImportEquipmentCreate(BaseModel):
    sup_id: int
    equipment_name: str
    description: Optional[str] = None
    quantity: int = 0
    import_date: Optional[date] = None

class ImportEquipmentUpdate(BaseModel):
    sup_id: Optional[int] = None
    equipment_name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    import_status: Optional[str] = None

class ImportEquipmentOut(BaseModel):
    imp_id: int
    sup_id: int
    supplier_name: Optional[str] = None
    equipment_name: str
    description: Optional[str] = None
    quantity: int = 0
    import_date: Optional[date] = None
    import_status: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ── Notification ────────────────────────────────────────────────────────────────
class NotificationCreate(BaseModel):
    receiver_id: Optional[int] = None       # specific user
    receiver_role: Optional[str] = None     # or broadcast to role (manager/employee)
    title: str
    message: str
    module_name: Optional[str] = None
    notification_type: Optional[str] = "manual"  # reminder / system / manual

class NotificationOut(BaseModel):
    notification_id: int
    sender_id: int
    sender_name: Optional[str] = None
    receiver_id: Optional[int] = None
    receiver_role: Optional[str] = None
    title: str
    message: str
    module_name: Optional[str] = None
    notification_type: Optional[str] = None
    status: str  # unread / read
    created_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    class Config:
        from_attributes = True
