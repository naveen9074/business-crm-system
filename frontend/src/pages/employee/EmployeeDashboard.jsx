import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  Settings,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import axios from 'axios';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingDeliveries: 0,
    stockAlerts: 0,
    completedTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, deliveriesRes, stockRes] = await Promise.all([
        axios.get('/api/employee/orders'),
        axios.get('/api/employee/deliveries'),
        axios.get('/api/employee/stock'),
      ]);

      setStats({
        todayOrders: ordersRes.data.length,
        pendingDeliveries: deliveriesRes.data.filter(
          (d) => d.status !== 'delivered'
        ).length,
        stockAlerts: stockRes.data.filter((s) => s.status === 'low').length,
        completedTasks: Math.floor(Math.random() * 10) + 5, // Mock data
      });

      // Mock tasks data
      setTasks([
        {
          id: 1,
          title: 'Process pending orders',
          dueTime: '2:00 PM',
          priority: 'high',
          completed: false,
        },
        {
          id: 2,
          title: 'Update stock status',
          dueTime: '3:30 PM',
          priority: 'medium',
          completed: false,
        },
        {
          id: 3,
          title: 'Verify alerts',
          dueTime: '4:00 PM',
          priority: 'high',
          completed: false,
        },
        {
          id: 4,
          title: 'Check delivery status',
          dueTime: '5:00 PM',
          priority: 'medium',
          completed: false,
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', path: '/employee/dashboard' },
    { label: 'Dashboard', path: '/employee/dashboard' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Employee Dashboard"
        subtitle="Your daily tasks and performance overview."
        breadcrumbs={breadcrumbs}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-3">Good to see you!</h2>
          <p className="text-white/90 max-w-2xl text-lg">
            You're all set to manage orders, track deliveries, and maintain inventory today.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/employee/orders')}
              className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-all active:scale-95"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/employee/stock')}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Check Stock
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          subtitle="To process"
          icon={Package}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendPercentage="5"
          onClick={() => navigate('/employee/orders')}
          isLoading={isLoading}
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100"
        />

        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          subtitle="In progress"
          icon={Truck}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend="up"
          trendPercentage="3"
          onClick={() => navigate('/employee/deliveries')}
          isLoading={isLoading}
          gradientFrom="from-orange-50"
          gradientTo="to-orange-100"
        />

        <StatCard
          title="Stock Alerts"
          value={stats.stockAlerts}
          subtitle="Low inventory"
          icon={AlertCircle}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          trend="down"
          trendPercentage="2"
          onClick={() => navigate('/employee/stock')}
          isLoading={isLoading}
          gradientFrom="from-red-50"
          gradientTo="to-red-100"
        />

        <StatCard
          title="Completed Today"
          value={stats.completedTasks}
          subtitle="Tasks finished"
          icon={CheckCircle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendPercentage="12"
          isLoading={isLoading}
          gradientFrom="from-green-50"
          gradientTo="to-green-100"
        />
      </div>

      {/* Tasks & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Today's Tasks</h3>
            <p className="text-gray-600 text-sm">Your daily checklist</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      defaultChecked={task.completed}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-600">Due at {task.dueTime}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Add Order',
                icon: Package,
                path: '/employee/orders',
                color: 'from-blue-500 to-blue-600',
              },
              {
                label: 'Update Delivery',
                icon: Truck,
                path: '/employee/deliveries',
                color: 'from-orange-500 to-orange-600',
              },
              {
                label: 'Check Stock',
                icon: Package,
                path: '/employee/stock',
                color: 'from-green-500 to-green-600',
              },
              {
                label: 'View Alerts',
                icon: AlertCircle,
                path: '/employee/alerts',
                color: 'from-red-500 to-red-600',
              },
              {
                label: 'Follow-ups',
                icon: Clock,
                path: '/employee/followups',
                color: 'from-purple-500 to-purple-600',
              },
              {
                label: 'Preferences',
                icon: Settings,
                path: '/employee/preferences',
                color: 'from-gray-600 to-gray-700',
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className={`w-full bg-gradient-to-r ${action.color} text-white rounded-lg p-4 font-medium hover:shadow-lg active:scale-95 transition-all flex items-center gap-3 group`}
                >
                  <Icon size={20} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Productivity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Orders',
            value: '142',
            unit: 'this month',
            color: 'from-blue-500 to-blue-600',
          },
          {
            label: 'Delivered',
            value: '128',
            unit: 'successfully',
            color: 'from-green-500 to-green-600',
          },
          {
            label: 'Accuracy',
            value: '98.5%',
            unit: 'error-free',
            color: 'from-purple-500 to-purple-600',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-md p-6 text-white hover-lift`}
          >
            <p className="text-white/80 text-sm font-medium mb-2">{stat.label}</p>
            <p className="text-4xl font-bold mb-1">{stat.value}</p>
            <p className="text-white/70 text-sm">{stat.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
