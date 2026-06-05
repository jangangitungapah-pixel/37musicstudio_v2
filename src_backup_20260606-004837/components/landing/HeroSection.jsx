import { Calendar, Headphones, Music, Sparkles } from "lucide-react";
import Button from "../common/Button.jsx";
import Container from "../common/Container.jsx";

export default function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
      </div>

      <Container className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Premium rehearsal & recording space</span>
          </div>

          <h1>
            Studio Musik Nyaman, <span>Sound Mantap</span>, Booking Lebih Mudah.
          </h1>

          <p className="hero-description">
            Latihan band, recording, podcast, dan produksi musik dalam ruang studio yang cozy,
            kedap, dan siap pakai langsung dari HP kamu.
          </p>

          <div className="hero-actions">
            <Button
              href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal%20studio."
              target="_blank"
              rel="noreferrer"
            >
              Booking Sekarang
            </Button>

            <Button href="#rooms" variant="ghost">
              Lihat Ruangan
            </Button>
          </div>

          <div className="hero-mini-stats">
            <div>
              <strong>500+</strong>
              <span>Jam Latihan</span>
            </div>
            <div>
              <strong>100+</strong>
              <span>Musisi Lokal</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Studio Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Ilustrasi studio musik premium">
          <div className="studio-card-main">
            <div className="studio-card-top">
              <span className="live-dot" />
              <span>Studio Ready</span>
            </div>

            <div className="studio-visual-stage">
              <div className="speaker speaker-left" />
              <div className="mic-stand" />
              <div className="speaker speaker-right" />
              <div className="floor-light" />
            </div>

            <div className="studio-card-bottom">
              <div>
                <strong>Tonight Session</strong>
                <span>19.00 - 21.00 WIB</span>
              </div>
              <Calendar size={22} />
            </div>
          </div>

          <div className="floating-chip chip-one">
            <Music size={16} />
            <span>Band Practice</span>
          </div>

          <div className="floating-chip chip-two">
            <Headphones size={16} />
            <span>Recording Ready</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
