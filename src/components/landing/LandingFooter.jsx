import { Link } from "react-router-dom";
import { Instagram, MapPin, Music, CalendarCheck } from "lucide-react";
import { siteConfig } from "../../config/site.js";
import Container from "../common/Container.jsx";

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">{siteConfig.brand.mark}</span>
              <div>
                <strong>{siteConfig.brand.name}</strong>
                <p>{siteConfig.brand.tagline}</p>
              </div>
            </div>
          </div>

          <div>
            <h3>Kontak</h3>
            <Link to="/booking">
              <CalendarCheck size={17} />
              Mulai Booking
            </Link>
            <a href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer">
              <Instagram size={17} />
              Instagram
            </a>
          </div>

          <div>
            <h3>Lokasi</h3>
            <a href={siteConfig.contact.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={17} />
              Lihat Google Maps
            </a>
            <a href="/#rooms">
              <Music size={17} />
              Lihat Ruangan
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 {siteConfig.brand.name}. All rights reserved.</span>
          <span>Built for mobile-first booking experience.</span>
        </div>
      </Container>
    </footer>
  );
}
