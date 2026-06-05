import { CreditCard, MapPin, Mic, Music, Volume2, Users } from "lucide-react";
import Container from "../common/Container.jsx";
import SectionHeader from "../common/SectionHeader.jsx";

const features = [
  {
    icon: Volume2,
    title: "Sound Lebih Nendang",
    text: "Setup audio dibuat supaya latihan lebih enak, jelas, dan nggak bikin capek di telinga.",
  },
  {
    icon: Music,
    title: "Full Band Friendly",
    text: "Cocok untuk gitaris, bassist, drummer, vocalist, keyboardist, dan band full format.",
  },
  {
    icon: Mic,
    title: "Recording Ready",
    text: "Butuh take vocal, gitar, atau demo lagu? Tinggal pilih sesi yang sesuai.",
  },
  {
    icon: Users,
    title: "Cozy Buat Jamming",
    text: "Ruang dibuat nyaman supaya latihan nggak cuma produktif, tapi juga asik.",
  },
  {
    icon: CreditCard,
    title: "Harga Transparan",
    text: "Paket dibuat sederhana supaya customer cepat paham sebelum booking.",
  },
  {
    icon: MapPin,
    title: "Mudah Dikunjungi",
    text: "Informasi lokasi dan kontak dibuat jelas agar customer nggak bingung.",
  },
];

export default function StudioFeatures() {
  return (
    <section className="section-block">
      <Container>
        <SectionHeader
          eyebrow="Kenapa pilih 37 Music Studio?"
          title="Semua yang dibutuhkan musisi, dibuat lebih simpel."
          description="Dari latihan rutin sampai produksi konten musik, customer harus bisa paham fasilitas dan langsung booking tanpa ribet."
        />

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
