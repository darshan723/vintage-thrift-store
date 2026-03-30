// ── Footer Component ──

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>🏛️ Vintage House Wear</h3>
          <p>
            Curated vintage clothing for the modern soul. Every piece tells a story,
            every stitch holds a memory. Sustainably sourced, timeless style.
          </p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/category/denims">Denims</Link></li>
            <li><Link to="/category/boots">Boots</Link></li>
            <li><Link to="/category/jackets">Jackets</Link></li>
            <li><Link to="/category/shades">Shades</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Info & Contact</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Shipping & Returns</a></li>
          </ul>
          <div style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <strong>Store Address:</strong><br />
            GF-5 Snehdhara Complex,<br />
            Fatehgunj, Vadodara,<br />
            Gujarat 390008<br /><br />
            <strong>Phone:</strong> 079846 63353
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Vintage House Wear. All rights reserved.</span>
        <span>Crafted with ♥ and old leather</span>
      </div>
    </footer>
  );
}
