import React from 'react';
import '../App.css'; // Assuming styles are global or you can create Navbar.css

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon"></div> {/* You can replace with an <img> tag later */}
        <h2>Leoaxis Technologies</h2>
      </div>
      
      <div className="navbar-links">
        <a href="#topics" className="nav-item">Topics</a>
        <a href="#resources" className="nav-item">Resources</a>
        <a href="#practice" className="nav-item active">{'< >'} Practice</a>
        <a href="#projects" className="nav-item">Projects</a>
        <a href="#interview" className="nav-item">Interview</a>
        <a href="#jobs" className="nav-item">Jobs</a>
      </div>

      <div className="navbar-auth">
        <button className="btn-signin">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;