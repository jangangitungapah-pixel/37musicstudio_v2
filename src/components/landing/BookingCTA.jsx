import { CalendarCheck, Sparkles } from "lucide-react";
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
            Cek jadwal, pilih room, isi detail singkat, lalu konfirmasi booking
            langsung via WhatsApp dengan format pesan yang sudah rapi.
          </p>

          <Button href="/booking" size="lg">
            <CalendarCheck size={20} />
            Mulai Booking
          </Button>
        </div>
      </Container>
    </section>
  );
}
