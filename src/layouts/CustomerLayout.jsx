import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../config/site.js";

const navItems = [
  { label: "Kalender", href: "/calendar" },
  { label: "Ruangan", href: "/#rooms" },
  { label: "Harga", href: "/#pricing" },
  { label: "Gallery", href: "/#gallery" },
  { label: "FAQ", href: "/#faq" },
];

export default function CustomerLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="customer-app">
      <header className="customer-header">
        <Link className="brand-lockup" to="/" aria-label={siteConfig.brand.name}>
          <span className="brand-mark">{siteConfig.brand.mark}</span>
          <span className="brand-text">
            <strong>{siteConfig.brand.shortName}</strong>
            <small>Studio</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>

        <Link className="header-cta" to="/booking">
          Booking
        </Link>

        <button
          className="mobile-menu-button"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div
        className={`mobile-nav-backdrop ${isMenuOpen ? "is-visible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`mobile-nav-drawer ${isMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-nav-header">
          <span className="brand-mark">{siteConfig.brand.mark}</span>
          <div>
            <strong>{siteConfig.brand.name}</strong>
            <p>{siteConfig.brand.tagline}</p>
          </div>
        </div>

        <nav className="mobile-nav-links" aria-label="Navigasi mobile">
          {navItems.map((item) => (
            <a href={item.href} key={item.label} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>

        <Link className="mobile-nav-cta" to="/booking" onClick={closeMenu}>
          Booking Sekarang
        </Link>
      </aside>

      <main>{children}</main>
    </div>
  );
}
