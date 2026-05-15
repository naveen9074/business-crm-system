// ── Realistic mock CRM data for UI preview (no DB needed) ────
// This file is used by the mock interceptor in api/index.js

export const MOCK = {
    '/analytics/summary': {
        total_customers: 1284,
        active_customers: 947,
        total_leads: 342,
        open_leads: 218,
        pipeline_value: 2847500,
        total_deals: 89,
        avg_lead_score: 67,
        conversion_rate: 31.4,
    },

    '/analytics/revenue-trend': [
        { month: 'Aug', value: 312000, is_forecast: false },
        { month: 'Sep', value: 287000, is_forecast: false },
        { month: 'Oct', value: 398000, is_forecast: false },
        { month: 'Nov', value: 421000, is_forecast: false },
        { month: 'Dec', value: 387000, is_forecast: false },
        { month: 'Jan', value: 456000, is_forecast: false },
        { month: 'Feb', value: 492000, is_forecast: true },
        { month: 'Mar', value: 521000, is_forecast: true },
        { month: 'Apr', value: 548000, is_forecast: true },
    ],

    '/analytics/pipeline-funnel': [
        { stage: 'Prospecting', count: 54, value: 890000 },
        { stage: 'Qualification', count: 38, value: 740000 },
        { stage: 'Proposal', count: 27, value: 620000 },
        { stage: 'Negotiation', count: 18, value: 410000 },
        { stage: 'Closed Won', count: 12, value: 287500 },
    ],

    '/analytics/customer-segments': {
        Champions: { count: 187, avg_value: 12400 },
        'Loyal Customers': { count: 324, avg_value: 7800 },
        'Potential Loyalists': { count: 218, avg_value: 4200 },
        'At Risk': { count: 156, avg_value: 3100 },
        'Lost Customers': { count: 89, avg_value: 1100 },
        'New Customers': { count: 310, avg_value: 2600 },
    },

    '/analytics/agent-performance': [
        { agent: 'Priya Sharma', deals_closed: 24, revenue: 312000, avg_score: 82 },
        { agent: 'Rohan Mehta', deals_closed: 19, revenue: 248000, avg_score: 74 },
        { agent: 'Anjali Nair', deals_closed: 22, revenue: 290000, avg_score: 79 },
        { agent: 'Kiran Patel', deals_closed: 15, revenue: 187000, avg_score: 68 },
    ],

    '/customers': [
        { id: 1, name: 'Infosys Ltd', email: 'contact@infosys.com', phone: '+91 80 4116 7000', company: 'Infosys', status: 'active', custom_fields: {} },
        { id: 2, name: 'TCS Innovations', email: 'bizdev@tcs.com', phone: '+91 22 6778 9000', company: 'TCS', status: 'active', custom_fields: {} },
        { id: 3, name: 'Wipro Digital', email: 'sales@wipro.com', phone: '+91 80 2844 0011', company: 'Wipro', status: 'prospect', custom_fields: {} },
        { id: 4, name: 'Mahindra Tech', email: 'partnerships@mahindra.com', phone: '+91 22 2490 1441', company: 'Mahindra', status: 'active', custom_fields: {} },
        { id: 5, name: 'Reliance Retail', email: 'crm@ril.com', phone: '+91 22 3555 5000', company: 'Reliance', status: 'inactive', custom_fields: {} },
        { id: 6, name: 'HCL Technologies', email: 'bd@hcltech.com', phone: '+91 120 676 4000', company: 'HCL', status: 'active', custom_fields: {} },
        { id: 7, name: 'Tech Mahindra', email: 'enterprise@techmahindra.com', phone: '+91 20 6652 5000', company: 'Tech Mahindra', status: 'prospect', custom_fields: {} },
        { id: 8, name: 'Bajaj Auto', email: 'fleet@bajajauto.com', phone: '+91 20 6610 9999', company: 'Bajaj', status: 'churned', custom_fields: {} },
    ],

    '/leads': [
        { id: 1, title: 'Enterprise Cloud Migration', source: 'referral', status: 'qualified', score: 91, estimated_value: 480000, notes: 'CTO interested in full migration' },
        { id: 2, title: 'Fleet Management SaaS', source: 'website', status: 'contacted', score: 74, estimated_value: 120000, notes: 'Requested product demo' },
        { id: 3, title: 'Healthcare Data Platform', source: 'event', status: 'new', score: 58, estimated_value: 220000, notes: 'Met at MedTech Summit' },
        { id: 4, title: 'Insurance Policy Automation', source: 'cold_call', status: 'qualified', score: 83, estimated_value: 390000, notes: 'Ready for proposal stage' },
        { id: 5, title: 'Retail Analytics Dashboard', source: 'social_media', status: 'new', score: 42, estimated_value: 85000, notes: 'LinkedIn inbound' },
        { id: 6, title: 'ERP Integration Project', source: 'referral', status: 'contacted', score: 67, estimated_value: 175000, notes: 'Referred by Infosys account' },
        { id: 7, title: 'Supply Chain Optimization', source: 'email', status: 'unqualified', score: 28, estimated_value: 50000, notes: 'Budget constraints noted' },
        { id: 8, title: 'AI CRM Implementation', source: 'website', status: 'converted', score: 95, estimated_value: 650000, notes: 'Signed! Starting onboarding' },
    ],

    '/pipeline/stages': [
        { id: 1, name: 'Prospecting', color: '#6366f1', position: 0 },
        { id: 2, name: 'Qualification', color: '#8b5cf6', position: 1 },
        { id: 3, name: 'Proposal', color: '#f59e0b', position: 2 },
        { id: 4, name: 'Negotiation', color: '#ef4444', position: 3 },
        { id: 5, name: 'Closed Won', color: '#22c55e', position: 4 },
    ],

    '/pipeline/deals': [
        { id: 1, title: 'Infosys Cloud Bundle', stage_id: 1, value: 480000, probability: 20, customer_id: 1 },
        { id: 2, title: 'TCS Analytics Suite', stage_id: 2, value: 320000, probability: 40, customer_id: 2 },
        { id: 3, title: 'Wipro CRM Rollout', stage_id: 3, value: 175000, probability: 60, customer_id: 3 },
        { id: 4, title: 'Mahindra Fleet SaaS', stage_id: 4, value: 220000, probability: 75, customer_id: 4 },
        { id: 5, title: 'Reliance Retail BI', stage_id: 5, value: 410000, probability: 95, customer_id: 5 },
        { id: 6, title: 'HCL Integration', stage_id: 1, value: 95000, probability: 15, customer_id: 6 },
        { id: 7, title: 'Tech M ERP', stage_id: 2, value: 280000, probability: 35, customer_id: 7 },
        { id: 8, title: 'Bajaj Insurance AI', stage_id: 3, value: 390000, probability: 55, customer_id: 8 },
    ],

    '/activities': [
        { id: 1, activity_type: 'call', entity_type: 'customer', entity_id: 1, notes: 'Discussed Q2 renewal roadmap with CTO', duration_minutes: 45, created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, activity_type: 'email', entity_type: 'lead', entity_id: 2, notes: 'Sent product demo video and pricing sheet', duration_minutes: 0, created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: 3, activity_type: 'meeting', entity_type: 'deal', entity_id: 3, notes: 'In-person proposal walkthrough at their HQ', duration_minutes: 90, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 4, activity_type: 'demo', entity_type: 'lead', entity_id: 4, notes: 'Live product demo — excellent engagement', duration_minutes: 60, created_at: new Date(Date.now() - 172800000).toISOString() },
        { id: 5, activity_type: 'note', entity_type: 'customer', entity_id: 5, notes: 'Flagged for churn risk — follow up required', duration_minutes: 0, created_at: new Date(Date.now() - 259200000).toISOString() },
        { id: 6, activity_type: 'call', entity_type: 'deal', entity_id: 6, notes: 'Pricing negotiation call — counter offer made', duration_minutes: 30, created_at: new Date(Date.now() - 345600000).toISOString() },
    ],

    '/alerts': [
        { id: 1, title: 'Churn Risk Detected', message: 'Bajaj Auto has not engaged in 45 days — high churn probability (78%)', alert_type: 'churn_risk', status: 'pending', ml_score: 78, created_at: new Date(Date.now() - 1800000).toISOString() },
        { id: 2, title: 'Renewal Opportunity', message: 'Infosys contract expires in 30 days — schedule renewal call', alert_type: 'renewal', status: 'pending', ml_score: 92, created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, title: 'Inactive Customer', message: 'Reliance Retail has been inactive for 60 days', alert_type: 'inactive_customer', status: 'acknowledged', ml_score: 65, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 4, title: 'High-Value Lead Ready', message: 'AI CRM Implementation lead scored 95/100 — ready to close', alert_type: 'ml_opportunity', status: 'pending', ml_score: 95, created_at: new Date(Date.now() - 7200000).toISOString() },
    ],

    '/alerts/rules': [
        { id: 1, name: 'Inactive 30+ Days', rule_json: { field: 'days_since_last_contact', op: '>', value: 30 }, alert_type: 'rule_based', is_active: true },
        { id: 2, name: 'High Churn Risk', rule_json: { field: 'churn_probability', op: '>', value: 0.7 }, alert_type: 'churn_risk', is_active: true },
        { id: 3, name: 'Renewal Due Soon', rule_json: { field: 'days_to_renewal', op: '<', value: 30 }, alert_type: 'renewal', is_active: false },
    ],

    '/ml/churn-risk': [
        { customer_id: 8, name: 'Bajaj Auto', churn_probability: 0.78, risk_level: 'high' },
        { customer_id: 5, name: 'Reliance Retail', churn_probability: 0.61, risk_level: 'medium' },
        { customer_id: 7, name: 'Tech Mahindra', churn_probability: 0.44, risk_level: 'medium' },
        { customer_id: 3, name: 'Wipro Digital', churn_probability: 0.22, risk_level: 'low' },
        { customer_id: 4, name: 'Mahindra Tech', churn_probability: 0.18, risk_level: 'low' },
    ],

    '/ml/segmentation': {
        customers: [],
        summary: {
            Champions: { count: 187, avg_rfm: 4.8 },
            'Loyal Customers': { count: 324, avg_rfm: 4.1 },
            'Potential Loyalists': { count: 218, avg_rfm: 3.3 },
            'At Risk': { count: 156, avg_rfm: 2.2 },
            'Lost Customers': { count: 89, avg_rfm: 1.1 },
            'New Customers': { count: 310, avg_rfm: 2.0 },
        },
    },

    '/tenants': [
        { id: 1, name: 'Demo Company', slug: 'demo', business_type: 'service', is_active: true },
        { id: 2, name: 'Acme Insurance', slug: 'acme-insurance', business_type: 'insurance', is_active: true },
        { id: 3, name: 'RetailPro', slug: 'retailpro', business_type: 'retail', is_active: true },
        { id: 4, name: 'ManuCorp', slug: 'manucorp', business_type: 'manufacturing', is_active: false },
    ],

    '/config': {
        business_type: 'service',
        modules: {
            customers: true, leads: true, pipeline: true,
            activities: true, communications: true, alerts: true,
            analytics: true, ml_insights: true, web_scraping: false,
        },
        terminology: {
            customer: 'Client', lead: 'Prospect', deal: 'Opportunity',
            pipeline: 'Sales Funnel', activity: 'Interaction',
        },
    },

    '/config/custom-fields': [
        { id: 1, entity_type: 'customer', field_name: 'gstin', field_label: 'GST Number', field_type: 'text', is_required: false },
        { id: 2, entity_type: 'lead', field_name: 'budget_range', field_label: 'Budget Range (₹)', field_type: 'dropdown', is_required: true },
        { id: 3, entity_type: 'deal', field_name: 'contract_signed', field_label: 'Contract Signed', field_type: 'checkbox', is_required: false },
    ],

    '/tags': [
        { id: 1, name: 'Enterprise', color: '#6366f1' },
        { id: 2, name: 'High Priority', color: '#ef4444' },
        { id: 3, name: 'BFSI', color: '#06b6d4' },
        { id: 4, name: 'Renewal', color: '#22c55e' },
    ],

    '/tags/users': [
        { id: 2, email: 'admin@demo.com', full_name: 'Demo Admin', role: 'admin', is_active: true },
        { id: 3, email: 'priya@demo.com', full_name: 'Priya Sharma', role: 'agent', is_active: true },
        { id: 4, email: 'rohan@demo.com', full_name: 'Rohan Mehta', role: 'manager', is_active: true },
    ],
}

// ── Match a URL path to a mock key (strip query params & IDs) ──
export function findMock(url) {
    // Exact match first
    if (MOCK[url]) return MOCK[url]
    // Strip query string
    const base = url.split('?')[0]
    if (MOCK[base]) return MOCK[base]
    // Match by prefix (for endpoints with IDs)
    const key = Object.keys(MOCK).find(k => base.startsWith(k) || k.startsWith(base))
    return key ? MOCK[key] : null
}
