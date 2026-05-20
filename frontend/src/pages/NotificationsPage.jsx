import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, Trash2, MailOpen, Mail } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.notification_id === id ? { ...n, status: 'read' } : n)
      );
    } catch (e) { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    } catch (e) { /* silent */ }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.notification_id !== id));
    } catch (e) { /* silent */ }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.status !== 'unread') return false;
    if (filter === 'read' && n.status !== 'read') return false;
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(term) ||
      n.message?.toLowerCase().includes(term) ||
      n.sender_name?.toLowerCase().includes(term)
    );
  });

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="All Notifications"
        subtitle="Manage your alerts and reminders"
        action={
          <button onClick={markAllRead} className="btn btn-secondary flex items-center gap-2 rounded-xl">
            <CheckCheck size={18} />
            Mark all as read
          </button>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search notifications..."
          className="w-full sm:w-80"
        />

        {/* Filter Tabs */}
        <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/60">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'unread' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'read' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Read
          </button>
        </div>
      </div>

      {/* List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
             <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
             Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Bell size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-700 text-lg font-medium mb-1">
              {searchTerm ? 'No matches found' : 'No notifications'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Try adjusting your search criteria' : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/50">
            {filteredNotifications.map(notif => (
              <div 
                key={notif.notification_id} 
                className={`p-5 sm:p-6 transition-colors group flex flex-col sm:flex-row gap-4 sm:items-center
                  ${notif.status === 'unread' ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : 'hover:bg-gray-50/50'}
                `}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${notif.status === 'unread' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}
                `}>
                  {notif.status === 'unread' ? <Mail size={24} /> : <MailOpen size={24} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base font-semibold truncate ${notif.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    {notif.status === 'unread' && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                    {notif.message}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      From: {notif.sender_name || 'System'}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {timeAgo(notif.created_at)}
                    </span>
                    {notif.module_name && (
                      <span className="text-gray-500 border border-gray-200 px-2 py-1 rounded-md capitalize">
                        {notif.module_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {notif.status === 'unread' && (
                    <button 
                      onClick={() => markAsRead(notif.notification_id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors tooltip-trigger"
                      title="Mark as read"
                    >
                      <CheckCheck size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.notification_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors tooltip-trigger"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
