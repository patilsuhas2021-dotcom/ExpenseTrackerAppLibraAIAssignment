import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { LogOut, Sun, Moon, TrendingUp, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-md shadow-primary-500/20">
              <TrendingUp size={20} />
            </div>
            <span className="font-outfit text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              SpendWise
            </span>
          </div>

          {/* User Section & Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Profile Info */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {user?.name || 'Guest User'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px]">
                  {user?.email}
                </span>
              </div>
              <div className="bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 h-9 w-9 rounded-xl flex items-center justify-center font-bold font-outfit shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-1.5 sm:px-3 sm:border sm:border-rose-100 dark:sm:border-rose-950/50"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline text-xs font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
