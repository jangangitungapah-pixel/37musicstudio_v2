import { MessageCircle, Sparkles } from "lucide-react";
import Button from "../common/Button.jsx";
import Container from "../common/Container.jsx";

export default function BookingCTA() {
  return (
    <section className="booking-cta-section">
      <Container>
        <div className="booking-cta-card">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Ready for your next session</span>
          </div>

          <h2>Siap latihan tanpa ribet?</h2>
          <p>
            Cek jadwal, tanya room, dan booking studio langsung dari HP kamu.
            Tinggal klik WhatsApp, pilih sesi, lalu gas latihan.
          </p>

          <Button
            href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal%20studio."
            target="_blank"
            rel="noreferrer"
            size="lg"
          >
            <MessageCircle size={20} />
            Booking via WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
