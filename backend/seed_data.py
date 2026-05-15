"""
Seed script — populates the CRMS MySQL database with realistic sample data.
This script uses SQLAlchemy ORM and generates proper bcrypt password hashes.

Usage:
    cd backend
    python seed_data.py

Prerequisites:
    1. MySQL must be running on 127.0.0.1:3306
    2. The 'crms' database must exist (run schema.sql first in MySQL Workbench)
    3. Install dependencies: pip install -r requirements.txt
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import Base, engine, SessionLocal
from app.models import *
from app.utils import hash_password
from datetime import date, datetime, timedelta


def seed():
    """Drop and recreate all tables, then insert 96 sample records."""

    print("═" * 50)
    print("  CRMS Database Seeder (MySQL)")
    print("═" * 50)
    print()

    # Recreate all tables
    print("⏳ Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("⏳ Creating fresh tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created\n")

    db = SessionLocal()

    try:
        # ── 1. USERS (1 admin, 3 managers, 5 employees) ──
        users_data = [
            ("System Admin",   "admin",     "admin@crms.com",    "admin123",    "admin",    "9999000001"),
            ("Rahul Sharma",   "manager1",  "rahul@crms.com",    "manager123",  "manager",  "9876500001"),
            ("Priya Nair",     "manager2",  "priya@crms.com",    "manager123",  "manager",  "9876500002"),
            ("Vikram Patel",   "manager3",  "vikram@crms.com",   "manager123",  "manager",  "9876500003"),
            ("Anita Desai",    "employee1", "anita@crms.com",    "employee123", "employee", "9876500004"),
            ("Karthik Rajan",  "employee2", "karthik@crms.com",  "employee123", "employee", "9876500005"),
            ("Meera Joshi",    "employee3", "meera@crms.com",    "employee123", "employee", "9876500006"),
            ("Suresh Kumar",   "employee4", "suresh@crms.com",   "employee123", "employee", "9876500007"),
            ("Deepa Menon",    "employee5", "deepa@crms.com",    "employee123", "employee", "9876500008"),
        ]
        for name, uname, email, pwd, role, phone in users_data:
            db.add(User(name=name, username=uname, email=email,
                        password_hash=hash_password(pwd), role=role, phone=phone, status="active"))
        db.flush()
        print("✓ 9 Users created (with bcrypt hashed passwords)")

        # ── 2. SUPPLIERS (5) ──
        suppliers_data = [
            ("Tata Electronics",    "9800000001", "sales@tata-elec.com",       "Mumbai, Maharashtra",      "Tata Electronics Pvt Ltd"),
            ("Reliance Components", "9800000002", "info@relcomp.com",          "Navi Mumbai, Maharashtra", "Reliance Components Ltd"),
            ("Wipro Industrial",    "9800000003", "contact@wipro-ind.com",     "Bangalore, Karnataka",     "Wipro Industrial Supplies"),
            ("Mahindra Parts",      "9800000004", "orders@mahindra-parts.com", "Pune, Maharashtra",        "Mahindra Parts & Accessories"),
            ("Infosys Hardware",    "9800000005", "hw@infosys.com",            "Hyderabad, Telangana",     "Infosys Hardware Division"),
        ]
        for sname, phone, email, addr, cname in suppliers_data:
            db.add(Supplier(supplier_name=sname, phone=phone, email=email,
                            address=addr, company_name=cname, status="active"))
        db.flush()
        print("✓ 5 Suppliers created")

        # ── 3. PRODUCTS (15) ──
        products_data = [
            ("Industrial Motor 5HP",     "Motors",            "Heavy duty 5HP motor for industrial use",              15000.00, 1),
            ("Circuit Breaker 32A",      "Electrical",        "MCB 32A triple pole circuit breaker",                    850.00, 1),
            ("PLC Controller S7-200",    "Automation",        "Siemens compatible PLC controller",                   45000.00, 2),
            ("Hydraulic Pump HP-200",    "Hydraulics",        "200 bar hydraulic pump assembly",                     32000.00, 2),
            ("LED Panel Light 40W",      "Lighting",          "Slim LED panel 2x2 feet 40W",                          1200.00, 3),
            ("Copper Wire 4mm 100m",     "Wiring",            "4mm² copper wire roll 100 meters",                     4500.00, 3),
            ("Steel Gear Box GB-50",     "Transmission",      "50:1 ratio steel gearbox",                            28000.00, 4),
            ("Bearing 6205-2RS",         "Bearings",          "Deep groove ball bearing 25x52x15mm",                   350.00, 4),
            ("Transformer 10KVA",        "Power",             "Step-down transformer 440V to 220V",                  22000.00, 5),
            ("Sensor Module IR-50",      "Sensors",           "Infrared proximity sensor module",                     1800.00, 5),
            ("Conveyor Belt 5m",         "Material Handling", "Industrial rubber conveyor belt 5 meters",             8500.00, 1),
            ("Air Compressor 2HP",       "Pneumatics",        "Oil-free air compressor 2HP",                         18000.00, 2),
            ("Welding Rod E6013 5kg",    "Welding",           "Mild steel welding electrodes 5kg pack",                650.00, 3),
            ("Safety Helmet ISI",        "Safety",            "ISI certified industrial safety helmet",                280.00, 4),
            ("Digital Multimeter",       "Testing",           "True RMS digital multimeter with auto-range",          3200.00, 5),
        ]
        for pname, cat, desc, price, sid in products_data:
            db.add(Product(product_name=pname, category=cat, description=desc,
                           price=price, sup_id=sid, status="active"))
        db.flush()
        print("✓ 15 Products created")

        # ── 4. CUSTOMERS (10) ──
        customers_data = [
            ("Ashok Constructions",    "9700000001", "ashok@constructions.com",  "Sector 15, Noida, UP",   "Ashok Group",            "Corporate",   5),
            ("Bharat Heavy Works",     "9700000002", "info@bharatheavy.com",     "MIDC Andheri, Mumbai",   "Bharat Heavy Works Ltd", "Corporate",   5),
            ("Chennai Auto Parts",     "9700000003", "sales@chennaiap.com",      "Ambattur, Chennai, TN",  "Chennai Auto Parts",     "Wholesale",   6),
            ("Delhi Power Solutions",  "9700000004", "contact@delhipower.com",   "Okhla Phase 2, Delhi",   "Delhi Power Solutions",  "Corporate",   6),
            ("Excel Manufacturing",    "9700000005", "excel@mfg.com",            "Pimpri, Pune, MH",       "Excel Manufacturing Co", "Corporate",   7),
            ("Frontier Engineering",   "9700000006", "info@frontier-eng.com",    "Whitefield, Bangalore",  "Frontier Engineering",   "Wholesale",   7),
            ("Ganesh Electricals",     "9700000007", "ganesh@electricals.com",   "Gandhi Nagar, Jaipur",   "Ganesh Electricals",     "Individual",  8),
            ("Hindustan Tools",        "9700000008", "ht@tools.com",             "Faridabad, Haryana",     "Hindustan Tools Pvt Ltd","Corporate",   8),
            ("Imperial Machines",      "9700000009", "sales@imperial.com",       "Chandigarh",             "Imperial Machines Ltd",  "Wholesale",   5),
            ("Jyoti Industries",       "9700000010", "jyoti@industries.com",     "Rajkot, Gujarat",        "Jyoti Industries",       "Corporate",   6),
        ]
        for cname, phone, email, addr, org, ctype, added in customers_data:
            db.add(Customer(customer_name=cname, phone=phone, email=email, address=addr,
                            organization_name=org, customer_type=ctype, added_by=added, status="active"))
        db.flush()
        print("✓ 10 Customers created")

        # ── 5. ORDERS (10) ──
        today = date.today()
        orders_data = [
            (1,  1,  1,  5, today - timedelta(days=30), "delivered",  5),
            (2,  3,  2, 10, today - timedelta(days=25), "delivered",  5),
            (3,  5,  3,  2, today - timedelta(days=20), "shipped",    6),
            (4,  9,  5, 20, today - timedelta(days=15), "confirmed",  6),
            (5,  2,  1,  3, today - timedelta(days=10), "pending",    7),
            (6,  7,  4,  8, today - timedelta(days= 8), "confirmed",  7),
            (7,  4,  2,  1, today - timedelta(days= 5), "pending",    8),
            (8,  8,  4, 15, today - timedelta(days= 3), "pending",    8),
            (1, 11,  1,  2, today - timedelta(days= 2), "confirmed",  5),
            (10, 6,  3,  4, today - timedelta(days= 1), "pending",    9),
        ]
        for cid, pid, sid, qty, odate, status, created_by in orders_data:
            db.add(Order(cust_id=cid, product_id=pid, sup_id=sid, quantity=qty,
                         order_date=odate, order_status=status, created_by=created_by))
        db.flush()
        print("✓ 10 Orders created")

        # ── 6. STOCK (15, one per product) ──
        stock_data = [
            (1,  25,  10, "in_stock"),     (2, 120,  50, "in_stock"),    (3,   8,   5, "in_stock"),
            (4,  12,  10, "in_stock"),     (5, 200, 100, "in_stock"),    (6,  45,  20, "in_stock"),
            (7,   6,   5, "low_stock"),    (8, 500, 100, "in_stock"),    (9,   3,   5, "low_stock"),
            (10, 80,  30, "in_stock"),     (11,  0,   5, "out_of_stock"),(12, 15,  10, "in_stock"),
            (13, 40,  20, "in_stock"),     (14,250,  50, "in_stock"),    (15, 18,  10, "in_stock"),
        ]
        for pid, qty, min_lvl, status in stock_data:
            db.add(Stock(product_id=pid, quantity_available=qty, minimum_stock_level=min_lvl,
                         stock_status=status, last_updated_by=5))
        db.flush()
        print("✓ 15 Stock records created")

        # ── 7. DELIVERIES (one per order) ──
        delivery_statuses = ["delivered", "delivered", "in_transit", "pending", "pending",
                             "in_transit", "pending", "pending", "pending", "pending"]
        for i in range(10):
            cid = orders_data[i][0]
            db.add(Delivery(order_id=i+1, cust_id=cid,
                            delivery_address=customers_data[cid-1][3] if cid <= 10 else "Address",
                            delivery_date=today + timedelta(days=i-5),
                            delivery_status=delivery_statuses[i], updated_by=5))
        db.flush()
        print("✓ 10 Deliveries created")

        # ── 8. INVOICES (3) ──
        from decimal import Decimal
        invoices = [
            (1, 1, f"INV-{today.strftime('%Y%m%d')}-001", Decimal("75000"), Decimal("13500"), Decimal("88500"),  "paid"),
            (2, 2, f"INV-{today.strftime('%Y%m%d')}-002", Decimal("8500"),  Decimal("1530"),  Decimal("10030"),  "issued"),
            (3, 3, f"INV-{today.strftime('%Y%m%d')}-003", Decimal("90000"), Decimal("16200"), Decimal("106200"), "issued"),
        ]
        for oid, cid, inv_num, total, tax, final, status in invoices:
            db.add(Invoice(order_id=oid, cust_id=cid, invoice_number=inv_num, invoice_date=today,
                           total_amount=total, tax_amount=tax, final_amount=final,
                           invoice_status=status, generated_by=2))
        db.flush()
        print("✓ 3 Invoices created")

        # ── 9. PAYMENTS (3) ──
        payments = [
            (1, 1, 1, Decimal("88500"),  "bank_transfer", "completed", today - timedelta(days=5)),
            (2, 2, 2, Decimal("10030"),  "credit_card",   "pending",   today),
            (3, 3, 3, Decimal("106200"), "cheque",        "pending",   today + timedelta(days=7)),
        ]
        for oid, inv, cid, amt, method, status, pdate in payments:
            db.add(Payment(order_id=oid, inv_id=inv, cust_id=cid, amount=amt,
                           payment_method=method, payment_status=status, payment_date=pdate))
        db.flush()
        print("✓ 3 Payments created")

        # ── 10. FOLLOW-UPS (8) ──
        followups = [
            (1, 5, today - timedelta(days=2), "Discuss bulk order pricing for motors",        "completed",   False),
            (2, 5, today,                      "Follow up on payment for order #2",            "in_progress", False),
            (3, 6, today + timedelta(days=1),  "Send updated quotation for PLC controllers",   "pending",     False),
            (4, 6, today + timedelta(days=3),  "Schedule product demo at client site",         "pending",     False),
            (5, 7, today - timedelta(days=1),  "Verify delivery address change request",       "completed",   False),
            (7, 7, today + timedelta(days=5),  "Annual maintenance contract renewal",          "pending",     True),
            (8, 8, today + timedelta(days=7),  "Discuss warranty claim for bearings",          "pending",     False),
            (10,9, today + timedelta(days=10), "New product launch presentation",              "pending",     False),
        ]
        for cid, assigned, fdate, note, status, alert in followups:
            db.add(FollowUp(cust_id=cid, assigned_to=assigned, follow_up_date=fdate,
                            follow_up_note=note, status=status, alert_follow_up=alert))
        db.flush()
        print("✓ 8 Follow-ups created")

        # ── 11. WEB SCRAPING PREFERENCES (4) ──
        prefs = [
            (5, "https://www.indiamart.com",  "industrial motor",            "product"),
            (5, "https://www.tradeindia.com", "PLC controller",              "product"),
            (6, "https://eprocure.gov.in",    "electrical equipment tender", "tender"),
            (7, "https://gem.gov.in",         "safety equipment",            "quotation"),
        ]
        for eid, url, kw, cat in prefs:
            db.add(WebScrapingPreference(emp_id=eid, website_url=url, keyword=kw,
                                         category=cat, preference_status="active"))
        db.flush()
        print("✓ 4 Web Scraping Preferences created")

        # ── 12. SCRAPING RESULTS (4) ──
        results = [
            (1, "Industrial Motor 10HP - Best Price",
                "https://www.indiamart.com/motor-10hp",
                "Found: Industrial Motor 10HP at ₹18,500. Supplier: ABC Motors, Rating: 4.5/5. Minimum order: 2 units."),
            (2, "Siemens PLC S7-1200 Available",
                "https://www.tradeindia.com/plc-s7",
                "PLC Controller S7-1200 available at ₹42,000. Free shipping on orders above ₹50,000. Stock: 25 units."),
            (3, "Tender: Electrical Equipment Supply - NTPC",
                "https://eprocure.gov.in/tender/12345",
                "NTPC Tender for electrical equipment supply. Deadline: 2026-06-15. Estimated value: ₹50 Lakhs."),
            (4, "GeM: Safety Equipment Bulk Order",
                "https://gem.gov.in/listing/67890",
                "Government e-Marketplace listing for safety helmets and gear. Qty: 500 units. Budget: ₹2 Lakhs."),
        ]
        for pid, title, url, msg in results:
            db.add(ScrapingResult(preference_id=pid, title=title, source_url=url,
                                  extracted_message=msg, result_status="pending"))
        db.flush()
        print("✓ 4 Scraping Results created")

        # ── 13. ALERTS (6) ──
        alerts = [
            (1, 1, "New product found: Industrial Motor 10HP at ₹18,500 on IndiaMART. Supplier: ABC Motors.",  "verified",  5, True),
            (2, 2, "PLC Controller S7-1200 available at ₹42,000 on TradeIndia. 25 units in stock.",            "verified",  5, True),
            (3, 3, "NTPC Tender for electrical equipment supply. Deadline: June 15, 2026. Value: ₹50 Lakhs.", "pending", None, False),
            (4, 4, "GeM listing: Safety helmets bulk order - 500 units at ₹2 Lakhs budget.",                    "pending", None, False),
            (1, 1, "Price drop alert: Motor prices reduced by 12% on IndiaMART this week.",                      "pending", None, False),
            (3, 3, "New tender: BHEL seeking quotations for transformer supply.",                                 "rejected", 6, False),
        ]
        for pid, rid, msg, status, vby, fwd in alerts:
            db.add(Alert(preference_id=pid, result_id=rid, message=msg,
                         alert_status=status, verified_by=vby, forwarded_to_manager=fwd))
        db.flush()
        print("✓ 6 Alerts created")

        # ── 14. IMPORT EQUIPMENT (5) ──
        equip = [
            (1, "CNC Lathe Machine",      "High precision CNC lathe for machining",    2, today - timedelta(days=60), "stored"),
            (2, "Hydraulic Press 100T",    "100-ton hydraulic press for metal forming", 1, today - timedelta(days=45), "inspected"),
            (3, "Industrial Robot Arm",    "6-axis robotic arm for assembly line",      3, today - timedelta(days=20), "received"),
            (4, "Welding Station MIG",     "MIG welding station with auto-feed",        5, today - timedelta(days=10), "pending"),
            (5, "Testing Equipment Kit",   "Comprehensive electrical testing kit",     10, today - timedelta(days= 5), "pending"),
        ]
        for sid, ename, desc, qty, idate, status in equip:
            db.add(ImportEquipment(sup_id=sid, equipment_name=ename, description=desc,
                                   quantity=qty, import_date=idate, import_status=status))
        db.flush()
        print("✓ 5 Import Equipment records created")

        # ── 15. AUDIT LOGS (5) ──
        logs = [
            (5, "CREATED", "Order",    "Created order #1 for Ashok Constructions"),
            (2, "CREATED", "Invoice",  "Generated invoice INV-001 for order #1"),
            (5, "UPDATED", "Stock",    "Updated stock for Industrial Motor 5HP: qty=25"),
            (1, "CREATED", "User",     "Admin created manager Rahul Sharma"),
            (6, "UPDATED", "Delivery", "Updated delivery #1 status to delivered"),
        ]
        for uid, action, module, desc in logs:
            db.add(AuditLog(user_id=uid, action=action, module_name=module, description=desc))
        db.flush()
        print("✓ 5 Audit Logs created")

        # ── 16. LOGIN LOGS (3) ──
        db.add(LoginLog(user_id=1, username="admin",     role="admin",    status="logged_in"))
        db.add(LoginLog(user_id=2, username="manager1",  role="manager",  status="logged_in"))
        db.add(LoginLog(user_id=5, username="employee1", role="employee", status="logged_in"))
        print("✓ 3 Login Logs created")

        db.commit()
        print()
        print("═" * 50)
        print("  ✅ DATABASE SEEDED SUCCESSFULLY!")
        print("  Total: 96 records across 16 tables")
        print("═" * 50)
        print()
        print("Demo Credentials:")
        print("  Admin:    admin     / admin123")
        print("  Manager:  manager1  / manager123")
        print("  Employee: employee1 / employee123")

    except Exception as e:
        db.rollback()
        print(f"\n❌ ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
