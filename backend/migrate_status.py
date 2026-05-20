"""
Safe migration: Add 'pending' and 'rejected' to users.status enum.
"""
import pymysql

conn = pymysql.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    password='root',
    db='crms'
)
cursor = conn.cursor()

sql = (
    "ALTER TABLE users "
    "MODIFY COLUMN status "
    "ENUM('active','inactive','deactivated','pending','rejected') "
    "NOT NULL DEFAULT 'active'"
)

try:
    cursor.execute(sql)
    conn.commit()
    print("SUCCESS: users.status enum updated — added 'pending' and 'rejected'")
except Exception as e:
    print(f"ERROR: {e}")
finally:
    cursor.close()
    conn.close()
