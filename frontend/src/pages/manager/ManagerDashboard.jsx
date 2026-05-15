import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import axios from 'axios';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [customersRes, ordersRes, invoicesRes] = await Promise.all([
        axios.get('/api/manager/customers'),
        axios.get('/api/manager/orders'),
        axios.get('/api/manager/invoices'),
      ]);

      setStats({
        totalCustomers: customersRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue: ordersRes.data.reduce((sum, order) => sum + (order.total || 0), 0),
        pendingInvoices: invoicesRes.data.filter((inv) => inv.status !== 'paid')
          .length,
      });

      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', path: '/manager/dashboard' },
    { label: 'Dashboard', path: '/manager/dashboard' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Manager Dashboard"
        subtitle="Sales performance and customer insights at a glance."
        breadcrumbs={breadcrumbs}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-3">Welcome, Manager</h2>
          <p className="text-white/90 max-w-2xl text-lg">
            Monitor your sales pipeline, manage customer relationships, and track order fulfillment.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/manager/customers')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all active:scale-95"
            >
              View Customers
            </button>
            <button
              onClick={() => navigate('/manager/orders')}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Active relationships"
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendPercentage="8"
          onClick={() => navigate('/manager/customers')}
          isLoading={isLoading}
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle="This month"
          icon={ShoppingCart}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          trend="up"
          trendPercentage="23"
          onClick={() => navigate('/manager/orders')}
          isLoading={isLoading}
          gradientFrom="from-purple-50"
          gradientTo="to-purple-100"
        />

        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
          subtitle="Gross sales"
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendPercentage="15"
          onClick={() => navigate('/manager/payments')}
          isLoading={isLoading}
          gradientFrom="from-green-50"
          gradientTo="to-green-100"
        />

        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          subtitle="Awaiting payment"
          icon={AlertCircle}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend="down"
          trendPercentage="5"
          onClick={() => navigate('/manager/invoices')}
          isLoading={isLoading}
          gradientFrom="from-orange-50"
          gradientTo="to-orange-100"
        />
      </div>

      {/* Sales Chart & Top Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sales Trend</h3>
            <p className="text-gray-600 text-sm">Monthly performance analysis</p>
          </div>

          <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Sales chart placeholder</p>
              <p className="text-gray-400 text-sm mt-1">Integrate with Recharts library</p>
            </div>
          </div>
        </div>

        {/* Quick Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Tasks</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Follow-ups',
                count: 5,
                icon: Clock,
                path: '/manager/followups',
              },
              {
                title: 'Pending Alerts',
                count: 3,
                icon: AlertCircle,
                path: '/manager/alerts',
              },
              {
                title: 'New Customers',
                count: 8,
                icon: Users,
                path: '/manager/customers',
              },
              {
                title: 'Orders in Transit',
                count: 12,
                icon: ShoppingCart,
                path: '/manager/deliveries',
              },
            ].map((task, idx) => {
              const Icon = task.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(task.path)}
                  className="w-full p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 border border-gray-200 hover:border-indigo-200 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{task.title}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {task.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            <p className="text-gray-600 text-sm">Latest order activity</p>
          </div>
          <button
            onClick={() => navigate('/manager/orders')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View All →
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer_name || 'Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${order.total || 0}
                    </p>
                    <p className="text-xs text-gray-500">{order.status || 'Pending'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
