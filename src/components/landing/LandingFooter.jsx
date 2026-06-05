import { Instagram, MapPin, MessageCircle, Music } from "lucide-react";
import Container from "../common/Container.jsx";

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">37</span>
              <div>
                <strong>37 Music Studio</strong>
                <p>Rehearsal, recording, and creative music space.</p>
              </div>
            </div>
          </div>

          <div>
            <h3>Kontak</h3>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
              <MessageCircle size={17} />
              WhatsApp Booking
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <Instagram size={17} />
              Instagram
            </a>
          </div>

          <div>
            <h3>Lokasi</h3>
            <a href="#" target="_blank" rel="noreferrer">
              <MapPin size={17} />
              Lihat Google Maps
            </a>
            <a href="#rooms">
              <Music size={17} />
              Lihat Ruangan
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 37 Music Studio. All rights reserved.</span>
          <span>Built for mobile-first booking experience.</span>
        </div>
      </Container>
    </footer>
  );
}
