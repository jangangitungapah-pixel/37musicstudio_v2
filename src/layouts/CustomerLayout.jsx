import { Music, Menu } from "lucide-react";

export default function CustomerLayout({ children }) {
  return (
    <div className="customer-app">
      <header className="customer-header">
        <a className="brand-lockup" href="#top" aria-label="37 Music Studio">
          <span className="brand-mark">37</span>
          <span className="brand-text">
            <strong>37 Music</strong>
            <small>Studio</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          <a href="#rooms">Ruangan</a>
          <a href="#pricing">Harga</a>
          <a href="#gallery">Gallery</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a className="header-cta" href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal%20studio." target="_blank" rel="noreferrer">
          Booking
        </a>

        <button className="mobile-menu-button" aria-label="Buka menu">
          <Menu size={22} />
        </button>
      </header>

      <main>{children}</main>
    </div>
  );
}
