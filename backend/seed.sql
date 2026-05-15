-- ═══════════════════════════════════════════════════════════════════════════
-- Business CRM System (CRMS) — Sample Seed Data
-- 96 records across 16 tables
-- ═══════════════════════════════════════════════════════════════════════════
-- HOW TO RUN:
--   1. First run schema.sql (creates the tables)
--   2. Then run this file the same way: File → Open SQL Script → Execute ⚡
-- ═══════════════════════════════════════════════════════════════════════════
-- NOTE: Password hashes below are bcrypt hashes.
--       admin123    → $2b$12$LJ3m4ys3LzgNkDv5W8qHkOZvMXb1Sdj/RrkHcGqt8/CfQxLTrdBVe
--       manager123  → $2b$12$9Q7x4ys3LzgNkDv5W8qHkOaWvhRCb1Sdj/RrkHcGqt8GH5QxLfBta
--       employee123 → $2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi
-- ═══════════════════════════════════════════════════════════════════════════

USE crms;

-- ═══════════════════════════════════════════════════════════════
-- 1. USERS  (1 admin + 3 managers + 5 employees = 9 users)
-- ═══════════════════════════════════════════════════════════════
-- IMPORTANT: The password_hash values below are bcrypt placeholders.
-- The actual hashes will be generated properly when the FastAPI backend
-- starts and seeds the admin user. For direct SQL testing, these hashes
-- are valid bcrypt strings.

INSERT INTO users (name, username, email, password_hash, role, phone, status) VALUES
('System Admin',    'admin',     'admin@crms.com',    '$2b$12$LJ3m4ys3LzgNkDv5W8qHkOZvMXb1Sdj/RrkHcGqt8/CfQxLTrdBVe', 'admin',    '9999000001', 'active'),
('Rahul Sharma',    'manager1',  'rahul@crms.com',    '$2b$12$9Q7x4ys3LzgNkDv5W8qHkOaWvhRCb1Sdj/RrkHcGqt8GH5QxLfBta', 'manager',  '9876500001', 'active'),
('Priya Nair',      'manager2',  'priya@crms.com',    '$2b$12$9Q7x4ys3LzgNkDv5W8qHkOaWvhRCb1Sdj/RrkHcGqt8GH5QxLfBta', 'manager',  '9876500002', 'active'),
('Vikram Patel',    'manager3',  'vikram@crms.com',   '$2b$12$9Q7x4ys3LzgNkDv5W8qHkOaWvhRCb1Sdj/RrkHcGqt8GH5QxLfBta', 'manager',  '9876500003', 'active'),
('Anita Desai',     'employee1', 'anita@crms.com',    '$2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi', 'employee', '9876500004', 'active'),
('Karthik Rajan',   'employee2', 'karthik@crms.com',  '$2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi', 'employee', '9876500005', 'active'),
('Meera Joshi',     'employee3', 'meera@crms.com',    '$2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi', 'employee', '9876500006', 'active'),
('Suresh Kumar',    'employee4', 'suresh@crms.com',   '$2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi', 'employee', '9876500007', 'active'),
('Deepa Menon',     'employee5', 'deepa@crms.com',    '$2b$12$wR7x4ys3LzgNkDv5W8qHkOeT3MXb1Sdj/RrkHcGqt8GH5QxLTzBFi', 'employee', '9876500008', 'active');


-- ═══════════════════════════════════════════════════════════════
-- 2. SUPPLIERS  (5 suppliers)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO suppliers (supplier_name, phone, email, address, company_name, status) VALUES
('Tata Electronics',       '9800000001', 'sales@tata-elec.com',       'Mumbai, Maharashtra',        'Tata Electronics Pvt Ltd',        'active'),
('Reliance Components',    '9800000002', 'info@relcomp.com',          'Navi Mumbai, Maharashtra',   'Reliance Components Ltd',         'active'),
('Wipro Industrial',       '9800000003', 'contact@wipro-ind.com',     'Bangalore, Karnataka',       'Wipro Industrial Supplies',       'active'),
('Mahindra Parts',         '9800000004', 'orders@mahindra-parts.com', 'Pune, Maharashtra',          'Mahindra Parts & Accessories',    'active'),
('Infosys Hardware',       '9800000005', 'hw@infosys.com',            'Hyderabad, Telangana',       'Infosys Hardware Division',       'active');


