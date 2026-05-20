"""
Import all models so SQLAlchemy can discover them for table creation.
"""
from app.models.user import User
from app.models.login_log import LoginLog
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.order import Order
from app.models.stock import Stock
from app.models.delivery import Delivery
from app.models.payment import Payment
from app.models.invoice import Invoice
from app.models.follow_up import FollowUp
from app.models.web_scraping import WebScrapingPreference, ScrapingResult
from app.models.alert import Alert
from app.models.import_equipment import ImportEquipment
from app.models.audit_log import AuditLog
from app.models.notification import Notification

__all__ = [
    "User", "LoginLog", "Customer", "Supplier", "Product",
    "Order", "Stock", "Delivery", "Payment", "Invoice",
    "FollowUp", "WebScrapingPreference", "ScrapingResult",
    "Alert", "ImportEquipment", "AuditLog", "Notification",
]
