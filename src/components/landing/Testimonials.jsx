import { Star } from "lucide-react";
import { testimonials } from "../../data/testimonials.js";
import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";

export default function Testimonials() {
  return (
    <section className="section-block">
      <Container>
        <SectionHeader
          eyebrow="Kata mereka"
          title="Dipakai musisi, band, dan kreator lokal."
          description="Testimoni pendek lebih cocok untuk mobile karena cepat dibaca dan langsung membangun trust."
          align="center"
        />

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <div className="stars">
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
      </Container>
    </section>
  );
}
