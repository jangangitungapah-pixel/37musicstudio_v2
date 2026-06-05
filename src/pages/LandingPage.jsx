import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  MapPin,
  Menu,
  MessageCircle,
  Mic2,
  Music2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import {
  faqs,
  features,
  heroStats,
  pricing,
  rooms,
  studioInfo,
  testimonials,
  trustItems,
} from "../data/landingData.js";

const createWhatsappUrl = (message) => {
  return `https://wa.me/${studioInfo.whatsapp}?text=${encodeURIComponent(message)}`;
};

const bookingMessage =
  "Halo 37 Music Studio, saya mau booking jadwal studio. Bisa dibantu cek slot yang tersedia?";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="37 Music Studio">
      <span className="brand-mark">37</span>
      <span className="brand-copy">
        <strong>37 Music</strong>
        <small>Studio</small>
      </span>
    </a>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <Brand />

      <nav className="desktop-nav" aria-label="Navigasi utama">
        <a href="#experience">Experience</a>
        <a href="#rooms">Room</a>
        <a href="#pricing">Harga</a>
        <a href="#faq">FAQ</a>
      </nav>

      <a
        className="header-cta"
        href={createWhatsappUrl(bookingMessage)}
        target="_blank"
        rel="noreferrer"
      >
        Booking
      </a>

      <button
        className="menu-button"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div className="mobile-nav" role="dialog" aria-label="Menu navigasi mobile">
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#rooms" onClick={closeMenu}>Pilihan Room</a>
          <a href="#pricing" onClick={closeMenu}>Harga</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a
            className="mobile-nav-cta"
            href={createWhatsappUrl(bookingMessage)}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            <MessageCircle size={18} />
            Booking Sekarang
          </a>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            <span>Premium rehearsal & recording space</span>
          </div>

          <h1>
            Studio musik yang bikin sesi kamu terdengar <span>lebih mahal.</span>
          </h1>

          <p>
            Latihan band, recording, podcast, dan konten musik dalam ruang studio yang cozy,
            kedap, modern, dan gampang dibooking langsung dari HP.
          </p>

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={createWhatsappUrl(bookingMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} />
              Booking Sekarang
            </a>

            <a className="btn btn-secondary" href="#rooms">
              Lihat Room
              <ArrowRight size={19} />
            </a>
          </div>

          <div className="hero-proof">
            {heroStats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Visual studio musik">
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="live-dot" />
              <strong>Studio Ready</strong>
              <small>{studioInfo.openHours}</small>
            </div>

            <div className="stage">
              <div className="speaker speaker-left" />
              <div className="mic-stand">
                <span />
              </div>
              <div className="speaker speaker-right" />
              <div className="stage-light" />
            </div>

            <div className="session-preview">
              <div>
                <span>Tonight Session</span>
                <strong>19.00 - 21.00 WIB</strong>
              </div>
              <CalendarDays size={24} />
            </div>
          </div>

          <div className="floating-badge badge-one">
            <Headphones size={16} />
            Recording Ready
          </div>

          <div className="floating-badge badge-two">
            <Zap size={16} />
            Fast Booking
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const icons = [Clock3, Headphones, ShieldCheck, Music2];

  return (
    <section className="trust-section">
      <div className="container trust-grid">
        {trustItems.map((item, index) => {
          const Icon = icons[index] || Star;

          return (
            <article className="trust-card" key={item.title}>
              <div className="trust-icon">
                <Icon size={20} />
              </div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, text, align = "left" }) {
  return (
    <div className={`section-header section-header-${align}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ExperienceSection() {
  const icons = [Music2, Headphones, MessageCircle, Mic2];

  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader
          eyebrow="The 37 Experience"
          title="Datang, setup cepat, langsung main."
          text="Customer harus langsung merasa: tempat ini proper, gampang dibooking, dan cocok buat sesi musik yang serius tapi tetap santai."
        />

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = icons[index] || Star;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RoomsSection() {
  return (
    <section className="section section-alt" id="rooms">
      <div className="container">
        <SectionHeader
          eyebrow="Pilihan Room"
          title="Pilih ruang sesuai vibe sesi kamu."
          text="Dari latihan band sampai produksi konten, informasi room dibuat ringkas supaya customer cepat paham dari layar HP."
        />

        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.name}>
              <div className={`room-media room-media-${index + 1}`}>
                <span>{room.tag}</span>
              </div>

              <div className="room-body">
                <h3>{room.name}</h3>
                <p>{room.description}</p>

                <strong className="room-price">{room.price}</strong>

                <ul>
                  {room.includes.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  className="btn btn-secondary room-btn"
                  href={createWhatsappUrl(`Halo 37 Music Studio, saya mau tanya jadwal untuk ${room.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Tanya Jadwal
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHeader
          eyebrow="Harga Simple"
          title="Paket jelas, booking nggak pakai mikir lama."
          text="Untuk mobile, pricing dibuat dalam bentuk card supaya lebih enak dibaca daripada tabel panjang."
          align="center"
        />

        <div className="pricing-grid">
          {pricing.map((item) => (
            <article className={`pricing-card ${item.featured ? "featured" : ""}`} key={item.name}>
              {item.featured && <div className="pricing-badge">Recommended</div>}

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="price-row">
                <strong>{item.price}</strong>
                <span>{item.unit}</span>
              </div>

              <ul>
                {item.perks.map((perk) => (
                  <li key={perk}>
                    <Check size={16} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <a
                className={`btn ${item.featured ? "btn-primary" : "btn-secondary"}`}
                href={createWhatsappUrl(`Halo 37 Music Studio, saya mau booking paket ${item.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Booking Paket
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryTeaser() {
  const items = ["Main Room", "Drum Setup", "Recording Corner", "Cozy Lighting"];

  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeader
          eyebrow="Vibe Check"
          title="Sebelum booking, customer harus bisa kebayang suasananya."
          text="Nanti bagian ini bisa diganti dengan foto asli studio. Untuk sekarang, kita siapkan layout visual premium-nya dulu."
        />

        <div className="gallery-grid">
          {items.map((item, index) => (
            <div className={`gallery-card gallery-card-${index + 1}`} key={item}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Kata Mereka"
          title="Dipercaya musisi lokal, band, dan kreator."
          text="Testimoni pendek lebih cocok untuk landing page mobile karena cepat dibaca dan langsung membangun trust."
          align="center"
        />

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <div className="stars" aria-label="Rating 5 bintang">
                <Star size={16} />
                <Star size={16} />
                <Star size={16} />
                <Star size={16} />
                <Star size={16} />
              </div>

              <p>“{item.quote}”</p>

              <div>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="container">
        <div className="final-card">
          <div className="eyebrow">
            <Sparkles size={16} />
            <span>Ready for your next session?</span>
          </div>

          <h2>Siap latihan tanpa ribet?</h2>
          <p>
            Cek jadwal, tanya room, dan booking studio langsung dari HP. Klik WhatsApp,
            pilih sesi, lalu gas latihan.
          </p>

          <div className="final-actions">
            <a
              className="btn btn-primary"
              href={createWhatsappUrl(bookingMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} />
              Booking via WhatsApp
            </a>

            <a className="btn btn-secondary" href="#pricing">
              Lihat Harga
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHeader
          eyebrow="FAQ"
          title="Jawaban cepat sebelum customer booking."
          text="Bagian ini membantu mengurangi pertanyaan berulang dan mempercepat keputusan booking."
        />

        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <ChevronDown size={18} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Brand />
          <p>
            Studio musik modern untuk rehearsal, recording, dan creative session.
            Dibuat mobile-first supaya customer bisa booking lebih cepat dari HP.
          </p>
        </div>

        <div className="footer-links">
          <a href={createWhatsappUrl(bookingMessage)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            WhatsApp
          </a>
          <a href="#" aria-label="Instagram 37 Music Studio">
            <Music2 size={17} />
            Instagram
          </a>
          <a href="#" aria-label="Lokasi 37 Music Studio">
            <MapPin size={17} />
            {studioInfo.location}
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 37 Music Studio. All rights reserved.</span>
        <span>Mobile-first customer booking experience.</span>
      </div>
    </footer>
  );
}

function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <a href={createWhatsappUrl(bookingMessage)} target="_blank" rel="noreferrer">
        <MessageCircle size={20} />
        <span>Booking Sekarang</span>
      </a>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />

      <main>
        <HeroSection />
        <TrustSection />
        <ExperienceSection />
        <RoomsSection />
        <PricingSection />
        <GalleryTeaser />
        <TestimonialsSection />
        <FinalCTA />
        <FAQSection />
      </main>

      <Footer />
      <MobileBookingBar />
    </div>
  );
}


