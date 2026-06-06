import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { publicCalendarRooms } from "../../../data/publicCalendar.js";

const scheduleTypes = [
  { value: "booking", label: "Booking Customer" },
  { value: "maintenance", label: "Maintenance" },
  { value: "block", label: "Block Room" },
];

const statusByType = {
  booking: [
    { value: "pending", label: "Pending" },
    { value: "booked", label: "Booked" },
  ],
  maintenance: [{ value: "maintenance", label: "Maintenance" }],
  block: [{ value: "blocked", label: "Blocked" }],
};

const sessionCategories = [
  "Latihan Band",
  "Recording",
  "Podcast / Content",
  "Vocal Take",
  "Other",
];

const packageOptions = [
  "Regular Session",
  "Recording Basic",
  "Band Package",
  "Custom",
];

const paymentStatuses = [
  { value: "unpaid", label: "Belum Bayar" },
  { value: "down_payment", label: "DP" },
  { value: "paid", label: "Lunas" },
];

const timeOptions = Array.from({ length: 14 }, (_, index) => {
  const hour = 10 + index;
  return `${String(hour).padStart(2, "0")}.00`;
});

function getTimeNumber(time) {
  return Number.parseInt(time.split(".")[0], 10);
}

function getNextHourLabel(startTime) {
  const hour = getTimeNumber(startTime);
  return `${String(Math.min(hour + 1, 23)).padStart(2, "0")}.00`;
}

function cleanMoney(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

export default function AdminBookingModal({ slot, defaultRoom, onClose, onSave }) {
  const [form, setForm] = useState({
    type: "booking",
    room: defaultRoom || publicCalendarRooms[0],
    date: slot?.date || "",
    startTime: slot?.hour || "10.00",
    endTime: getNextHourLabel(slot?.hour || "10.00"),
    customerName: "",
    customerPhone: "",
    peopleCount: "4",
    sessionCategory: "Latihan Band",
    packageName: "Regular Session",
    status: "pending",
    price: "",
    deposit: "",
    paymentStatus: "unpaid",
    customerNote: "",
    adminNote: "",
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateField = (field, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "type") {
        if (value === "booking") {
          next.status = "pending";
          next.sessionCategory = "Latihan Band";
          next.packageName = "Regular Session";
        }

        if (value === "maintenance") {
          next.status = "maintenance";
          next.sessionCategory = "Other";
          next.packageName = "Custom";
        }

        if (value === "block") {
          next.status = "blocked";
          next.sessionCategory = "Other";
          next.packageName = "Custom";
        }
      }

      if (field === "startTime" && getTimeNumber(next.endTime) <= getTimeNumber(value)) {
        next.endTime = getNextHourLabel(value);
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (getTimeNumber(form.endTime) <= getTimeNumber(form.startTime)) {
      alert("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    if (form.type === "booking" && !form.customerName.trim()) {
      alert("Nama customer wajib diisi.");
      return;
    }

    if (form.type === "booking" && !form.customerPhone.trim()) {
      alert("Nomor WhatsApp wajib diisi.");
      return;
    }

    const price = Number(cleanMoney(form.price) || 0);
    const deposit = Number(cleanMoney(form.deposit) || 0);

    if (deposit > price && price > 0) {
      alert("DP tidak boleh lebih besar dari harga.");
      return;
    }

    const label =
      form.type === "maintenance"
        ? "Room Maintenance"
        : form.type === "block"
          ? "Room Blocked"
          : form.sessionCategory;

    onSave({
      ...form,
      price,
      deposit,
      peopleCount: Number(form.peopleCount || 0),
      label,
      publicLabel: form.type === "booking" ? "Booked" : label,
    });
  };

  const statusOptions = statusByType[form.type] || statusByType.booking;

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-booking-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Tambah jadwal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="admin-booking-modal-header">
          <div>
            <span className="admin-modal-kicker">New Slot</span>
            <h2>Tambah Jadwal</h2>
            <p>
              {slot?.dayName}, {slot?.dateLabel} · {slot?.hour}
            </p>
          </div>

          <button type="button" aria-label="Tutup modal" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="admin-booking-form" onSubmit={handleSubmit}>
          <div className="admin-booking-section">
            <p className="admin-booking-section-title">Slot</p>

            <div className="admin-booking-grid">
              <label>
                <span>Tipe Jadwal</span>
                <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
                  {scheduleTypes.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Room</span>
                <select value={form.room} onChange={(event) => updateField("room", event.target.value)}>
                  {publicCalendarRooms.map((room) => (
                    <option value={room} key={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tanggal</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                />
              </label>

              <label>
                <span>Jam Mulai</span>
                <select value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)}>
                  {timeOptions.slice(0, -1).map((time) => (
                    <option value={time} key={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Jam Selesai</span>
                <select value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)}>
                  {timeOptions.slice(1).map((time) => (
                    <option value={time} key={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  {statusOptions.map((status) => (
                    <option value={status.value} key={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {form.type === "booking" && (
            <>
              <div className="admin-booking-section">
                <p className="admin-booking-section-title">Customer</p>

                <div className="admin-booking-grid">
                  <label>
                    <span>Nama Customer</span>
                    <input
                      value={form.customerName}
                      placeholder="Contoh: Arief"
                      onChange={(event) => updateField("customerName", event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Nomor WhatsApp</span>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      placeholder="Contoh: 0812xxxxxxx"
                      onChange={(event) => updateField("customerPhone", event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Jumlah Orang</span>
                    <input
                      type="number"
                      min="1"
                      value={form.peopleCount}
                      onChange={(event) => updateField("peopleCount", event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="admin-booking-section">
                <p className="admin-booking-section-title">Booking & Payment</p>

                <div className="admin-booking-grid">
                  <label>
                    <span>Kategori Sesi</span>
                    <select value={form.sessionCategory} onChange={(event) => updateField("sessionCategory", event.target.value)}>
                      {sessionCategories.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Paket</span>
                    <select value={form.packageName} onChange={(event) => updateField("packageName", event.target.value)}>
                      {packageOptions.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Harga</span>
                    <input
                      inputMode="numeric"
                      value={form.price}
                      placeholder="Contoh: 75000"
                      onChange={(event) => updateField("price", cleanMoney(event.target.value))}
                    />
                  </label>

                  <label>
                    <span>DP</span>
                    <input
                      inputMode="numeric"
                      value={form.deposit}
                      placeholder="Contoh: 25000"
                      onChange={(event) => updateField("deposit", cleanMoney(event.target.value))}
                    />
                  </label>

                  <label>
                    <span>Status Pembayaran</span>
                    <select value={form.paymentStatus} onChange={(event) => updateField("paymentStatus", event.target.value)}>
                      {paymentStatuses.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="admin-booking-section">
            <p className="admin-booking-section-title">Catatan</p>

            <div className="admin-booking-grid">
              <label className="admin-booking-wide">
                <span>Catatan Customer</span>
                <textarea
                  rows="3"
                  value={form.customerNote}
                  placeholder="Contoh: butuh full band setup."
                  onChange={(event) => updateField("customerNote", event.target.value)}
                />
              </label>

              <label className="admin-booking-wide">
                <span>Catatan Internal Admin</span>
                <textarea
                  rows="3"
                  value={form.adminNote}
                  placeholder="Catatan khusus untuk admin."
                  onChange={(event) => updateField("adminNote", event.target.value)}
                />
              </label>
            </div>
          </div>

          <footer className="admin-booking-modal-actions">
            <button type="button" className="admin-modal-cancel" onClick={onClose}>
              Batal
            </button>

            <button type="submit" className="admin-modal-submit">
              Simpan Jadwal
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}