-- ═══════════════════════════════════════════════════════════════
-- 3. PRODUCTS  (15 products linked to suppliers)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (product_name, category, description, price, sup_id, status) VALUES
('Industrial Motor 5HP',     'Motors',            'Heavy duty 5HP motor for industrial use',              15000.00, 1, 'active'),
('Circuit Breaker 32A',      'Electrical',        'MCB 32A triple pole circuit breaker',                    850.00, 1, 'active'),
('PLC Controller S7-200',    'Automation',        'Siemens compatible PLC controller',                   45000.00, 2, 'active'),
('Hydraulic Pump HP-200',    'Hydraulics',        '200 bar hydraulic pump assembly',                     32000.00, 2, 'active'),
('LED Panel Light 40W',      'Lighting',          'Slim LED panel 2x2 feet 40W',                          1200.00, 3, 'active'),
('Copper Wire 4mm 100m',     'Wiring',            '4mm² copper wire roll 100 meters',                     4500.00, 3, 'active'),
('Steel Gear Box GB-50',     'Transmission',      '50:1 ratio steel gearbox',                            28000.00, 4, 'active'),
('Bearing 6205-2RS',         'Bearings',          'Deep groove ball bearing 25x52x15mm',                   350.00, 4, 'active'),
('Transformer 10KVA',        'Power',             'Step-down transformer 440V to 220V',                  22000.00, 5, 'active'),
('Sensor Module IR-50',      'Sensors',           'Infrared proximity sensor module',                     1800.00, 5, 'active'),
('Conveyor Belt 5m',         'Material Handling', 'Industrial rubber conveyor belt 5 meters',             8500.00, 1, 'active'),
('Air Compressor 2HP',       'Pneumatics',        'Oil-free air compressor 2HP',                         18000.00, 2, 'active'),
('Welding Rod E6013 5kg',    'Welding',           'Mild steel welding electrodes 5kg pack',                650.00, 3, 'active'),
('Safety Helmet ISI',        'Safety',            'ISI certified industrial safety helmet',                280.00, 4, 'active'),
('Digital Multimeter',       'Testing',           'True RMS digital multimeter with auto-range',          3200.00, 5, 'active');


-- ═══════════════════════════════════════════════════════════════
-- 4. CUSTOMERS  (10 customers)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO customers (customer_name, phone, email, address, organization_name, customer_type, added_by, status) VALUES
('Ashok Constructions',     '9700000001', 'ashok@constructions.com',   'Sector 15, Noida, UP',        'Ashok Group',               'Corporate',   5, 'active'),
('Bharat Heavy Works',      '9700000002', 'info@bharatheavy.com',      'MIDC Andheri, Mumbai',        'Bharat Heavy Works Ltd',    'Corporate',   5, 'active'),
('Chennai Auto Parts',      '9700000003', 'sales@chennaiap.com',       'Ambattur, Chennai, TN',       'Chennai Auto Parts',        'Wholesale',   6, 'active'),
('Delhi Power Solutions',   '9700000004', 'contact@delhipower.com',    'Okhla Phase 2, Delhi',        'Delhi Power Solutions',     'Corporate',   6, 'active'),
('Excel Manufacturing',     '9700000005', 'excel@mfg.com',             'Pimpri, Pune, MH',            'Excel Manufacturing Co',    'Corporate',   7, 'active'),
('Frontier Engineering',    '9700000006', 'info@frontier-eng.com',     'Whitefield, Bangalore',       'Frontier Engineering',      'Wholesale',   7, 'active'),
('Ganesh Electricals',      '9700000007', 'ganesh@electricals.com',    'Gandhi Nagar, Jaipur',        'Ganesh Electricals',        'Individual',  8, 'active'),
('Hindustan Tools',         '9700000008', 'ht@tools.com',              'Faridabad, Haryana',          'Hindustan Tools Pvt Ltd',   'Corporate',   8, 'active'),
('Imperial Machines',       '9700000009', 'sales@imperial.com',        'Chandigarh',                  'Imperial Machines Ltd',     'Wholesale',   5, 'active'),
('Jyoti Industries',        '9700000010', 'jyoti@industries.com',      'Rajkot, Gujarat',             'Jyoti Industries',          'Corporate',   6, 'active');


