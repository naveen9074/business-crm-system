import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Truck,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const Sidebar = ({ userRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: `/${userRole}`,
      },
    ];

    const adminItems = [
      ...baseItems,
      {
        id: 'managers',
        label: 'Managers',
        icon: Users,
        path: '/admin/managers',
      },
      {
        id: 'employees',
        label: 'Employees',
        icon: Users,
        path: '/admin/employees',
      },
      {
        id: 'customers',
        label: 'Customers',
        icon: ShoppingCart,
        path: '/admin/customers',
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        icon: Truck,
        path: '/admin/suppliers',
      },
      {
        id: 'stock',
        label: 'Stock',
        icon: Package,
        path: '/admin/stock',
      },
      {
        id: 'import-equipment',
        label: 'Import Equipment',
        icon: Settings,
        path: '/admin/import-equipment',
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: DollarSign,
        path: '/admin/payments',
      },
    ];

    const managerItems = [
      ...baseItems,
      {
        id: 'customers',
        label: 'Customers',
        icon: ShoppingCart,
        path: '/manager/customers',
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: FileText,
        path: '/manager/orders',
      },
      {
        id: 'products',
        label: 'Products',
        icon: Package,
        path: '/manager/products',
      },
      {
        id: 'stock',
        label: 'Stock',
        icon: TrendingUp,
        path: '/manager/stock',
      },
      {
        id: 'deliveries',
        label: 'Deliveries',
        icon: Truck,
        path: '/manager/deliveries',
      },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: FileText,
        path: '/manager/invoices',
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: DollarSign,
        path: '/manager/payments',
      },
      {
        id: 'followups',
        label: 'Follow-ups',
        icon: Clock,
        path: '/manager/follow-ups',
      },
      {
        id: 'alerts',
        label: 'Alerts',
        icon: AlertCircle,
        path: '/manager/alerts',
      },
    ];

    const employeeItems = [
      ...baseItems,
      {
        id: 'customers',
        label: 'Customers',
        icon: ShoppingCart,
        path: '/employee/customers',
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: FileText,
        path: '/employee/orders',
      },
      {
        id: 'products',
        label: 'Products',
        icon: Package,
        path: '/employee/products',
      },
      {
        id: 'stock',
        label: 'Stock',
        icon: TrendingUp,
        path: '/employee/stock',
      },
      {
        id: 'deliveries',
        label: 'Deliveries',
        icon: Truck,
        path: '/employee/deliveries',
      },
      {
        id: 'followups',
        label: 'Follow-ups',
        icon: Clock,
        path: '/employee/follow-ups',
      },
      {
        id: 'alerts',
        label: 'Alerts',
        icon: AlertCircle,
        path: '/employee/alerts',
      },
      {
        id: 'preferences',
        label: 'Preferences',
        icon: Settings,
        path: '/employee/preferences',
      },
    ];

    switch (userRole) {
      case 'admin':
        return adminItems;
      case 'manager':
        return managerItems;
      case 'employee':
        return employeeItems;
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path || (path === `/${userRole}` && location.pathname === `/${userRole}/`);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-gradient-to-b from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-xl transition-all duration-300 z-40
          ${isOpen ? 'w-72' : 'w-20'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-hidden
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20 flex items-center justify-between animate-slide-in-left">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">CRMS</h2>
                <p className="text-xs text-white/70">{userRole?.toUpperCase()}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                    ${
                      active
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  title={!isOpen ? item.label : ''}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-slide-in-right" />
                  )}

                  <Icon size={20} className="flex-shrink-0" />

                  {isOpen && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </>
                  )}

                  {/* Hover tooltip when collapsed */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Section - Logout */}
        <div className="p-4 border-t border-white/20 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all group"
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span className="flex-1 text-left font-medium">Logout</span>}

            {!isOpen && (
              <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Logout
              </div>
            )}
          </button>

          {isOpen && (
            <p className="text-xs text-white/60 text-center">
              © 2025 Business CRM
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
