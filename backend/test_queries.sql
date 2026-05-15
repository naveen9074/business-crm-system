-- ═══════════════════════════════════════════════════════════════════════════
-- Business CRM System (CRMS) — Test & Verification Queries
-- Run this AFTER schema.sql and seed.sql to confirm everything is correct.
-- ═══════════════════════════════════════════════════════════════════════════

USE crms;

-- ═══════════════════════════════════════════════════════════════
-- TEST 1: Show all 16 tables exist
-- Expected: 16 rows listing all table names
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 1: All Tables' AS test_name;

SHOW TABLES;


-- ═══════════════════════════════════════════════════════════════
-- TEST 2: Count records in each table
-- Expected: Should match the seed data counts
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 2: Record Counts' AS test_name;

SELECT 'users'                    AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'login_logs',                              COUNT(*)             FROM login_logs
UNION ALL
SELECT 'customers',                                COUNT(*)             FROM customers
UNION ALL
SELECT 'suppliers',                                COUNT(*)             FROM suppliers
UNION ALL
SELECT 'products',                                 COUNT(*)             FROM products
UNION ALL
SELECT 'orders',                                   COUNT(*)             FROM orders
UNION ALL
SELECT 'stock',                                    COUNT(*)             FROM stock
UNION ALL
SELECT 'delivery',                                 COUNT(*)             FROM delivery
UNION ALL
SELECT 'invoices',                                 COUNT(*)             FROM invoices
UNION ALL
SELECT 'payments',                                 COUNT(*)             FROM payments
UNION ALL
SELECT 'follow_ups',                               COUNT(*)             FROM follow_ups
UNION ALL
SELECT 'web_scraping_preferences',                 COUNT(*)             FROM web_scraping_preferences
UNION ALL
SELECT 'scraping_results',                         COUNT(*)             FROM scraping_results
UNION ALL
SELECT 'alerts',                                   COUNT(*)             FROM alerts
UNION ALL
SELECT 'import_equipment',                         COUNT(*)             FROM import_equipment
UNION ALL
SELECT 'audit_logs',                               COUNT(*)             FROM audit_logs;


-- ═══════════════════════════════════════════════════════════════
-- TEST 3: Verify users — all 9 users with their roles
-- Expected: 1 admin, 3 managers, 5 employees
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 3: Users by Role' AS test_name;

SELECT role, COUNT(*) AS count
FROM users
GROUP BY role
ORDER BY FIELD(role, 'admin', 'manager', 'employee');


-- ═══════════════════════════════════════════════════════════════
-- TEST 4: Verify products are linked to their suppliers
-- Expected: 15 rows with product names and supplier names
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 4: Products with Suppliers' AS test_name;

SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.price,
    s.supplier_name
FROM products p
JOIN suppliers s ON p.sup_id = s.sup_id
ORDER BY p.product_id;


-- ═══════════════════════════════════════════════════════════════
-- TEST 5: Verify orders with customer and product details
-- Expected: 10 rows with full order info
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 5: Orders Detail' AS test_name;

SELECT
    o.order_id,
    c.customer_name,
    p.product_name,
    o.quantity,
    o.order_date,
    o.order_status
FROM orders o
JOIN customers c ON o.cust_id = c.cust_id
JOIN products p  ON o.product_id = p.product_id
ORDER BY o.order_id;


-- ═══════════════════════════════════════════════════════════════
-- TEST 6: Verify stock levels (check for low/out-of-stock)
-- Expected: product 7 = low_stock, product 9 = low_stock,
--           product 11 = out_of_stock
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 6: Stock Alerts' AS test_name;

SELECT
    s.stock_id,
    p.product_name,
    s.quantity_available,
    s.minimum_stock_level,
    s.stock_status
FROM stock s
JOIN products p ON s.product_id = p.product_id
WHERE s.stock_status != 'in_stock'
ORDER BY s.quantity_available;


-- ═══════════════════════════════════════════════════════════════
-- TEST 7: Invoice + Payment summary
-- Expected: 3 invoices with amounts and payment status
-- ═══════════════════════════════════════════════════════════════
SELECT
    'TEST 7: Invoice-Payment Summary' AS test_name;

SELECT
    i.invoice_number,
    c.customer_name,
    i.total_amount,
    i.tax_amount,
    i.final_amount,
    i.invoice_status,
    py.payment_method,
    py.payment_status
FROM invoices i
JOIN customers c ON i.cust_id = c.cust_id
LEFT JOIN payments py ON py.inv_id = i.inv_id
ORDER BY i.inv_id;


-- ═══════════════════════════════════════════════════════════════
-- TEST 8: FINAL SUMMARY
-- If you see "ALL TESTS PASSED" → your database is ready!
-- ═══════════════════════════════════════════════════════════════
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM users) = 9
         AND (SELECT COUNT(*) FROM suppliers) = 5
         AND (SELECT COUNT(*) FROM products) = 15
         AND (SELECT COUNT(*) FROM customers) = 10
         AND (SELECT COUNT(*) FROM orders) = 10
         AND (SELECT COUNT(*) FROM stock) = 15
         AND (SELECT COUNT(*) FROM delivery) = 10
         AND (SELECT COUNT(*) FROM invoices) = 3
         AND (SELECT COUNT(*) FROM payments) = 3
         AND (SELECT COUNT(*) FROM follow_ups) = 8
         AND (SELECT COUNT(*) FROM web_scraping_preferences) = 4
         AND (SELECT COUNT(*) FROM scraping_results) = 4
         AND (SELECT COUNT(*) FROM alerts) = 6
         AND (SELECT COUNT(*) FROM import_equipment) = 5
         AND (SELECT COUNT(*) FROM audit_logs) = 5
         AND (SELECT COUNT(*) FROM login_logs) = 3
        THEN '✅ ALL TESTS PASSED — 96 records across 16 tables. Database is READY!'
        ELSE '❌ SOME TESTS FAILED — Check individual counts above.'
    END AS final_result;