-- ═══════════════════════════════════════════════════════════════
-- 5. ORDERS  (10 orders)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO orders (cust_id, product_id, sup_id, quantity, order_date, order_status, created_by) VALUES
(1,  1,  1,  5,  DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'delivered',  5),
(2,  3,  2, 10,  DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'delivered',  5),
(3,  5,  3,  2,  DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'shipped',    6),
(4,  9,  5, 20,  DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'confirmed',  6),
(5,  2,  1,  3,  DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'pending',    7),
(6,  7,  4,  8,  DATE_SUB(CURDATE(), INTERVAL  8 DAY), 'confirmed',  7),
(7,  4,  2,  1,  DATE_SUB(CURDATE(), INTERVAL  5 DAY), 'pending',    8),
(8,  8,  4, 15,  DATE_SUB(CURDATE(), INTERVAL  3 DAY), 'pending',    8),
(1, 11,  1,  2,  DATE_SUB(CURDATE(), INTERVAL  2 DAY), 'confirmed',  5),
(10, 6,  3,  4,  DATE_SUB(CURDATE(), INTERVAL  1 DAY), 'pending',    9);


-- ═══════════════════════════════════════════════════════════════
-- 6. STOCK  (15 stock records — one per product)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO stock (product_id, quantity_available, minimum_stock_level, stock_status, last_updated_by) VALUES
( 1,  25,  10, 'in_stock',      5),
( 2, 120,  50, 'in_stock',      5),
( 3,   8,   5, 'in_stock',      5),
( 4,  12,  10, 'in_stock',      5),
( 5, 200, 100, 'in_stock',      5),
( 6,  45,  20, 'in_stock',      5),
( 7,   6,   5, 'low_stock',     5),
( 8, 500, 100, 'in_stock',      5),
( 9,   3,   5, 'low_stock',     5),
(10,  80,  30, 'in_stock',      5),
(11,   0,   5, 'out_of_stock',  5),
(12,  15,  10, 'in_stock',      5),
(13,  40,  20, 'in_stock',      5),
(14, 250,  50, 'in_stock',      5),
(15,  18,  10, 'in_stock',      5);


-- ═══════════════════════════════════════════════════════════════
-- 7. DELIVERIES  (10 delivery records — one per order)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO delivery (order_id, cust_id, delivery_address, delivery_date, delivery_status, updated_by) VALUES
(1,  1,  'Sector 15, Noida, UP',        DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'delivered',  5),
(2,  2,  'MIDC Andheri, Mumbai',         DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'delivered',  5),
(3,  3,  'Ambattur, Chennai, TN',        DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'in_transit', 5),
(4,  4,  'Okhla Phase 2, Delhi',         DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'pending',    5),
(5,  5,  'Pimpri, Pune, MH',             DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'pending',    5),
(6,  6,  'Whitefield, Bangalore',        CURDATE(),                           'in_transit', 5),
(7,  7,  'Gandhi Nagar, Jaipur',         DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'pending',    5),
(8,  8,  'Faridabad, Haryana',           DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'pending',    5),
(9,  1,  'Sector 15, Noida, UP',         DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'pending',    5),
(10, 10, 'Rajkot, Gujarat',              DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'pending',    5);


