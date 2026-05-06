// ── Navbar Component ──
// Fixed top navigation with logo, links, cart badge, theme toggle, and mobile menu

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSun, FiMoon, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('vt_theme') === 'dark';
  });

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('vt_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Vintage House Store" className="navbar-logo-image" />
        </Link>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/category/denims" onClick={() => setMenuOpen(false)}>Denims</NavLink></li>
          <li><NavLink to="/category/boots" onClick={() => setMenuOpen(false)}>Boots</NavLink></li>
          <li><NavLink to="/category/jackets" onClick={() => setMenuOpen(false)}>Jackets</NavLink></li>
          <li><NavLink to="/category/shades" onClick={() => setMenuOpen(false)}>Shades</NavLink></li>
          {/* Mobile-only auth links */}
          {menuOpen && !user && (
            <>
              <li><NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink></li>
              <li><NavLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</NavLink></li>
            </>
          )}
          {menuOpen && user && (
            <>
              <li><NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink></li>
              {isAdmin && <li><NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink></li>}
              <li><a href="#" onClick={handleLogout}>Logout</a></li>
            </>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {isAdmin && (
            <Link to="/admin" className="navbar-action-btn" title="Admin Panel">
              <FiShield />
            </Link>
          )}

          <Link to="/cart" className="navbar-action-btn" title="Cart">
            <FiShoppingBag />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <Link to="/profile" className="navbar-action-btn" title="Profile">
              <FiUser />
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
