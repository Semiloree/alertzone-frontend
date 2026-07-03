import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6
                    border-b border-[#30363D]"
         style={{ background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(12px)' }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-8">
        <span className="text-[#FF3B30] text-xl animate-pulse-red
                         w-3 h-3 rounded-full bg-[#FF3B30] inline-block"></span>
        <span className="font-bold text-base tracking-tight text-[#F0F4F8]">
          Alert<span className="text-[#00D9B8]">Zone</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        {[
          { to: '/map',    label: '🗺 Live Map' },
          { to: '/report', label: '➕ Report' },
          ...(user?.role === 'ADMIN'
            ? [{ to: '/admin', label: '⚙️ Admin' }] : []),
        ].map(({ to, label }) => (
          <Link key={to} to={to}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200
              ${isActive(to)
                ? 'bg-[#00D9B8]/10 text-[#00D9B8] font-medium'
                : 'text-[#8B949E] hover:text-[#F0F4F8] hover:bg-white/5'}`}>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-[#8B949E]">
              {user.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold
                ${user.role==='ADMIN'
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  : 'bg-[#00D9B8]/20 text-[#00D9B8]'}`}>
                {user.role}
              </span>
            </span>
            <button onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#30363D]
                         text-[#8B949E] hover:text-[#FF3B30] hover:border-[#FF3B30]
                         transition-all duration-200">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login"
            className="text-sm px-4 py-1.5 rounded-lg bg-[#00D9B8] text-[#0D1117]
                       font-semibold hover:bg-[#00D9B8]/80 transition-all duration-200">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}