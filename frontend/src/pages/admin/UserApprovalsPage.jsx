import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Search, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserApprovalsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, user: null, action: '' });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pending-users');
      setUsers(res.data.pending_users || []);
    } catch (e) {
      console.error('Failed to fetch pending users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/approve`);
      setUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (e) {
      alert('Failed to approve user');
    } finally {
      setActionLoading(null);
      setConfirmDialog({ isOpen: false, user: null, action: '' });
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/reject`);
      setUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (e) {
      alert('Failed to reject user');
    } finally {
      setActionLoading(null);
      setConfirmDialog({ isOpen: false, user: null, action: '' });
    }
  };

  const filtered = users.filter(u => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="User Approvals"
        subtitle="Review and approve pending registrations"
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, username, email, role..."
          className="w-full sm:w-80"
        />
        <button
          onClick={fetchPendingUsers}
          className="btn btn-glass flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading pending users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCheck size={32} className="text-green-500" />
          </div>
          <p className="text-gray-700 text-lg font-medium mb-1">
            {searchTerm ? 'No matching users found' : 'No pending approvals'}
          </p>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search' : 'All registrations have been reviewed'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((user) => (
            <div
              key={user.user_id}
              className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* User avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <span className={`badge ${user.role === 'manager' ? 'badge-primary' : 'badge-info'} text-xs`}>
                    {user.role}
                  </span>
                  <span className="badge badge-pending text-xs flex items-center gap-1">
                    <Clock size={12} />
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  @{user.username} · {user.email}
                  {user.phone && ` · ${user.phone}`}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Registered: {formatDate(user.created_at)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setConfirmDialog({ isOpen: true, user, action: 'approve' })}
                  disabled={actionLoading === user.user_id}
                  className="btn btn-success text-sm gap-1.5 rounded-xl"
                >
                  <UserCheck size={16} />
                  Approve
                </button>
                <button
                  onClick={() => setConfirmDialog({ isOpen: true, user, action: 'reject' })}
                  disabled={actionLoading === user.user_id}
                  className="btn btn-danger text-sm gap-1.5 rounded-xl"
                >
                  <UserX size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === 'approve' ? 'Approve User' : 'Reject User'}
        message={
          confirmDialog.action === 'approve'
            ? `Are you sure you want to approve "${confirmDialog.user?.name}"? They will be able to login immediately.`
            : `Are you sure you want to reject "${confirmDialog.user?.name}"? They will not be able to login.`
        }
        confirmText={confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
        variant={confirmDialog.action === 'approve' ? 'success' : 'danger'}
        onConfirm={() => {
          if (confirmDialog.action === 'approve') {
            handleApprove(confirmDialog.user.user_id);
          } else {
            handleReject(confirmDialog.user.user_id);
          }
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, user: null, action: '' })}
      />
    </div>
  );
};

export default UserApprovalsPage;
