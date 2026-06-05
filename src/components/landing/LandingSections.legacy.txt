import { Check, MessageCircle, Music, Shield, Star, Volume2 } from "lucide-react";
import { faqs, features, pricing, rooms } from "../../data/landingData.js";
import Button from "../common/Button.jsx";

export function TrustBar() {
  return (
    <section className="trust">
      <div className="container trust-grid">
        <div><Volume2 size={20} /><strong>Sound Proper</strong><span>Siap latihan</span></div>
        <div><Shield size={20} /><strong>Ruang Nyaman</strong><span>Cozy & kedap</span></div>
        <div><Music size={20} /><strong>Band Friendly</strong><span>Full setup</span></div>
        <div><Star size={20} /><strong>Booking Cepat</strong><span>Via WhatsApp</span></div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span>Kenapa pilih 37 Music Studio?</span>
          <h2>Semua yang dibutuhkan musisi, dibuat lebih simpel.</h2>
          <p>
            Landing page ini dibuat untuk meyakinkan customer dalam beberapa detik:
            tempatnya proper, harganya jelas, dan booking-nya gampang.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((item) => (
            <article className="glass-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RoomSection() {
  return (
    <section className="section section-alt" id="rooms">
      <div className="container">
        <div className="section-head">
          <span>Pilihan Ruangan</span>
          <h2>Pilih room sesuai kebutuhan sesi kamu.</h2>
          <p>Untuk latihan, recording, sampai konten musik, semuanya dibuat gampang dibaca dari HP.</p>
        </div>

        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.name}>
              <div className={`room-visual room-visual-${index + 1}`}>
                <span>{room.tag}</span>
              </div>
              <div className="room-body">
                <h3>{room.name}</h3>
                <p>{room.text}</p>
                <strong>{room.price}</strong>
                <Button
                  href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20tanya%20jadwal%20room."
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  Tanya Jadwal
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="section-head center">
          <span>Harga Simple</span>
          <h2>Paket jelas, customer nggak perlu nebak-nebak.</h2>
          <p>Di mobile, pricing lebih nyaman dibuat sebagai card, bukan tabel panjang.</p>
        </div>

        <div className="pricing-grid">
          {pricing.map((item, index) => (
            <article className={`pricing-card ${index === 1 ? "featured" : ""}`} key={item.name}>
              {index === 1 && <div className="recommended">Recommended</div>}
              <h3>{item.name}</h3>
              <div className="price">
                <strong>{item.price}</strong>
                <span>{item.unit}</span>
              </div>

              <ul>
                {item.items.map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20paket."
                target="_blank"
                rel="noreferrer"
                variant={index === 1 ? "primary" : "secondary"}
              >
                Booking Paket
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <span>FAQ</span>
          <h2>Biar customer nggak ragu sebelum booking.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="final-card">
          <span>Ready for your next session?</span>
          <h2>Siap latihan tanpa ribet?</h2>
          <p>
            Cek jadwal, tanya room, dan booking studio langsung dari HP kamu.
            Tinggal klik WhatsApp, pilih sesi, lalu gas latihan.
          </p>

          <Button
            href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal."
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} />
            Booking via WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

export function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <a
        href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal."
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={20} />
        Booking Sekarang
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>37 Music Studio</strong>
          <p>Rehearsal, recording, and creative music space.</p>
        </div>
        <span>© 2026 37 Music Studio.</span>
      </div>
    </footer>
  );
}
