import { Calendar, Headphones, Sparkles } from "lucide-react";
import Button from "../common/Button.jsx";

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Premium rehearsal & recording space
          </div>

          <h1>
            Studio Musik Nyaman, <span>Sound Mantap</span>, Booking Lebih Mudah.
          </h1>

          <p>
            Latihan band, recording, podcast, dan produksi musik dalam ruang studio yang cozy,
            kedap, modern, dan siap pakai langsung dari HP kamu.
          </p>

          <div className="hero-actions">
            <Button
              href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal."
              target="_blank"
              rel="noreferrer"
            >
              Booking Sekarang
            </Button>

            <Button href="#rooms" variant="secondary">
              Lihat Ruangan
            </Button>
          </div>

          <div className="hero-stats">
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
              <span>Rating Studio</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span className="live-dot" />
            Studio Ready Tonight
          </div>

          <div className="stage-visual">
            <div className="speaker" />
            <div className="mic" />
            <div className="speaker" />
          </div>

          <div className="session-card">
            <div>
              <strong>Next Session</strong>
              <span>19.00 - 21.00 WIB</span>
            </div>
            <Calendar size={24} />
          </div>

          <div className="floating-chip chip-a">
            <Headphones size={16} />
            Recording Ready
          </div>

          <div className="floating-chip chip-b">
            Live Band Setup
          </div>
        </div>
      </div>
    </section>
  );
}
