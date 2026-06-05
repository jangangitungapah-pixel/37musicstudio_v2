import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  MessageCircle,
  Music2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { bookingPackages, bookingRooms, bookingTimeSlots } from "../../data/bookingOptions.js";
import { siteConfig } from "../../config/site.js";
import CustomSelect from "../common/CustomSelect.jsx";

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

function getTodayInputValue() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingForm() {
  const roomNames = bookingRooms.map((room) => room.name);
  const packageNames = bookingPackages.map((item) => item.name);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    room: getInitialValueFromQuery("room", roomNames[0]),
    packageName: getInitialValueFromQuery("package", packageNames[0]),
    date: getInitialValueFromQuery("date", ""),
    time: getInitialValueFromQuery("time", bookingTimeSlots[0]),
    peopleCount: "4",
    notes: "",
  });

  const selectedRoom = bookingRooms.find((room) => room.name === form.room) || bookingRooms[0];
  const selectedPackage =
    bookingPackages.find((item) => item.name === form.packageName) || bookingPackages[0];

  const isReady = form.name.trim() && form.phone.trim() && form.date && form.time;

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
          <p>Pilih room, paket, jadwal, lalu kirim request ke admin.</p>
        </div>
      </div>

      <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
        <div className="booking-form-section">
          <p className="booking-form-section-title">1. Data Customer</p>

          <div className="form-grid-two">
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
          </div>
        </div>

        <div className="booking-form-section">
          <p className="booking-form-section-title">2. Pilih Room</p>

          <div className="booking-choice-grid">
            {bookingRooms.map((room) => {
              const isSelected = room.name === form.room;

              return (
                <button
                  type="button"
                  className={`booking-choice-card ${isSelected ? "is-selected" : ""}`}
                  key={room.name}
                  onClick={() => updateField("room", room.name)}
                >
                  <span className="choice-topline">
                    <span>{room.label}</span>
                    {isSelected && <Check size={16} />}
                  </span>

                  <strong>{room.name}</strong>
                  <p>{room.description}</p>

                  <span className="choice-price">{room.price}</span>

                  <span className="choice-tags">
                    {room.tags.map((tag) => (
                      <em key={tag}>{tag}</em>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="booking-form-section">
          <p className="booking-form-section-title">3. Pilih Paket</p>

          <div className="booking-package-grid">
            {bookingPackages.map((item) => {
              const isSelected = item.name === form.packageName;

              return (
                <button
                  type="button"
                  className={`booking-package-card ${isSelected ? "is-selected" : ""}`}
                  key={item.name}
                  onClick={() => updateField("packageName", item.name)}
                >
                  <span className="choice-topline">
                    <strong>{item.name}</strong>
                    {isSelected && <Check size={16} />}
                  </span>

                  <p>{item.description}</p>

                  <span className="package-price">
                    {item.price}
                    <small>{item.unit}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="booking-form-section">
          <p className="booking-form-section-title">4. Jadwal Sesi</p>

          <div className="form-grid-two">
            <label className="form-field">
              <span>
                <CalendarDays size={16} />
                Tanggal
              </span>

              <input
                type="date"
                min={getTodayInputValue()}
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
              />
            </label>

            <label className="form-field">
              <span>
                <Clock size={16} />
                Jam
              </span>

              <CustomSelect
                label="Jam"
                value={form.time}
                options={bookingTimeSlots}
                onChange={(value) => updateField("time", value)}
              />
            </label>
          </div>

          <label className="form-field">
            <span>
              <UsersRound size={16} />
              Jumlah orang
            </span>

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
        </div>

        <div className="booking-summary-card">
          <div>
            <span className="summary-label">Ringkasan Booking</span>
            <h3>{selectedRoom.name}</h3>
            <p>{selectedPackage.name}</p>
          </div>

          <div className="summary-list">
            <span>
              <strong>Tanggal</strong>
              {form.date || "Belum dipilih"}
            </span>
            <span>
              <strong>Jam</strong>
              {form.time}
            </span>
            <span>
              <strong>Customer</strong>
              {form.name || "Belum diisi"}
            </span>
          </div>
        </div>

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
            Isi nama, nomor HP, dan tanggal dulu supaya tombol WhatsApp aktif.
          </p>
        )}
      </form>
    </div>
  );
}
