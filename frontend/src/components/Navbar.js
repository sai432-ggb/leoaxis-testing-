import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaFire, FaTrophy } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon">L</div>
          <div className="logo-text">
            <span className="logo-main">Leoaxis</span>
            <span className="logo-sub">Technologies</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/courses" className="nav-link">Browse Courses</Link>
              <Link to="/my-courses" className="nav-link">My Courses</Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <a href="#features" className="nav-link">Features</a>
              <a href="#courses" className="nav-link">Courses</a>
            </>
          )}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              {/* Streak Display */}
              {user?.streakCount > 0 && (
                <div className="streak-badge">
                  <FaFire className="streak-icon" />
                  <span>{user.streakCount}</span>
                </div>
              )}
              
              {/* Points Display */}
              {user?.points > 0 && (
                <div className="points-badge">
                  <FaTrophy className="points-icon" />
                  <span>{user.points}</span>
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="user-dropdown">
                <button className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <FaUserCircle />
                  )}
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                </button>
                
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <FaUserCircle /> Profile
                  </Link>
                  <Link to="/dashboard" className="dropdown-item">
                     Dashboard
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                     Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/courses" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Browse Courses
              </Link>
              <Link to="/my-courses" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                My Courses
              </Link>
              <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="mobile-link logout-mobile">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <a href="#features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#courses" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </a>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-link primary" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
