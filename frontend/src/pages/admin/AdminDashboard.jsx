import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  ShoppingCart,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalManagers: 0,
    totalEmployees: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch stats from API
      const [managersRes, employeesRes, customersRes, suppliersRes] =
        await Promise.all([
          axios.get('/api/admin/managers'),
          axios.get('/api/admin/employees'),
          axios.get('/api/admin/customers'),
          axios.get('/api/admin/suppliers'),
        ]);

      setStats({
        totalManagers: managersRes.data.length,
        totalEmployees: employeesRes.data.length,
        totalCustomers: customersRes.data.length,
        totalSuppliers: suppliersRes.data.length,
      });

      // Mock recent activities - replace with API call if available
      setRecentActivities([
        {
          id: 1,
          activity: 'New manager registered',
          user: 'John Doe',
          timestamp: '2 hours ago',
          type: 'user_created',
        },
        {
          id: 2,
          activity: 'Employee deleted',
          user: 'System Admin',
          timestamp: '5 hours ago',
          type: 'user_deleted',
        },
        {
          id: 3,
          activity: 'Supplier created',
          user: 'Jane Smith',
          timestamp: '1 day ago',
          type: 'supplier_created',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', path: '/admin/dashboard' },
    { label: 'Dashboard', path: '/admin/dashboard' },
  ];

  const handleNewRecord = {
    managers: () => navigate('/admin/managers'),
    employees: () => navigate('/admin/employees'),
    customers: () => navigate('/admin/customers'),
    suppliers: () => navigate('/admin/suppliers'),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Welcome back! Here's your business overview."
        breadcrumbs={breadcrumbs}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 md:p-12 text-white overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-3">Welcome to Business CRM</h2>
          <p className="text-white/90 max-w-2xl text-lg">
            You have full administrative access. Monitor your team, manage resources, and oversee all
            business operations.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/admin/managers')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all active:scale-95"
            >
              View Managers
            </button>
            <button
              onClick={() => navigate('/admin/employees')}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              View Employees
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Managers"
          value={stats.totalManagers}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendPercentage="12"
          onClick={() => navigate('/admin/managers')}
          isLoading={isLoading}
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100"
        />

        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendPercentage="8"
          onClick={() => navigate('/admin/employees')}
          isLoading={isLoading}
          gradientFrom="from-green-50"
          gradientTo="to-green-100"
        />

        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={ShoppingCart}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          trend="up"
          trendPercentage="15"
          onClick={() => navigate('/admin/customers')}
          isLoading={isLoading}
          gradientFrom="from-purple-50"
          gradientTo="to-purple-100"
        />

        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={Package}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend="down"
          trendPercentage="3"
          isLoading={isLoading}
          gradientFrom="from-orange-50"
          gradientTo="to-orange-100"
        />
      </div>

      {/* Charts & Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Growth Overview</h3>
            <p className="text-gray-600 text-sm">Last 30 days performance</p>
          </div>

          {/* Chart placeholder - Replace with Recharts if needed */}
          <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                Integration with Recharts or Chart.js recommended
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Visualize managers, employees, customers trends
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <Activity size={20} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {activity.timestamp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Add Manager',
              description: 'Create a new manager account',
              icon: Users,
              action: () => navigate('/admin/managers'),
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Add Employee',
              description: 'Register a new employee',
              icon: Users,
              action: () => navigate('/admin/employees'),
              color: 'from-green-500 to-green-600',
            },
            {
              title: 'View Suppliers',
              description: 'Manage supplier information',
              icon: Package,
              action: () => navigate('/admin/suppliers'),
              color: 'from-orange-500 to-orange-600',
            },
            {
              title: 'View Payments',
              description: 'Check payment records',
              icon: TrendingUp,
              action: () => navigate('/admin/payments'),
              color: 'from-purple-500 to-purple-600',
            },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.action}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-white text-left hover-lift group transition-all`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h4 className="font-semibold mb-1">{action.title}</h4>
                <p className="text-sm text-white/80">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
