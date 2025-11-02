import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const FooterVanilla = () => {
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    // Synchronized collapse behavior for footer menu
    // All menu items expand/collapse together
  }, []);

  const handleToggle = () => {
    setAllExpanded(!allExpanded);
  };

  return (
    <footer>
      <div className="footer__social">
        <a href="#" aria-label="Download on App Store">App Store</a>
        <a href="#" aria-label="Get it on Google Play">Google Play</a>
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="TikTok">TT</a>
        <a href="#" aria-label="Twitter/X">X</a>
      </div>

      <div className="footer__menu">
        <details className="footer__menu-item" open={allExpanded} onToggle={handleToggle}>
          <summary>Company</summary>
          <Link to="/about">About</Link>
          <Link to="/team">Team</Link>
          <Link to="/jobs">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Press</Link>
        </details>
        <details className="footer__menu-item" open={allExpanded} onToggle={handleToggle}>
          <summary>Support</summary>
          <Link to="/faq">Help Center</Link>
          <Link to="/contact">Contact</Link>
        </details>
        <details className="footer__menu-item" open={allExpanded} onToggle={handleToggle}>
          <summary>Shop</summary>
          <Link to="/browse">Gift Cards</Link>
          <Link to="/for-celebrities">For Business</Link>
          <Link to="/browse">For Kids</Link>
        </details>
      </div>

      <div className="footer__selector">
        <button className="footer__lang">🌐 EN | United States | $ USD</button>
      </div>

      <div className="footer__legal">
        <span>© 2025 StarryMeet</span>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
    </footer>
  );
};
