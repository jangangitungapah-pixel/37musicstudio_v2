import { faqs } from "../../data/faqs.js";
import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";

export default function FAQSection() {
  return (
    <section className="section-block" id="faq">
      <Container>
        <SectionHeader
          eyebrow="Pertanyaan umum"
          title="Biar customer nggak ragu sebelum booking."
          description="FAQ ini nanti bisa dikembangkan sesuai pertanyaan yang paling sering masuk dari WhatsApp."
        />

        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
