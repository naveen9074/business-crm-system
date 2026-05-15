# Business CRM System (CRMS)

> DFD-Aligned | MCA Academic Project | Full-Stack Web Application

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Tailwind CSS v4 + Vite |
| **Backend** | FastAPI (Python 3.9+) |
| **Database** | MySQL 8.0+ (via SQLAlchemy ORM) |
| **Auth** | JWT + bcrypt |

## Quick Start

### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE crms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Or run the full schema
mysql -u root -p < backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure database (edit .env)
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/crms

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Manager | `manager1` | `manager123` |
| Employee | `employee1` | `employee123` |

## Role-Based Modules

### Admin
- Manage Managers & Employees (CRUD)
- View Customers (read-only)
- Manage Suppliers & Import Equipment (CRUD)
- View Stock & Payments (read-only)

### Manager
- Manage Customers (CRUD)
- View Products, Orders, Stock, Deliveries, Payments
- Generate Invoices with tax calculations
- View Follow-ups (with urgency color-coding)
- View Verified Alerts

### Employee
- View Customers (read-only)
- Add Orders & Products
- Update Stock (auto-calculates status)
- Update Delivery Status
- Set Web Scraping Preferences
- Verify/Reject Alerts
- Manage Follow-ups

## Database Schema (16 Tables)

users, login_logs, customers, suppliers, products, orders, stock, delivery, payments, invoices, follow_ups, web_scraping_preferences, scraping_results, alerts, import_equipment, audit_logs

## API Endpoints Summary

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT
- `POST /api/auth/logout` — Logout
- `GET /api/auth/profile` — Get current user profile
- `/api/admin/*` — Admin module (24 endpoints)
- `/api/manager/*` — Manager module (22 endpoints)
- `/api/employee/*` — Employee module (20 endpoints)
- `POST /api/system/scrape` — Trigger web scraping
