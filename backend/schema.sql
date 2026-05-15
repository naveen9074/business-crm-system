-- ═══════════════════════════════════════════════════════════════════════════
-- Business CRM System (CRMS) — Complete MySQL Database Schema
-- 16 Tables | DFD-Aligned | MCA Academic Project
-- ═══════════════════════════════════════════════════════════════════════════
-- HOW TO RUN:
--   Open MySQL Workbench → Connect to your server → File → Open SQL Script
--   → Select this file → Click the ⚡ (Execute) button
-- ═══════════════════════════════════════════════════════════════════════════

-- Create the database (skip if already created)
CREATE DATABASE IF NOT EXISTS crms
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE crms;

-- ───────────────────────────────────────────────────────────────
-- Drop all tables in reverse dependency order (safe re-run)
-- ───────────────────────────────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS import_equipment;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS scraping_results;
DROP TABLE IF EXISTS web_scraping_preferences;
DROP TABLE IF EXISTS follow_ups;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS delivery;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 1: users
-- Stores admin, manager, and employee accounts
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE users (
    user_id       INT           PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100)  NOT NULL,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    email         VARCHAR(100)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('admin', 'manager', 'employee') NOT NULL,
    phone         VARCHAR(20),
    status        ENUM('active', 'inactive', 'deactivated') DEFAULT 'active',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 2: login_logs
