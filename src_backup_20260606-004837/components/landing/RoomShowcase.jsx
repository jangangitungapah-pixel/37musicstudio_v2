import { Check } from "lucide-react";
import { rooms } from "../../data/rooms.js";
import Button from "../common/Button.jsx";
import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";

export default function RoomShowcase() {
  return (
    <section className="section-block section-alt" id="rooms">
      <Container>
        <SectionHeader
          eyebrow="Pilihan ruangan"
          title="Pilih room sesuai kebutuhan sesi kamu."
          description="Landing page ini disiapkan agar customer bisa cepat membandingkan ruangan sebelum booking."
        />

        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.name}>
              <div className={`room-image room-image-${index + 1}`}>
                <span>{room.badge}</span>
              </div>

              <div className="room-content">
                <h3>{room.name}</h3>
                <p>{room.description}</p>

                <div className="room-price">{room.price}</div>

                <ul>
                  {room.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20tanya%20jadwal%20room."
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="room-button"
                >
                  Tanya Jadwal
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
