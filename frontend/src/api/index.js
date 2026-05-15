import axios from 'axios'
import { useAuthStore, DEV_BYPASS } from '../store/authStore'
import { findMock } from './mockData'

const api = axios.create({
    baseURL: '/api/v1',
})

// Attach auth token + tenant header to every request
// In DEV_BYPASS mode we skip the fake token (not a real JWT → would cause 401 loop)
api.interceptors.request.use((config) => {
    const { token, tenantId } = useAuthStore.getState()
    if (token && !DEV_BYPASS) config.headers.Authorization = `Bearer ${token}`
    if (tenantId) config.headers['X-Tenant-ID'] = String(tenantId)
    return config
})

// ── Mock fallback + auto-logout on 401 ──────────────────────
api.interceptors.response.use(
    (res) => res,
    (err) => {
        // Auto-logout on 401 — but ONLY when not in dev bypass mode
        // (in bypass mode, 401s just fall through to the mock data below)
        if (err.response?.status === 401 && !DEV_BYPASS) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(err)
        }

        // For GET requests that fail (no DB, backend error, network error)
        // → return mock data so the UI is fully functional for preview
        const url = err.config?.url || ''
        const method = (err.config?.method || 'get').toLowerCase()
        if (method === 'get') {
            const mockData = findMock(url)
            if (mockData !== null && mockData !== undefined) {
                console.info(`[Mock] ${url} → mock data served`)
                return Promise.resolve({ data: mockData, status: 200 })
            }
        }

        return Promise.reject(err)
    }
)

// ── Auth ────────────────────────────────────────────────────
export const authApi = {
    login: (email, password) =>
        api.post('/auth/login', new URLSearchParams({ username: email, password })),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
}

// ── Customers ───────────────────────────────────────────────
export const customersApi = {
    list: (params) => api.get('/customers', { params }),
    get: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.patch(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
}

// ── Leads ────────────────────────────────────────────────────
export const leadsApi = {
    list: (params) => api.get('/leads', { params }),
    get: (id) => api.get(`/leads/${id}`),
    create: (data) => api.post('/leads', data),
    update: (id, data) => api.patch(`/leads/${id}`, data),
    delete: (id) => api.delete(`/leads/${id}`),
}

// ── Pipeline ─────────────────────────────────────────────────
export const pipelineApi = {
    stages: () => api.get('/pipeline/stages'),
    createStage: (data) => api.post('/pipeline/stages', data),
    deals: (params) => api.get('/pipeline/deals', { params }),
    createDeal: (data) => api.post('/pipeline/deals', data),
    updateDeal: (id, data) => api.patch(`/pipeline/deals/${id}`, data),
    deleteDeal: (id) => api.delete(`/pipeline/deals/${id}`),
}

// ── Activities ───────────────────────────────────────────────
export const activitiesApi = {
    list: (params) => api.get('/activities', { params }),
    create: (data) => api.post('/activities', data),
    listComms: (params) => api.get('/activities/communications', { params }),
    createComm: (data) => api.post('/activities/communications', data),
}

// ── Alerts ───────────────────────────────────────────────────
export const alertsApi = {
    list: (params) => api.get('/alerts', { params }),
    acknowledge: (id) => api.patch(`/alerts/${id}/acknowledge`),
    resolve: (id) => api.patch(`/alerts/${id}/resolve`),
    listRules: () => api.get('/alerts/rules'),
    createRule: (data) => api.post('/alerts/rules', data),
}

// ── Analytics ────────────────────────────────────────────────
export const analyticsApi = {
    summary: () => api.get('/analytics/summary'),
    revenueTrend: (months) => api.get('/analytics/revenue-trend', { params: { months } }),
    pipelineFunnel: () => api.get('/analytics/pipeline-funnel'),
    agentPerformance: () => api.get('/analytics/agent-performance'),
    customerSegments: () => api.get('/analytics/customer-segments'),
}

// ── ML ───────────────────────────────────────────────────────
export const mlApi = {
    batchScore: () => api.post('/ml/batch-lead-scores'),
    forecast: (data) => api.post('/ml/forecast', data),
    segmentation: () => api.get('/ml/segmentation'),
    churnRisk: () => api.get('/ml/churn-risk'),
    recommend: (data) => api.post('/ml/recommend', data),
}

// ── Config ───────────────────────────────────────────────────
export const configApi = {
    get: () => api.get('/config'),
    update: (data) => api.patch('/config', data),
    terminology: () => api.get('/config/terminology'),
    customFields: (entity_type) => api.get('/config/custom-fields', { params: { entity_type } }),
    createField: (data) => api.post('/config/custom-fields', data),
    deleteField: (id) => api.delete(`/config/custom-fields/${id}`),
}

// ── Tenants (Super Admin) ─────────────────────────────────────
export const tenantsApi = {
    list: () => api.get('/tenants'),
    create: (data) => api.post('/tenants', data),
    update: (id, data) => api.patch(`/tenants/${id}`, data),
    delete: (id) => api.delete(`/tenants/${id}`),
}

// ── Tags ─────────────────────────────────────────────────────
export const tagsApi = {
    list: () => api.get('/tags'),
    create: (data) => api.post('/tags', data),
}

export default api
