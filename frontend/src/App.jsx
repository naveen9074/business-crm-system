/**
 * Main application — routing with role-based protection.
 */
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './store/AuthContext'
import AppLayout from './components/AppLayout'

// Auth pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminManagersPage from './pages/admin/ManagersPage'
import AdminEmployeesPage from './pages/admin/EmployeesPage'
import AdminCustomersPage from './pages/admin/CustomersPage'
import AdminSuppliersPage from './pages/admin/SuppliersPage'
import AdminImportEquipmentPage from './pages/admin/ImportEquipmentPage'
import AdminStockPage from './pages/admin/StockPage'
import AdminPaymentsPage from './pages/admin/PaymentsPage'
import UserApprovalsPage from './pages/admin/UserApprovalsPage'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import MgrCustomersPage from './pages/manager/CustomersPage'
import MgrProductsPage from './pages/manager/ProductsPage'
import MgrOrdersPage from './pages/manager/OrdersPage'
import MgrStockPage from './pages/manager/StockPage'
import MgrDeliveriesPage from './pages/manager/DeliveriesPage'
import MgrPaymentsPage from './pages/manager/PaymentsPage'
import MgrInvoicesPage from './pages/manager/InvoicesPage'
import MgrFollowUpsPage from './pages/manager/FollowUpsPage'
import MgrAlertsPage from './pages/manager/AlertsPage'

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmpCustomersPage from './pages/employee/CustomersPage'
import EmpOrdersPage from './pages/employee/OrdersPage'
import EmpProductsPage from './pages/employee/ProductsPage'
import EmpStockPage from './pages/employee/StockPage'
import EmpDeliveriesPage from './pages/employee/DeliveriesPage'
import EmpPreferencesPage from './pages/employee/PreferencesPage'
import EmpAlertsPage from './pages/employee/AlertsPage'
import EmpFollowUpsPage from './pages/employee/FollowUpsPage'

// Shared pages
import SendNotificationPage from './pages/SendNotificationPage'
import NotificationsPage from './pages/NotificationsPage'

function RoleLayout({ role }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== role) return <Navigate to={`/${user?.role}`} replace />

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default function App() {
  const { isAuthenticated, user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin */}
        <Route path="/admin" element={<RoleLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="managers" element={<AdminManagersPage />} />
          <Route path="employees" element={<AdminEmployeesPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
          <Route path="import-equipment" element={<AdminImportEquipmentPage />} />
          <Route path="stock" element={<AdminStockPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="approvals" element={<UserApprovalsPage />} />
          <Route path="send-notification" element={<SendNotificationPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Manager */}
        <Route path="/manager" element={<RoleLayout role="manager" />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="customers" element={<MgrCustomersPage />} />
          <Route path="products" element={<MgrProductsPage />} />
          <Route path="orders" element={<MgrOrdersPage />} />
          <Route path="stock" element={<MgrStockPage />} />
          <Route path="deliveries" element={<MgrDeliveriesPage />} />
          <Route path="payments" element={<MgrPaymentsPage />} />
          <Route path="invoices" element={<MgrInvoicesPage />} />
          <Route path="follow-ups" element={<MgrFollowUpsPage />} />
          <Route path="alerts" element={<MgrAlertsPage />} />
          <Route path="send-notification" element={<SendNotificationPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Employee */}
        <Route path="/employee" element={<RoleLayout role="employee" />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="customers" element={<EmpCustomersPage />} />
          <Route path="orders" element={<EmpOrdersPage />} />
          <Route path="products" element={<EmpProductsPage />} />
          <Route path="stock" element={<EmpStockPage />} />
          <Route path="deliveries" element={<EmpDeliveriesPage />} />
          <Route path="preferences" element={<EmpPreferencesPage />} />
          <Route path="alerts" element={<EmpAlertsPage />} />
          <Route path="follow-ups" element={<EmpFollowUpsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? `/${user?.role}` : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
