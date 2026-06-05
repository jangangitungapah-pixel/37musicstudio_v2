import { Check } from "lucide-react";
import { pricing } from "../../data/pricing.js";
import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";
import Button from "../common/Button.jsx";

export default function PricingSection() {
  return (
    <section className="section-block" id="pricing">
      <Container>
        <SectionHeader
          eyebrow="Harga simple"
          title="Paket jelas, customer nggak perlu nebak-nebak."
          description="Untuk tahap awal, harga dibuat dalam bentuk package card agar nyaman dibaca dari HP."
          align="center"
        />

        <div className="pricing-grid">
          {pricing.map((item, index) => (
            <article className={`pricing-card ${index === 1 ? "pricing-card-featured" : ""}`} key={item.name}>
              {index === 1 && <span className="popular-badge">Recommended</span>}

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="pricing-price">
                <strong>{item.price}</strong>
                <span>{item.unit}</span>
              </div>

              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>
                    <Check size={16} />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Button
                href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20paket%20studio."
                target="_blank"
                rel="noreferrer"
                variant={index === 1 ? "primary" : "secondary"}
              >
                Booking Paket
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
