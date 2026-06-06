import CustomerLayout from "../layouts/CustomerLayout.jsx";
import PublicCalendarGrid from "../components/calendar/PublicCalendarGrid.jsx";

export default function PublicCalendarPage() {
  return (
    <CustomerLayout>
      <section className="public-calendar-page">
        <div className="calendar-page-bg">
          <div className="calendar-page-glow calendar-page-glow-one" />
          <div className="calendar-page-glow calendar-page-glow-two" />
        </div>

        <div className="container public-calendar-container">
          <div className="calendar-hero-copy">
            <p className="section-eyebrow">Calendar availability</p>
            <h1>Jadwal studio yang bisa dicek langsung dari HP.</h1>
            <p>
              Lihat ringkasan slot, filter jam yang paling cocok, lalu klik slot
              tersedia untuk lanjut request booking. Kalender ini disiapkan agar
              nanti bisa langsung tersambung ke jadwal admin.
            </p>
          </div>

          <PublicCalendarGrid />
        </div>
      </section>
    </CustomerLayout>
  );
}
