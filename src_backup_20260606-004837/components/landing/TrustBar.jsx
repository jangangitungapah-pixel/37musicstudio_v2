import { Calendar, Headphones, Shield, Star } from "lucide-react";
import Container from "../common/Container.jsx";

const items = [
  {
    icon: Calendar,
    label: "Booking Cepat",
    text: "Langsung dari HP",
  },
  {
    icon: Headphones,
    label: "Sound Proper",
    text: "Siap latihan & take",
  },
  {
    icon: Shield,
    label: "Ruang Nyaman",
    text: "Cozy dan kedap",
  },
  {
    icon: Star,
    label: "Musisi Lokal",
    text: "Dipercaya komunitas",
  },
];

export default function TrustBar() {
  return (
    <section className="trust-section">
      <Container>
        <div className="trust-grid">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div className="trust-item" key={item.label}>
                <div className="trust-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
