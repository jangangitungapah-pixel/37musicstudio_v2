import CustomerLayout from "../layouts/CustomerLayout.jsx";
import BookingForm from "../components/booking/BookingForm.jsx";

export default function BookingPage() {
  return (
    <CustomerLayout>
      <section className="booking-page-hero">
        <div className="booking-page-bg">
          <div className="booking-page-glow booking-page-glow-one" />
          <div className="booking-page-glow booking-page-glow-two" />
        </div>

        <div className="container booking-page-container">
          <div className="booking-copy">
            <p className="section-eyebrow">Booking studio</p>
            <h1>Atur jadwal sesi kamu dalam beberapa klik.</h1>
            <p>
              Isi detail singkat di bawah, lalu sistem akan menyusun pesan WhatsApp
              otomatis supaya booking kamu lebih jelas dan cepat diproses.
            </p>

            <div className="booking-note-card">
              <strong>Belum bayar di sini.</strong>
              <span>
                Halaman ini baru membantu menyusun request booking. Konfirmasi jadwal
                tetap dilakukan oleh admin 37 Music Studio via WhatsApp.
              </span>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>
    </CustomerLayout>
  );
}
