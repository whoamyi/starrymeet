import { useState } from 'react';
import { Link } from 'react-router-dom';

export const HeaderVanilla = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  const toggleCategoriesDropdown = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const toggleMobileCategoriesSubmenu = () => {
    setMobileSubmenuOpen(!mobileSubmenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSubmenuOpen(false);
  };

  return (
    <>
      <nav role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <svg className="logo-svg" width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="5" y="28" fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="20" fill="#FFFFFF" letterSpacing="-0.02em">
                StarryMeet
              </text>
            </svg>
          </Link>
          <button className="hamburger-btn menu-toggle" aria-label="Toggle navigation menu" onClick={() => setMobileMenuOpen(true)}>☰</button>
          <ul className="nav-links">
            <li className="nav-item-categories">
              <a href="#" onClick={(e) => { e.preventDefault(); toggleCategoriesDropdown(); }}>Categories ▾</a>
              <div className={`categories-dropdown ${categoriesOpen ? 'active' : ''}`}>
                <div className="category-parent">
                  <span>Music</span>
                  <div className="category-submenu">
                    <Link to="/browse?category=Music" onClick={() => setCategoriesOpen(false)}>All Music</Link>
                    <Link to="/browse?category=Music&subcategory=K-Pop" onClick={() => setCategoriesOpen(false)}>K-Pop</Link>
                    <Link to="/browse?category=Music&subcategory=Pop" onClick={() => setCategoriesOpen(false)}>Pop</Link>
                    <Link to="/browse?category=Music&subcategory=Hip-Hop & Rap" onClick={() => setCategoriesOpen(false)}>Hip-Hop & Rap</Link>
                    <Link to="/browse?category=Music&subcategory=Rock" onClick={() => setCategoriesOpen(false)}>Rock</Link>
                  </div>
                </div>
                <div className="category-parent">
                  <span>Sports</span>
                  <div className="category-submenu">
                    <Link to="/browse?category=Sports" onClick={() => setCategoriesOpen(false)}>All Sports</Link>
                    <Link to="/browse?category=Sports&subcategory=Football/Soccer" onClick={() => setCategoriesOpen(false)}>Football/Soccer</Link>
                    <Link to="/browse?category=Sports&subcategory=Basketball" onClick={() => setCategoriesOpen(false)}>Basketball</Link>
                    <Link to="/browse?category=Sports&subcategory=Olympics & Athletics" onClick={() => setCategoriesOpen(false)}>Olympics</Link>
                  </div>
                </div>
                <div className="category-parent">
                  <span>Film & TV</span>
                  <div className="category-submenu">
                    <Link to="/browse?category=Film & Television" onClick={() => setCategoriesOpen(false)}>All Film & TV</Link>
                    <Link to="/browse?category=Film & Television&subcategory=Hollywood" onClick={() => setCategoriesOpen(false)}>Hollywood</Link>
                    <Link to="/browse?category=Film & Television&subcategory=TV Series" onClick={() => setCategoriesOpen(false)}>TV Series</Link>
                    <Link to="/browse?category=Film & Television&subcategory=International Cinema" onClick={() => setCategoriesOpen(false)}>International</Link>
                  </div>
                </div>
                <div className="category-parent">
                  <span>Digital Creators</span>
                  <div className="category-submenu">
                    <Link to="/browse?category=Digital Creators" onClick={() => setCategoriesOpen(false)}>All Creators</Link>
                    <Link to="/browse?category=Digital Creators&subcategory=YouTube" onClick={() => setCategoriesOpen(false)}>YouTube</Link>
                    <Link to="/browse?category=Digital Creators&subcategory=TikTok" onClick={() => setCategoriesOpen(false)}>TikTok</Link>
                    <Link to="/browse?category=Digital Creators&subcategory=Gaming & Esports" onClick={() => setCategoriesOpen(false)}>Gaming</Link>
                  </div>
                </div>
                <div className="category-parent">
                  <span>Business & Tech</span>
                  <div className="category-submenu">
                    <Link to="/browse?category=Business & Tech" onClick={() => setCategoriesOpen(false)}>All Business</Link>
                    <Link to="/browse?category=Business & Tech&subcategory=Tech Leaders" onClick={() => setCategoriesOpen(false)}>Tech Leaders</Link>
                    <Link to="/browse?category=Business & Tech&subcategory=Entrepreneurs" onClick={() => setCategoriesOpen(false)}>Entrepreneurs</Link>
                  </div>
                </div>
                <Link to="/browse" onClick={() => setCategoriesOpen(false)}>View all</Link>
              </div>
            </li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/for-celebrities">Join as star</Link></li>
            <li><Link to="/auth">Log in</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Full-Screen Overlay - Outside nav for proper layering */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
            <svg className="logo-svg" width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="5" y="21" fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="15" fill="#FFFFFF" letterSpacing="-0.02em">
                StarryMeet
              </text>
            </svg>
          </Link>
          <button className="mobile-menu-close menu-close" aria-label="Close menu" onClick={closeMobileMenu}>×</button>
        </div>
        <ul className="mobile-menu-links">
          <li className="mobile-menu-categories">
            <a href="#" onClick={(e) => { e.preventDefault(); toggleMobileCategoriesSubmenu(); }}>Categories ›</a>
            <ul className={`mobile-submenu ${mobileSubmenuOpen ? 'active' : ''}`}>
              <li><Link to="/browse?category=Actors" onClick={closeMobileMenu}>Actors</Link></li>
              <li><Link to="/browse?category=Musicians" onClick={closeMobileMenu}>Musicians</Link></li>
              <li><Link to="/browse?category=Athletes" onClick={closeMobileMenu}>Athletes</Link></li>
              <li><Link to="/browse?category=Business" onClick={closeMobileMenu}>Business</Link></li>
            </ul>
          </li>
          <li><Link to="/how-it-works" onClick={closeMobileMenu}>How it works</Link></li>
          <li><Link to="/for-celebrities" onClick={closeMobileMenu}>Join as star</Link></li>
          <li><button className="locale-btn">🌐 <span>EN | United States | $ USD</span></button></li>
          <li className="mobile-menu-login-item"><Link to="/auth" className="mobile-menu-login" onClick={closeMobileMenu}>Log in</Link></li>
        </ul>
      </div>
    </>
  );
};
