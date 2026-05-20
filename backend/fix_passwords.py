"""
Fix password hashes in MySQL database.

The seed.sql used FAKE bcrypt hashes that don't actually correspond to the
plaintext passwords. This script replaces them with REAL bcrypt hashes
so that login works correctly.

Run:  python fix_passwords.py
"""
import sys
import os

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.utils import hash_password, verify_password


# Map of username -> plaintext password (matching what seed.sql documents)
USER_PASSWORDS = {
    "admin":     "admin123",
    "manager1":  "manager123",
    "manager2":  "manager123",
    "manager3":  "manager123",
    "employee1": "employee123",
    "employee2": "employee123",
    "employee3": "employee123",
    "employee4": "employee123",
    "employee5": "employee123",
}


def fix_passwords():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\nFound {len(users)} users in the database.\n")

        fixed = 0
        already_ok = 0

        for user in users:
            expected_pw = USER_PASSWORDS.get(user.username)
            if expected_pw is None:
                print(f"  [SKIP] {user.username:15s} -- not in known list, skipping")
                continue

            # Check if current hash already works
            try:
                if verify_password(expected_pw, user.password_hash):
                    print(f"  [OK]   {user.username:15s} -- password already correct")
                    already_ok += 1
                    continue
            except Exception:
                pass  # hash is corrupt/invalid, needs replacement

            # Generate real bcrypt hash and update
            new_hash = hash_password(expected_pw)
            user.password_hash = new_hash
            fixed += 1
            print(f"  [FIXED] {user.username:15s} -- password hash FIXED")

        db.commit()
        print(f"\n{'='*50}")
        print(f"  Already OK : {already_ok}")
        print(f"  Fixed      : {fixed}")
        print(f"  Total      : {len(users)}")
        print(f"{'='*50}")
        print("\nDone! You can now login with these credentials:")
        print("  admin     / admin123")
        print("  manager1  / manager123")
        print("  employee1 / employee123\n")

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    fix_passwords()
