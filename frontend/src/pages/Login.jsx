import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Mail, Lock, LogIn, TrendingUp, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { login, token, error: authError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // If already authenticated, redirect to Dashboard
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20">
            <TrendingUp size={24} />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            SpendWise
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-panel p-8 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Log in to manage your daily expenses and insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Server Error Alert */}
            {authError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400">
                {authError}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 glass-input ${
                    formErrors.email ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : ''
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-500 font-medium">{formErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 glass-input ${
                    formErrors.password ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : ''
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {formErrors.password && (
                <p className="text-xs text-rose-500 font-medium">{formErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <LogIn size={18} />
              Sign In
            </button>
          </form>

          {/* Bottom redirection */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} SpendWise. All rights reserved. Demo user: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">demo@example.com / password123</code>
      </footer>
    </div>
  );
};

export default Login;