-- Tracks every user login and logout
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE login_logs (
    login_id    INT         PRIMARY KEY AUTO_INCREMENT,
    user_id     INT         NOT NULL,
    username    VARCHAR(50) NOT NULL,
    role        ENUM('admin', 'manager', 'employee') NOT NULL,
    login_time  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP   NULL,
    status      ENUM('logged_in', 'logged_out') DEFAULT 'logged_in',
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loginlog_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 3: customers
-- Business/individual customers managed in the CRM
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE customers (
    cust_id           INT           PRIMARY KEY AUTO_INCREMENT,
    customer_name     VARCHAR(100)  NOT NULL,
    phone             VARCHAR(20),
    email             VARCHAR(100),
    address           TEXT,
    organization_name VARCHAR(150),
    customer_type     VARCHAR(50),
    added_by          INT,
    status            ENUM('active', 'inactive') DEFAULT 'active',
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer_addedby
        FOREIGN KEY (added_by) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 4: suppliers
-- External suppliers who provide products/equipment
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE suppliers (
    sup_id        INT           PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(100)  NOT NULL,
    phone         VARCHAR(20),
    email         VARCHAR(100),
    address       TEXT,
    company_name  VARCHAR(150),
    status        ENUM('active', 'inactive') DEFAULT 'active',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 5: products
-- Items sold to customers, linked to a supplier
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE products (
    product_id   INT            PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150)   NOT NULL,
    category     VARCHAR(100),
    description  TEXT,
    price        DECIMAL(10,2)  DEFAULT 0.00,
    sup_id       INT,
    status       ENUM('active', 'inactive') DEFAULT 'active',
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_supplier
        FOREIGN KEY (sup_id) REFERENCES suppliers(sup_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 6: orders
-- Customer orders for products
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE orders (
    order_id     INT     PRIMARY KEY AUTO_INCREMENT,
    cust_id      INT     NOT NULL,
    product_id   INT     NOT NULL,
    sup_id       INT,
    quantity     INT     DEFAULT 1,
    order_date   DATE,
    order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_by   INT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer  FOREIGN KEY (cust_id)    REFERENCES customers(cust_id),
    CONSTRAINT fk_order_product   FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_order_supplier  FOREIGN KEY (sup_id)     REFERENCES suppliers(sup_id)   ON DELETE SET NULL,
    CONSTRAINT fk_order_createdby FOREIGN KEY (created_by) REFERENCES users(user_id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 7: stock
-- Inventory levels per product
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE stock (
    stock_id            INT     PRIMARY KEY AUTO_INCREMENT,
    product_id          INT     NOT NULL,
    quantity_available  INT     DEFAULT 0,
    minimum_stock_level INT     DEFAULT 10,
    stock_status        ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
    last_updated_by     INT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product FOREIGN KEY (product_id)      REFERENCES products(product_id),
    CONSTRAINT fk_stock_user    FOREIGN KEY (last_updated_by)  REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 8: delivery
-- Shipment tracking per order
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE delivery (
    delivery_id      INT    PRIMARY KEY AUTO_INCREMENT,
    order_id         INT    NOT NULL,
    cust_id          INT    NOT NULL,
    delivery_address TEXT,
    delivery_date    DATE,
    delivery_status  ENUM('pending', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
    updated_by       INT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_order    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    CONSTRAINT fk_delivery_customer FOREIGN KEY (cust_id)    REFERENCES customers(cust_id),
    CONSTRAINT fk_delivery_user     FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 9: invoices
-- Billing documents generated per order
-- (payment_id FK is added later via ALTER TABLE)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE invoices (
    inv_id          INT            PRIMARY KEY AUTO_INCREMENT,
    order_id        INT            NOT NULL,
    cust_id         INT            NOT NULL,
    payment_id      INT            NULL,
    invoice_number  VARCHAR(50)    NOT NULL UNIQUE,
    invoice_date    DATE,
    total_amount    DECIMAL(10,2)  DEFAULT 0.00,
    tax_amount      DECIMAL(10,2)  DEFAULT 0.00,
    final_amount    DECIMAL(10,2)  DEFAULT 0.00,
    invoice_status  ENUM('draft', 'issued', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    generated_by    INT,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_invoice_order    FOREIGN KEY (order_id)     REFERENCES orders(order_id),
    CONSTRAINT fk_invoice_customer FOREIGN KEY (cust_id)      REFERENCES customers(cust_id),
    CONSTRAINT fk_invoice_user     FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 10: payments
-- Payment records linked to orders and invoices
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE payments (
    payment_id      INT            PRIMARY KEY AUTO_INCREMENT,
    order_id        INT            NOT NULL,
    inv_id          INT,
    cust_id         INT            NOT NULL,
    amount          DECIMAL(10,2)  DEFAULT 0.00,
    payment_method  ENUM('cash', 'credit_card', 'bank_transfer', 'cheque'),
    payment_status  ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date    DATE,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_payment_invoice  FOREIGN KEY (inv_id)   REFERENCES invoices(inv_id),
    CONSTRAINT fk_payment_customer FOREIGN KEY (cust_id)  REFERENCES customers(cust_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Now add the circular FK: invoices.payment_id → payments.payment_id
ALTER TABLE invoices
    ADD CONSTRAINT fk_invoice_payment
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
    ON DELETE SET NULL;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 11: follow_ups
-- Sales follow-up reminders for customers
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE follow_ups (
    followup_id     INT     PRIMARY KEY AUTO_INCREMENT,
    cust_id         INT     NOT NULL,
    assigned_to     INT,
    follow_up_date  DATE    NOT NULL,
    follow_up_note  TEXT,
    status          ENUM('pending', 'completed', 'in_progress') DEFAULT 'pending',
    alert_follow_up BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_followup_customer FOREIGN KEY (cust_id)     REFERENCES customers(cust_id),
    CONSTRAINT fk_followup_user     FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 12: web_scraping_preferences
-- Employee-configured web scraping settings
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE web_scraping_preferences (
    preference_id     INT          PRIMARY KEY AUTO_INCREMENT,
    emp_id            INT          NOT NULL,
    website_url       VARCHAR(500) NOT NULL,
    keyword           VARCHAR(200) NOT NULL,
    category          VARCHAR(100),
    preference_status ENUM('active', 'inactive') DEFAULT 'active',
    created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_webpref_user FOREIGN KEY (emp_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 13: scraping_results
-- Output data from web scraping jobs
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE scraping_results (
    result_id         INT          PRIMARY KEY AUTO_INCREMENT,
    preference_id     INT          NOT NULL,
    title             VARCHAR(300),
    source_url        VARCHAR(500),
    extracted_message TEXT,
    scraped_date      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    result_status     ENUM('pending', 'processed') DEFAULT 'pending',
    created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_scrapresult_pref FOREIGN KEY (preference_id) REFERENCES web_scraping_preferences(preference_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 14: alerts
-- Notifications generated from scraping results
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE alerts (
    alert_id             INT     PRIMARY KEY AUTO_INCREMENT,
    preference_id        INT,
    result_id            INT,
    message              TEXT,
    alert_status         ENUM('pending', 'verified', 'rejected', 'forwarded') DEFAULT 'pending',
    verified_by          INT,
    forwarded_to_manager BOOLEAN DEFAULT FALSE,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_pref   FOREIGN KEY (preference_id) REFERENCES web_scraping_preferences(preference_id) ON DELETE SET NULL,
    CONSTRAINT fk_alert_result FOREIGN KEY (result_id)     REFERENCES scraping_results(result_id) ON DELETE SET NULL,
    CONSTRAINT fk_alert_user   FOREIGN KEY (verified_by)   REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 15: import_equipment
-- Imported equipment from suppliers
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE import_equipment (
    imp_id          INT          PRIMARY KEY AUTO_INCREMENT,
    sup_id          INT          NOT NULL,
    equipment_name  VARCHAR(150) NOT NULL,
    description     TEXT,
    quantity        INT          DEFAULT 0,
    import_date     DATE,
    import_status   ENUM('pending', 'received', 'inspected', 'stored') DEFAULT 'pending',
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_importeq_supplier FOREIGN KEY (sup_id) REFERENCES suppliers(sup_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- TABLE 16: audit_logs
-- System-wide activity log for accountability
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE audit_logs (
    log_id      INT          PRIMARY KEY AUTO_INCREMENT,
    user_id     INT,
    action      VARCHAR(100) NOT NULL,
    module_name VARCHAR(100),
    description TEXT,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════════
-- SCHEMA CREATION COMPLETE!
-- 16 tables created successfully in the `crms` database.
-- ═══════════════════════════════════════════════════════════════
-- Next step: Run seed.sql to insert sample data.
-- ═══════════════════════════════════════════════════════════════
