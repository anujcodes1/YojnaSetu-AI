import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
const { user, logout } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const [menuOpen, setMenuOpen] = useState(false);

// Hide navbar on dashboard/sidebar pages
const hiddenRoutes = [
'/dashboard',
'/recommendations',
'/profile',
'/saved',
'/eligibility',
'/chat',
'/admin'
];

const shouldHide = hiddenRoutes.some(route =>
location.pathname.startsWith(route)
);

if (shouldHide) return null;

const handleLogout = () => {
logout();
toast.success('Logged out successfully');
navigate('/');
};

return ( <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

```
    {/* Navbar Container */}
    <div className="flex items-center h-16">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-saffron-500 to-saffron-700 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">YS</span>
        </div>

        <div>
          <p className="font-display font-bold text-navy-800 leading-tight">
            YojnaSetu
          </p>

          <p className="text-xs text-saffron-600 font-medium">
            AI Platform
          </p>
        </div>
      </Link>

      {/* Desktop Navigation + Auth */}
      <div className="hidden md:flex items-center gap-3 ml-10">

        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'text-saffron-600 bg-saffron-50'
                : 'text-gray-600 hover:text-saffron-600 hover:bg-saffron-50'
            }`
          }
        >
          Home
        </NavLink>

        {user ? (
          <>
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-semibold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm font-medium text-gray-700">
                {user.name?.split(' ')[0]}
              </span>
            </div>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 text-sm py-2"
            >
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="btn-secondary text-sm py-2"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register"
              className="btn-primary text-sm py-2"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden ml-auto p-2 rounded-xl hover:bg-gray-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 animate-fade-in">

      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-saffron-50 hover:text-saffron-600"
      >
        Home
      </Link>

      <Link
        to="/schemes"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-saffron-50 hover:text-saffron-600"
      >
        All Schemes
      </Link>

      {user && (
        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-saffron-50 hover:text-saffron-600"
        >
          Dashboard
        </Link>
      )}

      <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center text-sm"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-secondary text-center text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center text-sm"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  )}
</nav>
```

);
}