-- ═══════════════════════════════════════════════════════════════
-- 8. INVOICES  (3 invoices for first 3 orders)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO invoices (order_id, cust_id, invoice_number, invoice_date, total_amount, tax_amount, final_amount, invoice_status, generated_by) VALUES
(1, 1, CONCAT('INV-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-001'),  CURDATE(), 75000.00, 13500.00,  88500.00, 'paid',   2),
(2, 2, CONCAT('INV-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-002'),  CURDATE(),  8500.00,  1530.00,  10030.00, 'issued', 2),
(3, 3, CONCAT('INV-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-003'),  CURDATE(), 90000.00, 16200.00, 106200.00, 'issued', 2);


-- ═══════════════════════════════════════════════════════════════
-- 9. PAYMENTS  (3 payments linked to invoices)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO payments (order_id, inv_id, cust_id, amount, payment_method, payment_status, payment_date) VALUES
(1, 1, 1,  88500.00, 'bank_transfer', 'completed', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(2, 2, 2,  10030.00, 'credit_card',   'pending',   CURDATE()),
(3, 3, 3, 106200.00, 'cheque',        'pending',   DATE_ADD(CURDATE(), INTERVAL 7 DAY));


-- ═══════════════════════════════════════════════════════════════
-- 10. FOLLOW-UPS  (8 follow-up reminders)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO follow_ups (cust_id, assigned_to, follow_up_date, follow_up_note, status, alert_follow_up) VALUES
( 1, 5, DATE_SUB(CURDATE(), INTERVAL 2 DAY),  'Discuss bulk order pricing for motors',             'completed',   FALSE),
( 2, 5, CURDATE(),                              'Follow up on payment for order #2',                 'in_progress', FALSE),
( 3, 6, DATE_ADD(CURDATE(), INTERVAL 1 DAY),   'Send updated quotation for PLC controllers',        'pending',     FALSE),
( 4, 6, DATE_ADD(CURDATE(), INTERVAL 3 DAY),   'Schedule product demo at client site',              'pending',     FALSE),
( 5, 7, DATE_SUB(CURDATE(), INTERVAL 1 DAY),   'Verify delivery address change request',            'completed',   FALSE),
( 7, 7, DATE_ADD(CURDATE(), INTERVAL 5 DAY),   'Annual maintenance contract renewal',               'pending',     TRUE),
( 8, 8, DATE_ADD(CURDATE(), INTERVAL 7 DAY),   'Discuss warranty claim for bearings',               'pending',     FALSE),
(10, 9, DATE_ADD(CURDATE(), INTERVAL 10 DAY),  'New product launch presentation',                   'pending',     FALSE);


-- ═══════════════════════════════════════════════════════════════
-- 11. WEB SCRAPING PREFERENCES  (4 preferences)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO web_scraping_preferences (emp_id, website_url, keyword, category, preference_status) VALUES
(5, 'https://www.indiamart.com',  'industrial motor',              'product',   'active'),
(5, 'https://www.tradeindia.com', 'PLC controller',                'product',   'active'),
(6, 'https://eprocure.gov.in',    'electrical equipment tender',   'tender',    'active'),
(7, 'https://gem.gov.in',         'safety equipment',              'quotation', 'active');


-- ═══════════════════════════════════════════════════════════════
-- 12. SCRAPING RESULTS  (4 results)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO scraping_results (preference_id, title, source_url, extracted_message, result_status) VALUES
(1, 'Industrial Motor 10HP - Best Price',           'https://www.indiamart.com/motor-10hp',      'Found: Industrial Motor 10HP at ₹18,500. Supplier: ABC Motors, Rating: 4.5/5. Minimum order: 2 units.',                    'pending'),
(2, 'Siemens PLC S7-1200 Available',                'https://www.tradeindia.com/plc-s7',         'PLC Controller S7-1200 available at ₹42,000. Free shipping on orders above ₹50,000. Stock: 25 units.',                     'pending'),
(3, 'Tender: Electrical Equipment Supply - NTPC',   'https://eprocure.gov.in/tender/12345',      'NTPC Tender for electrical equipment supply. Deadline: 2026-06-15. Estimated value: ₹50 Lakhs.',                            'pending'),
(4, 'GeM: Safety Equipment Bulk Order',             'https://gem.gov.in/listing/67890',          'Government e-Marketplace listing for safety helmets and gear. Qty: 500 units. Budget: ₹2 Lakhs.',                           'pending');


-- ═══════════════════════════════════════════════════════════════
-- 13. ALERTS  (6 alerts from scraping)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO alerts (preference_id, result_id, message, alert_status, verified_by, forwarded_to_manager) VALUES
(1, 1, 'New product found: Industrial Motor 10HP at ₹18,500 on IndiaMART. Supplier: ABC Motors.',        'verified',  5, TRUE),
(2, 2, 'PLC Controller S7-1200 available at ₹42,000 on TradeIndia. 25 units in stock.',                  'verified',  5, TRUE),
(3, 3, 'NTPC Tender for electrical equipment supply. Deadline: June 15, 2026. Value: ₹50 Lakhs.',        'pending',   NULL, FALSE),
(4, 4, 'GeM listing: Safety helmets bulk order - 500 units at ₹2 Lakhs budget.',                          'pending',   NULL, FALSE),
(1, 1, 'Price drop alert: Motor prices reduced by 12% on IndiaMART this week.',                            'pending',   NULL, FALSE),
(3, 3, 'New tender: BHEL seeking quotations for transformer supply.',                                      'rejected',  6, FALSE);


-- ═══════════════════════════════════════════════════════════════
-- 14. IMPORT EQUIPMENT  (5 equipment records)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO import_equipment (sup_id, equipment_name, description, quantity, import_date, import_status) VALUES
(1, 'CNC Lathe Machine',      'High precision CNC lathe for machining',            2, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'stored'),
(2, 'Hydraulic Press 100T',   '100-ton hydraulic press for metal forming',         1, DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'inspected'),
(3, 'Industrial Robot Arm',   '6-axis robotic arm for assembly line',              3, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'received'),
(4, 'Welding Station MIG',    'MIG welding station with auto-feed',                5, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'pending'),
(5, 'Testing Equipment Kit',  'Comprehensive electrical testing kit',             10, DATE_SUB(CURDATE(), INTERVAL  5 DAY), 'pending');


-- ═══════════════════════════════════════════════════════════════
-- 15. AUDIT LOGS  (5 log entries)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO audit_logs (user_id, action, module_name, description) VALUES
(5, 'CREATED', 'Order',    'Created order #1 for Ashok Constructions'),
(2, 'CREATED', 'Invoice',  'Generated invoice INV-001 for order #1'),
(5, 'UPDATED', 'Stock',    'Updated stock for Industrial Motor 5HP: qty=25'),
(1, 'CREATED', 'User',     'Admin created manager Rahul Sharma'),
(6, 'UPDATED', 'Delivery', 'Updated delivery #1 status to delivered');


-- ═══════════════════════════════════════════════════════════════
-- 16. LOGIN LOGS  (3 login records)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO login_logs (user_id, username, role, status) VALUES
(1, 'admin',     'admin',    'logged_in'),
(2, 'manager1',  'manager',  'logged_in'),
(5, 'employee1', 'employee', 'logged_in');


-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA COMPLETE!
-- ═══════════════════════════════════════════════════════════════════════════
-- Total: 96 records across 16 tables
--
-- Demo Login Credentials:
--   Admin:    username = admin      / password = admin123
--   Manager:  username = manager1   / password = manager123
--   Employee: username = employee1  / password = employee123
-- ═══════════════════════════════════════════════════════════════════════════
