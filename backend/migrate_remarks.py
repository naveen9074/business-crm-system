"""
Safe migration script — adds 'remarks' column to payments and delivery tables.
Works with MySQL. Run once: python migrate_remarks.py
"""
import pymysql


def column_exists(cursor, table, column):
    cursor.execute(f"SHOW COLUMNS FROM `{table}` LIKE '{column}'")
    return cursor.fetchone() is not None


def migrate():
    conn = pymysql.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="root",
        database="crms",
    )
    cursor = conn.cursor()
    changed = False

    # Add remarks to payments
    if not column_exists(cursor, "payments", "remarks"):
        cursor.execute("ALTER TABLE payments ADD COLUMN remarks TEXT NULL")
        print("[OK] Added 'remarks' column to payments table.")
        changed = True
    else:
        print("[SKIP] 'remarks' already exists in payments table.")

    # Add remarks to delivery
    if not column_exists(cursor, "delivery", "remarks"):
        cursor.execute("ALTER TABLE delivery ADD COLUMN remarks TEXT NULL")
        print("[OK] Added 'remarks' column to delivery table.")
        changed = True
    else:
        print("[SKIP] 'remarks' already exists in delivery table.")

    if changed:
        conn.commit()
        print("[DONE] Migration committed successfully.")
    else:
        print("[DONE] No changes needed.")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    migrate()
