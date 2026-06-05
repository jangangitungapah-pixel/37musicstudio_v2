import { Menu } from "lucide-react";

export default function CustomerLayout({ children }) {
  return (
    <div className="customer-app">
      <header className="site-header">
        <a href="#top" className="brand">
          <span className="brand-mark">37</span>
          <span>
            <strong>37 Music</strong>
            <small>Studio</small>
          </span>
        </a>

        <nav className="desktop-nav">
          <a href="#rooms">Ruangan</a>
          <a href="#pricing">Harga</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a
          className="header-booking"
          href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal."
          target="_blank"
          rel="noreferrer"
        >
          Booking
        </a>

        <button className="mobile-menu" aria-label="Buka menu">
          <Menu size={22} />
        </button>
      </header>

      {children}
    </div>
  );
}
