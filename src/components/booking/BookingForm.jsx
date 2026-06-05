import { useMemo, useState } from "react";
import { CalendarDays, Clock, MessageCircle, Music2, UserRound } from "lucide-react";
import { bookingPackages, bookingRooms, bookingTimeSlots } from "../../data/bookingOptions.js";
import { siteConfig } from "../../config/site.js";

function getInitialValueFromQuery(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get(key) || fallback;
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    room: getInitialValueFromQuery("room", bookingRooms[0]),
    packageName: getInitialValueFromQuery("package", bookingPackages[0]),
    date: "",
    time: bookingTimeSlots[0],
    peopleCount: "4",
    notes: "",
  });

  const isReady = form.name.trim() && form.date && form.time;

  const message = useMemo(() => {
    const lines = [
      "Halo 37 Music Studio, saya mau booking jadwal studio.",
      "",
      "Detail Booking:",
      `Nama: ${form.name || "-"}`,
      `No. HP: ${form.phone || "-"}`,
      `Ruangan: ${form.room}`,
      `Paket: ${form.packageName}`,
      `Tanggal: ${form.date || "-"}`,
      `Jam: ${form.time}`,
      `Jumlah orang: ${form.peopleCount || "-"}`,
      `Catatan: ${form.notes || "-"}`,
      "",
      "Mohon info ketersediaan jadwalnya ya. Terima kasih.",
    ];

    return lines.join("\n");
  }, [form]);

  const whatsappUrl = buildWhatsAppUrl(message);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="booking-form-card">
      <div className="booking-form-header">
        <div className="booking-form-icon">
          <Music2 size={24} />
        </div>
        <div>
          <h2>Form Booking</h2>
          <p>Isi data singkat, lalu lanjut konfirmasi via WhatsApp.</p>
        </div>
      </div>

      <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
        <label className="form-field">
          <span>
            <UserRound size={16} />
            Nama customer
          </span>
          <input
            type="text"
            placeholder="Contoh: Arief"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>
            <MessageCircle size={16} />
            Nomor HP
          </span>
          <input
            type="tel"
            placeholder="Contoh: 0812xxxxxxx"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <div className="form-grid-two">
          <label className="form-field">
            <span>Room</span>
            <select
              value={form.room}
              onChange={(event) => updateField("room", event.target.value)}
            >
              {bookingRooms.map((room) => (
                <option value={room} key={room}>
                  {room}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Paket</span>
            <select
              value={form.packageName}
              onChange={(event) => updateField("packageName", event.target.value)}
            >
              {bookingPackages.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-grid-two">
          <label className="form-field">
            <span>
              <CalendarDays size={16} />
              Tanggal
            </span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>
              <Clock size={16} />
              Jam
            </span>
            <select
              value={form.time}
              onChange={(event) => updateField("time", event.target.value)}
            >
              {bookingTimeSlots.map((slot) => (
                <option value={slot} key={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>Jumlah orang</span>
          <input
            type="number"
            min="1"
            placeholder="Contoh: 4"
            value={form.peopleCount}
            onChange={(event) => updateField("peopleCount", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Catatan tambahan</span>
          <textarea
            rows="4"
            placeholder="Contoh: Mau latihan full band, bawa gitar sendiri, butuh info parkir."
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </label>

        <div className="booking-preview">
          <strong>Preview pesan WhatsApp</strong>
          <pre>{message}</pre>
        </div>

        <a
          className={`booking-submit ${isReady ? "" : "is-disabled"}`}
          href={isReady ? whatsappUrl : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!isReady}
        >
          <MessageCircle size={20} />
          Kirim Booking via WhatsApp
        </a>

        {!isReady && (
          <p className="booking-helper">
            Isi minimal nama dan tanggal dulu supaya tombol WhatsApp aktif.
          </p>
        )}
      </form>
    </div>
  );
}
