import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";

const galleryItems = [
  "Main Room",
  "Drum Area",
  "Guitar Setup",
  "Recording Corner",
  "Control Desk",
  "Cozy Lighting",
];

export default function GallerySection() {
  return (
    <section className="section-block section-alt" id="gallery">
      <Container>
        <SectionHeader
          eyebrow="Studio vibe"
          title="Tempat yang bikin latihan terasa lebih niat."
          description="Gallery sementara dibuat dengan visual placeholder premium. Nanti bisa diganti foto asli studio."
        />

        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div className={`gallery-card gallery-card-${index + 1}`} key={item}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
