"""
Quick test script to verify MySQL connection and seed data.
Run this AFTER seeding the database (either via seed.sql or seed_data.py).

Usage:
    cd backend
    python test_db_connection.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from sqlalchemy import text


def test_connection():
    """Test MySQL connection and verify all 16 tables have the expected data."""

    print("═" * 55)
    print("  CRMS — Database Connection & Data Verification Test")
    print("═" * 55)
    print()

    # Step 1: Test basic connection
    print("1️⃣  Testing MySQL connection...")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        print("   ✅ MySQL connection successful!\n")
    except Exception as e:
        print(f"   ❌ Connection FAILED: {e}")
        print("   → Check that MySQL is running on 127.0.0.1:3306")
        print("   → Check that the 'crms' database exists")
        return

    # Step 2: Check all 16 tables
    print("2️⃣  Checking tables...")
    db = SessionLocal()

    expected_tables = {
        "users": 9,
        "login_logs": 3,
        "customers": 10,
        "suppliers": 5,
        "products": 15,
        "orders": 10,
        "stock": 15,
        "delivery": 10,
        "invoices": 3,
        "payments": 3,
        "follow_ups": 8,
        "web_scraping_preferences": 4,
        "scraping_results": 4,
        "alerts": 6,
        "import_equipment": 5,
        "audit_logs": 5,
    }

    all_passed = True
    total_records = 0

    for table_name, expected_count in expected_tables.items():
        try:
            result = db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            actual_count = result.scalar()
            total_records += actual_count
            status = "✅" if actual_count == expected_count else "⚠️"
            if actual_count != expected_count:
                all_passed = False
            print(f"   {status} {table_name:30s} → {actual_count:3d} rows (expected {expected_count})")
        except Exception as e:
            print(f"   ❌ {table_name:30s} → ERROR: {e}")
            all_passed = False

    db.close()

    # Step 3: Summary
    print()
    print("─" * 55)
    if all_passed:
        print(f"  🎉 ALL 16 TABLES VERIFIED — {total_records} total records")
        print("  ✅ Your CRMS database is ready to use!")
    else:
        print("  ⚠️  Some tables have unexpected counts.")
        print("  → Re-run schema.sql then seed.sql in MySQL Workbench")
        print("  → Or run: python seed_data.py")
    print("─" * 55)

    # Step 4: Show sample data
    if all_passed:
        print()
        print("3️⃣  Sample data preview:")
        db = SessionLocal()

        print("\n   👤 Users:")
        rows = db.execute(text("SELECT user_id, name, username, role, status FROM users")).fetchall()
        for r in rows:
            print(f"      ID={r[0]}  {r[1]:20s}  @{r[2]:12s}  role={r[3]:10s}  status={r[4]}")

        print("\n   📦 Products (first 5):")
        rows = db.execute(text("SELECT product_id, product_name, category, price FROM products LIMIT 5")).fetchall()
        for r in rows:
            print(f"      ID={r[0]}  {r[1]:25s}  cat={r[2]:15s}  ₹{r[3]:>10,.2f}")

        print("\n   🛒 Orders (first 5):")
        rows = db.execute(text("""
            SELECT o.order_id, c.customer_name, p.product_name, o.quantity, o.order_status
            FROM orders o
            JOIN customers c ON o.cust_id = c.cust_id
            JOIN products p ON o.product_id = p.product_id
            LIMIT 5
        """)).fetchall()
        for r in rows:
            print(f"      Order #{r[0]}  {r[1]:25s}  {r[2]:25s}  qty={r[3]}  status={r[4]}")

        db.close()
        print()


if __name__ == "__main__":
    test_connection()
