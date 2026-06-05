import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "../config/site.js";

const navItems = [
  { label: "Ruangan", href: "#rooms" },
  { label: "Harga", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export default function CustomerLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="customer-app">
      <header className="customer-header">
        <a className="brand-lockup" href="#top" aria-label={siteConfig.brand.name}>
          <span className="brand-mark">{siteConfig.brand.mark}</span>
          <span className="brand-text">
            <strong>{siteConfig.brand.shortName}</strong>
            <small>Studio</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="header-cta"
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          Booking
        </a>

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

        <a
          className="mobile-nav-cta"
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          Booking Sekarang
        </a>
      </aside>

      <main>{children}</main>
    </div>
  );
}
