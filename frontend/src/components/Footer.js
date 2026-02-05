import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import './Footer.css';
const Footer = () => {
return (
<footer className="footer">
<div className="footer-container">
<div className="footer-grid">
{/* Company Info */}
<div className="footer-section">
<h3>Leoaxis Technologies</h3>
<p>DPIIT Recognized Startup</p>
<p>Empowering Digital India through AI-powered education</p>
<div className="social-links">
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
<FaGithub />
</a>
<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
<FaLinkedin />
</a>
<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
<FaTwitter />
</a>
<a href="mailto:support@leoaxis.com">
<FaEnvelope />
</a>
</div>
</div>
      {/* Quick Links */}
      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/courses">Courses</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </div>

      {/* Resources */}
      <div className="footer-section">
        <h4>Resources</h4>
        <ul>
          <li><a href="/docs">Documentation</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/support">Support</a></li>
          <li><a href="/api">API</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div className="footer-section">
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/cookies">Cookie Policy</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Leoaxis Technologies. All rights reserved.</p>
      <p>Made with ❤️ in Mysuru, India</p>
    </div>
  </div>
</footer>
);
};
export default Footer;