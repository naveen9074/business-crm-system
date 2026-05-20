import React, { useState, useEffect } from 'react';
import { Send, Users, User, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';

const SendNotificationPage = () => {
  const [users, setUsers] = useState([]);
  const [sendMode, setSendMode] = useState('user'); // 'user' or 'role'
  const [formData, setFormData] = useState({
    receiver_id: '',
    receiver_role: '',
    title: '',
    message: '',
    module_name: '',
    notification_type: 'reminder',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/notifications/users-list');
        setUsers(res.data.users || []);
      } catch (e) {
        // silent
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Title and message are required');
      return;
    }

    if (sendMode === 'user' && !formData.receiver_id) {
      setError('Please select a user');
      return;
    }
    if (sendMode === 'role' && !formData.receiver_role) {
      setError('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        module_name: formData.module_name || undefined,
        notification_type: formData.notification_type,
      };

      if (sendMode === 'user') {
        payload.receiver_id = parseInt(formData.receiver_id);
      } else {
        payload.receiver_role = formData.receiver_role;
      }

      const res = await api.post('/notifications', payload);
      setSuccess(res.data.message || 'Notification sent successfully!');
      setFormData({
        receiver_id: '',
        receiver_role: '',
        title: '',
        message: '',
        module_name: '',
        notification_type: 'reminder',
      });
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const modules = ['General', 'Orders', 'Payments', 'Deliveries', 'Stock', 'Follow-ups', 'Customers', 'Products'];

  return (
    <div className="animate-page-enter max-w-2xl">
      <PageHeader
        title="Send Notification"
        subtitle="Send a reminder or notification to team members"
      />

      <div className="glass-card p-8">
        {/* Success */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-slide-down">
            ✅ {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-slide-down">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Send Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Send To</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSendMode('user')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  sendMode === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User size={16} />
                Specific User
              </button>
              <button
                type="button"
                onClick={() => setSendMode('role')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  sendMode === 'role'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users size={16} />
                All by Role
              </button>
            </div>
          </div>

          {/* Receiver Selection */}
          {sendMode === 'user' ? (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Select User *</label>
              <select
                name="receiver_id"
                value={formData.receiver_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a user...</option>
                {users.map(u => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name} (@{u.username}) — {u.role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Select Role *</label>
              <select
                name="receiver_role"
                value={formData.receiver_role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a role...</option>
                <option value="manager">All Managers</option>
                <option value="employee">All Employees</option>
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pending payment reminder"
              className="input-field"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your notification message here..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          {/* Module */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Related Module (Optional)</label>
            <select
              name="module_name"
              value={formData.module_name}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select module...</option>
              {modules.map(m => (
                <option key={m} value={m.toLowerCase()}>{m}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Type</label>
            <select
              name="notification_type"
              value={formData.notification_type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="reminder">Reminder</option>
              <option value="manual">Manual</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3 rounded-xl text-base gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationPage;
