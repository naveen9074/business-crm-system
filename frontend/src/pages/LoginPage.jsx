import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'pending', 'rejected', 'generic'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate(`/${result.role}`);
      } else {
        const msg = result.message || 'Invalid credentials. Please try again.';
        setError(msg);
        // Detect type for styling
        if (msg.toLowerCase().includes('waiting for admin approval')) {
          setErrorType('pending');
        } else if (msg.toLowerCase().includes('not approved')) {
          setErrorType('rejected');
        } else {
          setErrorType('generic');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setErrorType('generic');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorStyles = () => {
    switch (errorType) {
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-indigo-400/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Title Panel */}
        <div className="hidden md:flex flex-col justify-center items-center animate-slide-in-left">
          <div className="relative w-full h-[520px] bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />

            <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-10">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 animate-float">
                <LayoutDashboard size={42} />
              </div>
              <h2 className="text-5xl font-bold text-center leading-tight mb-4">
                Business CRM System
              </h2>
              <p className="text-white/80 text-center text-lg">
                Manage your customers, orders, deliveries, and more with a powerful, role-based CRM.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                  <p className="text-white/90 text-sm font-medium">👨‍💼 Admin</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                  <p className="text-white/90 text-sm font-medium">👔 Manager</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                  <p className="text-white/90 text-sm font-medium">👤 Employee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-slide-in-right">
          <img src="/images/login-illustration.png" alt="CRM Illustration" className="w-full max-w-sm rounded-xl opacity-90 shadow-2xl" />
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome
              </h1>
              <p className="text-gray-600">
                Sign in to your Business CRM account
              </p>
            </div>

            {/* Error Alert — with status-based colors */}
            {error && (
              <div className={`mb-6 p-4 border rounded-xl text-sm animate-slide-down ${getErrorStyles()}`}>
                {errorType === 'pending' && <span className="mr-1">⏳</span>}
                {errorType === 'rejected' && <span className="mr-1">🚫</span>}
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Username
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus-ring transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus-ring transition-colors"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />

                  <span className="text-gray-600">Remember me</span>
                </label>

                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-8">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;